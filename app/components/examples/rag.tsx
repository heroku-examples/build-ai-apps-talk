import { Answer } from "@/components/answer/answer";
import { Highlight } from "@/components/hightlight/hightlight";
import { LoadingIndicator } from "@/components/loading-indicator";
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
import { IconBrandGithub } from "@tabler/icons-react";
import { useEffect, useState } from "react";

interface RepoData {
  repoUrl: string;
  owner: string;
  repo: string;
}

interface RAGAnswer {
  output: string;
}

export function Rag() {
  const questionFetcher = useFetcher<RAGAnswer>();
  const repoFetcher = useFetcher<RepoData>();
  const reposFetcher = useFetcher<RepoData[]>();
  const [answer, setAnswer] = useState("");
  const [question, setQuestion] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [repoData, setRepoData] = useState<RepoData | null>(null);
  const [repositories, setRepositories] = useState<RepoData[]>([]);
  const [error, setError] = useState<string | null>(null);

  const isSubmitting = questionFetcher.state === "submitting";
  const questionOutput = questionFetcher.data?.output;

  const isRepoSubmitting = repoFetcher.state === "submitting";
  const repoOutput = repoFetcher.data;

  const reposOutput = reposFetcher.data;

  useEffect(() => {
    if (questionOutput) {
      setAnswer(questionOutput);
    }
  }, [questionOutput]);

  useEffect(() => {
    if (repoOutput) {
      setRepoData(repoOutput);
      setRepoUrl(repoOutput.repoUrl);
      // Refresh the repositories list when a new repo is loaded
      reposFetcher.submit(
        { example: "rag-repos" },
        { method: "POST", action: "/examples" },
      );
    }
  }, [repoOutput, reposFetcher.submit]);

  useEffect(() => {
    if (reposOutput) {
      setRepositories(reposOutput);
    }
  }, [reposOutput]);

  useEffect(() => {
    // Fetch repositories when component mounts
    reposFetcher.submit(
      { example: "rag-repos" },
      { method: "POST", action: "/examples" },
    );
  }, [reposFetcher.submit]);

  const formatRepoUrl = (input: string) => {
    // Remove any existing GitHub URL prefix
    const cleanUrl = input.replace(/^https?:\/\/github\.com\//, "");
    
    // Validate the format (owner/repo)
    if (!/^[a-zA-Z0-9-]+\/[a-zA-Z0-9._-]+$/.test(cleanUrl)) {
      throw new Error("Invalid GitHub repository format. Use owner/repo");
    }
    
    // Add the GitHub URL prefix
    return `https://github.com/${cleanUrl}`;
  };

  const handleRepoSelect = (value: string) => {
    setRepoUrl(value);
    setRepoData(repositories.find((repo) => repo.repoUrl === value) || null);
    setAnswer("");
    setQuestion("");
  };

  const handleRepoSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setAnswer("");
    setQuestion("");
    
    const form = e.currentTarget;
    const repoInput = form.querySelector('input[name="repo"]') as HTMLInputElement;
    
    if (!repoInput.value.trim()) {
      setError("Please enter a repository URL");
      return;
    }

    try {
      const formattedUrl = formatRepoUrl(repoInput.value);
      repoInput.value = formattedUrl;
      repoFetcher.submit(form, {
        method: "POST",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid repository URL");
    }
  };

  return (
    <Card className="w-[1200px]">
      <CardHeader>
        <CardTitle>Retrieval-Augmented Generation</CardTitle>
        <CardDescription>
          Ask questions about a GitHub repository
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex space-x-4">
            <div className="relative w-[300px]">
              <div className="flex items-center space-x-2 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                <IconBrandGithub className="h-4 w-4" />
                <select
                  value={repoUrl}
                  onChange={(e) => handleRepoSelect(e.target.value)}
                  className="w-full bg-transparent focus:outline-none"
                >
                  <option value="">Select a repository</option>
                  {repositories.map((repo) => (
                    <option key={repo.repoUrl} value={repo.repoUrl}>
                      {repo.owner}/{repo.repo}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex-grow">
              <repoFetcher.Form
                method="post"
                action="/examples"
                className="flex space-x-4"
                onSubmit={handleRepoSubmit}
              >
                <Input type="hidden" name="example" value="rag-load" />
                <div className="relative flex-grow">
                  <Input
                    type="text"
                    name="repo"
                    placeholder="GitHub repository URL (e.g., owner/repo)"
                    className="flex-grow p-2"
                  />
                  {error && (
                    <p className="mt-1 left-0 text-sm text-red-500">
                      {error}
                    </p>
                  )}
                </div>
                <Button type="submit" className="p-2">
                  Load repository
                </Button>
              </repoFetcher.Form>
            </div>
          </div>
          <div className="p-2">
            {isRepoSubmitting && <p>Loading repository content...</p>}
            {(repoData || repoUrl) && (
              <div className="mt-2">
                <a
                  href={formatRepoUrl(repoUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  View repository on GitHub
                </a>
              </div>
            )}
          </div>
          <div>
            {(repoData || repoUrl) && (
              <questionFetcher.Form method="post" action="/examples">
                <Input type="hidden" name="example" value="rag" />
                <Input type="hidden" name="repoUrl" value={formatRepoUrl(repoUrl)} />
                <Input
                  type="text"
                  name="question"
                  value={question}
                  placeholder="Ask a question about the repository..."
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
          {isSubmitting && <LoadingIndicator className="my-4" />}
          {answer && <Answer content={answer} />}
        </div>
        <Highlight language="js">
          {`import "dotenv/config";
import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github";
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
    tableName: "repo_embeddings",
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

// Load the repository content and store it in the vector store
export async function loadRepo(repoUrl) {
  // Extract owner and repo from URL
  const [owner, repo] = repoUrl.split("/").slice(-2);

  // Load the repository content
  const loader = new GithubRepoLoader(repoUrl, {
    branch: "main",
    recursive: true,
    unknown: "warn",
    maxConcurrency: 10,
    accessToken: process.env.GITHUB_TOKEN,
  });
  
  const docs = await loader.load();

  // Ignore files manually
  const ignoreFiles = [
    "node_modules",
    "dist",
    "package-lock.json",
    "yarn.lock",
    "pnpm-lock.yaml",
    "bun.lockb",
    "CONTRIBUTING.md",
    "LICENSE",
    "LICENSE.md",
    "CHANGELOG.md",
    "SECURITY.md",
    "CODE_OF_CONDUCT.md",
  ];
  const filteredDocs = docs.filter((doc) => !ignoreFiles.some((file) => doc.metadata.source.includes(file)));


  // Check if the repository already exists in the database
  const repoExists = await pool.query(
    "SELECT id FROM repositories WHERE repo_url = $1",
    [repoUrl]
  );

  // Repository already exists, don't vectorize it
  if (repoExists.rows.length > 0) {
    return {
      repoUrl,
      owner,
      repo,
    };
  }

  // Insert the repository metadata into the database
  await pool.query(
    "INSERT INTO repositories (repo_url, owner, repo) VALUES ($1, $2, $3) RETURNING id",
    [repoUrl, owner, repo]
  );

  // Create a text transformer that will split the text into chunks of 1000 characters
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 0,
  });

  // Split the documents into chunks
  const texts = await splitter.splitDocuments(filteredDocs);

  // Vectorize repository content
  const pgVectorStore = await setupPgVector();

  // Add the repository documents to the vector store
  pgVectorStore.addDocuments(texts);
  return {
    repoUrl,
    owner,
    repo,
  };
}

// Ask a question about the repository
export async function askQuestion({ question, repoUrl }) {
  // Create a chat model that will be used to answer the questions
  const llm = new ChatOpenAI({
    model: process.env.OPENAI_MODEL,
  });

  // Create a prompt template that will be used to format the questions
  const template = \`You will answer questions based on the context provided, which is part of a GitHub repository's code and documentation.
    You will use a friendly language and if you don't know the answer don't try to guess, simply say "Sorry, I don't know the answer."
    Focus on providing accurate technical information about the code and repository. Respond in markdown format.
----
Context: {context}
----
Question: {input}\`;

  const prompt = ChatPromptTemplate.fromTemplate(template);

  // Setup the vector database with pgvector
  const pgVectorStore = await setupPgVector();
  const retriever = pgVectorStore.asRetriever(8, {
    repository: repoUrl,
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

// Get all repositories from the database
export async function getRepositories() {
  const result = await pool.query(
    "SELECT repo_url, owner, repo FROM repositories ORDER BY repo_url"
  );
  return result.rows;
}
`}
        </Highlight>
      </CardContent>
    </Card>
  );
}
