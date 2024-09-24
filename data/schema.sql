CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS videos (
  id SERIAL PRIMARY KEY,
  title TEXT,
  description TEXT,
  source TEXT
);

-- video_embeddings table will be created by LangChain