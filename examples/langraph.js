import "dotenv/config";
import { HumanMessage } from "@langchain/core/messages";
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
//import { OpenAIEmbeddings } from "@langchain/openai";
import { HerokuMia, HerokuMiaEmbeddings } from "heroku-langchain";
import { WebBrowser } from "langchain/tools/webbrowser";

const model = new HerokuMia({});
const embeddings = new HerokuMiaEmbeddings();
const browser = new WebBrowser({ model, embeddings });

const checkpointer = new MemorySaver();
const tools = [browser];

export async function createAgent() {
  const agent = createReactAgent({
    llm: model,
    tools,
    checkpointer,
  });
  return agent;
}

export async function askFirstQuestion(agent, question, threadId) {
  const finalState = await agent.invoke(
    {
      messages: [new HumanMessage(question)],
    },
    {
      configurable: { thread_id: threadId },
    },
  );

  return finalState.messages[finalState.messages.length - 1].content;
}

export async function askSecondQuestion(agent, question, threadId) {
  const agentNextState = await agent.invoke(
    {
      messages: [new HumanMessage(question)],
    },
    {
      configurable: { thread_id: threadId },
    },
  );

  return agentNextState.messages[agentNextState.messages.length - 1].content;
}

export async function generateGraph(agent) {
  const graph = await agent.getGraphAsync();
  const image = await graph.drawMermaidPng();
  const arrayBuffer = await image.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");
  return `data:image/png;base64,${base64}`;
}
