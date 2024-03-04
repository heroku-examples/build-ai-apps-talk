import { PGVectorStore } from "@langchain/community/vectorstores/pgvector";
import { PromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import "dotenv/config";
import { RetrievalQAChain, loadQAStuffChain } from "langchain/chains";
import { YoutubeLoader } from "langchain/document_loaders/web/youtube";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

// Create a vector store that will store the embeddings of the documents
const pgOptions = {
	postgresConnectionOptions: {
		connectionString: process.env.DATABASE_URL,
		ssl: {
			rejectUnauthorized: false,
		},
	},
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
	pgOptions,
);

const retriever = pgVectorStore.asRetriever();

// Load the video transcript and store it in the vector store
export async function loadVideo(url) {
	// Load the video transcript
	const loader = YoutubeLoader.createFromUrl(url, {
		language: "en",
	});
	const docs = await loader.load();

	// Create a text transformer that will split the text into chunks of 1000 characters
	const splitter = new RecursiveCharacterTextSplitter({
		chunkSize: 1000,
		chunkOverlap: 0,
	});

	// Split the documents into chunks of 1000 characters
	const texts = await splitter.splitDocuments(docs);
	pgVectorStore.addDocuments(texts);
}

// Ask a question to the video transcript
export async function askQuestion(question) {
	// Create a chat model that will be used to answer the questions
	const model = new ChatOpenAI({
		model: "gpt-3.5-turbo-1106",
	});

	// Create a prompt template that will be used to format the questions
	const template = `You will answer to questions only based on the following context, which is part of a YouTube video transcript, you will use a friendly language, if you don't know the answer don't try to guess, simply say. I don't know
----
{context}
----
Question: {question}
Answer:`;

	const QA_CHAIN_PROMPT = new PromptTemplate({
		inputVariables: ["context", "question"],
		template,
	});

	// Create a retrieval QA chain that will combine the documents, the retriever and the chat model
	const chain = new RetrievalQAChain({
		combineDocumentsChain: loadQAStuffChain(model, { prompt: QA_CHAIN_PROMPT }),
		retriever,
		returnSourceDocuments: true,
		inputKey: "question",
	});

	// Ask a question
	const query = await chain.invoke({ question });
	return query.text;
}
