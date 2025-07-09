# Build Agentic AI Applications with Node.js and LangChain

A modern web application demonstrating how to build AI-powered applications using Node.js and LangChain. This project showcases examples for integrating AI capabilities into web applications.

## Features

- 🤖 AI-powered interactions using OpenAI and LangChain
- 🚀 Modern Node.js application architecture
- 📊 PostgreSQL database integration
- 🎨 Clean and responsive UI

## Prerequisites

- Node.js (v20 or higher)
- pnpm package manager
- Heroku Managed Inference and Agents Add-on: `Claude-3-7-Sonnet` and `Cohere-Embed-Multilingual` (for RAG example)
- LangSmith API key (optional for tracing)
- PostgreSQL with pgvector support (for RAG example)
- OpenWeather API key (for Agent example)

## Installation

1. Install pnpm (if not already installed):

    ```shell
    corepack install pnpm
    ```

1. Clone the repository:

    ```shell
    git clone https://github.com/heroku-examples/build-ai-apps-talk
    cd build-ai-apps-talk
    ```

1. Install dependencies:

    ```shell
    pnpm install
    ```

1. Set up environment variables:
   - Copy `.env.sample` to `.env`
   - Fill in your API keys and configuration

## Development

Start the development server:

```shell
pnpm dev
```

The application will be available at `http://localhost:3000`

## Deployment

### Option 1: Deploy to Heroku with One Click

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://www.heroku.com/deploy?template=https://github.com/heroku-examples/build-ai-apps-talk)

### Option 2: Manual Heroku Deployment

> [!NOTE]
> Make sure you have the AI plugin by running: `heroku plugins:install @heroku/plugin-ai`

1. Create a new Heroku app:

    ```shell
    heroku create <app-name>
    ```

2. Add PostgreSQL addon:

    ```shell
    heroku addons:create heroku-postgresql:essential-0
    ```

3. Add Managed Inference and Agents Add-on:

    ```shell
    heroku ai:models:create claude-3-7-sonnet --as INFERENCE
    heroku ai:models:create cohere-embed-multilingual --as EMBEDDING
    ```

> [!NOTE]
> You can find the list of available models by running: `heroku ai:models:list`

4. Set up the database schema:

    ```shell
    heroku pg:psql -f data/schema.sql
    ```

5. Configure environment variables:

    ```shell
    heroku config:set OPENWEATHER_API_KEY=your_key
    ...
    ```

6. Deploy to Heroku:

    ```shell
    git push heroku main
    ```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.