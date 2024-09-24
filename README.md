# Build AI Applications with Node.js and LangChain

## Install

Use pnpm!

```shell
corepack install pnpm
```

Then install dependencies

```shell
pnpm install
```

## Development

Setup `.env` file following `.env.sample` example

- Register for OpenAI API
- Register for Langsmith API

Run development mode

```shell
pnpm dev
```

## Deployment

Create an Heroku app and add Postgres support

```shell
heroku create <app-name>
heroku addons:create heroku-postgresql:essential-0
```

Setup the schema

```shell
heroku pg:psql -f data/schema.sql
```

Setup the environment variables on Heroku

```shell
heroku config:set CONFIG_VAR=value
```

Deploy to Heroku!

```shell
git push heroku main
```
