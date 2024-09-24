import { Highlight } from "@/components/hightlight/hightlight";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";
import { set } from "zod";

interface VideoAnswer {
  url: string;
  source: string;
}

interface QuestionAnswer {
  output: string;
}

export function Rag() {
  const questionFetcher = useFetcher<QuestionAnswer>();
  const videoFetcher = useFetcher<VideoAnswer>();
  const [answer, setAnswer] = useState("");
  const [question, setQuestion] = useState("");
  const [source, setSource] = useState("");
  const [video, setVideo] = useState("");

  const isSubmitting = questionFetcher.state === "submitting";
  const questionOutput = questionFetcher.data?.output;

  const isVideoSubmitting = videoFetcher.state === "submitting";
  const videoOutput = videoFetcher.data?.url as string;
  const sourceOutput = videoFetcher.data?.source as string;

  useEffect(() => {
    if (questionOutput) {
      setAnswer(questionOutput);
    }
  }, [questionOutput]);

  useEffect(() => {
    if (videoOutput) {
      setVideo(videoOutput);
      setSource(sourceOutput);
    }
  }, [videoOutput, sourceOutput]);

  return (
    <Card className="w-[1200px]">
      <CardHeader>
        <CardTitle>Retrieval-Augmented Generation</CardTitle>
        <CardDescription>Ask questions to a YouTube video</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <videoFetcher.Form
            method="post"
            action="/examples"
            className="pb-2"
            onSubmit={(e) => {
              e.preventDefault();
              setAnswer("");
              setQuestion("");
              videoFetcher.submit(e.currentTarget, {
                method: "POST",
              });
            }}
          >
            <Input type="hidden" name="example" value="rag-load" />
            <div className="flex space-x-4">
              <Input
                type="text"
                name="video"
                placeholder="YouTube video URL"
                className="flex-grow p-2"
              />
              <Button type="submit" className="p-2">
                Load video
              </Button>
            </div>
            <div className="p-2">
              {isVideoSubmitting && <p>Vectorizing video...</p>}
              {video && (
                <div>
                  <iframe
                    width="560"
                    height="315"
                    src={video}
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  />
                </div>
              )}
            </div>
          </videoFetcher.Form>
          <div>
            {video && (
              <questionFetcher.Form method="post" action="/examples">
                <Input type="hidden" name="example" value="rag" />
                <Input type="hidden" name="source" value={source} />
                <Input
                  type="text"
                  name="question"
                  value={question}
                  placeholder="What is Heroku?"
                  onChange={(e) => {
                    setQuestion(e.currentTarget.value);
                  }}
                  onKeyDown={(e) => {
                    const keyCode = e.which || e.keyCode;
                    if (keyCode === 13) {
                      setAnswer("");
                      questionFetcher.submit(e.currentTarget.form, {
                        method: "POST",
                      });
                    }
                  }}
                />
              </questionFetcher.Form>
            )}
          </div>
          {isSubmitting && <p>Thinking...</p>}
          {answer && <p>{answer}</p>}
        </div>
        <Highlight language="js">
          {`import { YoutubeLoader } from "@langchain/community/document_loaders/web/youtube";
import { PGVectorStore } from "@langchain/community/vectorstores/pgvector";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import pg from "pg";

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Setup the vector store with pgvector
async function setupPgVector() {
  // Create a vector store that will store the embeddings of the documents
  const pgOptions = {
    pool,
    tableName: "video_embeddings",
    columns: {
      idColumnName: "id",
      vectorColumnName: "vector",
      contentColumnName: "content",
      metadataColumnName: "metadata",
    },
  };

  const pgVectorStore = await PGVectorStore.initialize(
    new OpenAIEmbeddings(),
    pgOptions
  );

  return pgVectorStore;
}

// Load the video transcript and store it in the vector store
export async function loadVideo(url) {
  // Load the video transcript
  const loader = YoutubeLoader.createFromUrl(url, {
    language: "en",
    addVideoInfo: true,
  });
  const docs = await loader.load();

  // Get video metadata
  const { title, description, source } = docs[0].metadata;

  const embedUrl = \`https://www.youtube.com/embed/\${source}\`;

  // Check if the video already exists in the database
  const videoExists = await pool.query(
    "SELECT id FROM videos WHERE source = $1",
    [source]
  );

  // Video already exists, don't vectorize it, just return the embed URL
  if (videoExists.rows.length > 0) {
    return {
      url: embedUrl,
      source,
    };
  }

  // Insert the video metadata into the database
  await pool.query(
    "INSERT INTO videos (title, description, source) VALUES ($1, $2, $3) RETURNING id",
    [title, description, source]
  );

  // Create a text transformer that will split the text into chunks of 1000 characters
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 0,
  });

  // Split the documents into chunks of 1000 characters
  const texts = await splitter.splitDocuments(docs);

  // Vectorize video transcript
  const pgVectorStore = await setupPgVector();

  // Add the video transcript documents to the vector store
  pgVectorStore.addDocuments(texts);
  return {
    url: embedUrl,
    source,
  };
}

// Ask a question to the video transcript
export async function askQuestion({ question, source }) {
  // Create a chat model that will be used to answer the questions
  const llm = new ChatOpenAI({
    model: "gpt-4o-mini",
  });

  // Create a prompt template that will be used to format the questions
  const template = \`You will answer to questions only based on the context provided, which is part of a YouTube video transcript.
    You will use a friendly language and if you don't know the answer don't try to guess, simply say. Sorry, I don't know the answer.
----
Context: {context}
----
Question: {input}\`;

  const prompt = ChatPromptTemplate.fromTemplate(template);

  // Setup the vector database with pgvector
  const pgVectorStore = await setupPgVector();
  const retriever = pgVectorStore.asRetriever(8, {
    source,
  });
  const outputParser = new StringOutputParser();

  // Create a documents chain with the LLM, prompt, and output parser
  const combineDocsChain = await createStuffDocumentsChain({
    llm,
    prompt,
    outputParser,
  });

  // Create a retrieval chain with the retriever and the documents chain
  const chain = await createRetrievalChain({
    retriever,
    combineDocsChain,
  });

  // Ask a question
  const query = await chain.invoke({ input: question });
  return query.answer;
}
`}
        </Highlight>
      </CardContent>
    </Card>
  );
}
