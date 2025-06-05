import "dotenv/config";
import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github";
import { PGVectorStore } from "@langchain/community/vectorstores/pgvector";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { HerokuMia, HerokuMiaEmbeddings } from "heroku-langchain";
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
    chunkSize: 96,
  };

  const pgVectorStore = await PGVectorStore.initialize(
    new HerokuMiaEmbeddings(),
    pgOptions,
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
  const filteredDocs = docs.filter(
    (doc) => !ignoreFiles.some((file) => doc.metadata.source.includes(file)),
  );

  // Check if the repository already exists in the database
  const repoExists = await pool.query(
    "SELECT id FROM repositories WHERE repo_url = $1",
    [repoUrl],
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
    [repoUrl, owner, repo],
  );

  // Create a text transformer that will split the text into chunks of 512 characters
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1024,
    chunkOverlap: 0,
  });

  // Split the documents into chunks
  const texts = await splitter.splitDocuments(filteredDocs);

  // Vectorize repository content
  const pgVectorStore = await setupPgVector();

  // Add the repository documents to the vector store in batches of 96
  const batchSize = 96;
  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize);
    await pgVectorStore.addDocuments(batch);
    console.log(`Added batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(texts.length / batchSize)} (${batch.length} documents)`);
  }
  await pgVectorStore.addDocuments(texts);

  console.log(`Successfully vectorized ${texts.length} documents`);

  return {
    repoUrl,
    owner,
    repo,
  };
}

// Ask a question about the repository
export async function askQuestion({ question, repoUrl }) {
  // Create a chat model that will be used to answer the questions
  const llm = new HerokuMia({
    temperature: 0,
  });

  // Create a prompt template that will be used to format the questions
  const template = `You will answer questions based on the context provided, which is part of a GitHub repository's code and documentation.
    You will use a friendly language and if you don't know the answer don't try to guess, simply say "Sorry, I don't know the answer."
    Focus on providing accurate technical information about the code and repository. Respond in markdown format.
----
Context: {context}
----
Question: {input}`;

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
    "SELECT repo_url, owner, repo FROM repositories ORDER BY repo_url",
  );
  return result.rows;
}
