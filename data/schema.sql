CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE repositories (
    id SERIAL PRIMARY KEY,
    repo_url TEXT UNIQUE,
    owner TEXT,
    repo TEXT
);

-- repo_embeddings table will be created by LangChain