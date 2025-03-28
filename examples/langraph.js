import "dotenv/config";
import { HumanMessage } from "@langchain/core/messages";
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { OpenAIEmbeddings } from "@langchain/openai";
import { ChatOpenAI } from "@langchain/openai";
import { WebBrowser } from "langchain/tools/webbrowser";

const model = new ChatOpenAI({
  model: process.env.OPENAI_MODEL,
});
const embeddings = new OpenAIEmbeddings();
const browser = new WebBrowser({ model, embeddings });

const checkpointer = new MemorySaver();
const tools = [browser];

const agent = createReactAgent({
  llm: model,
  tools,
  checkpointSaver: checkpointer,
});

export async function askFirstQuestion(question) {
  const finalState = await agent.invoke(
    {
      messages: [new HumanMessage(question)],
    },
    {
      configurable: { thread_id: "1" },
    },
  );

  return finalState.messages[finalState.messages.length - 1].content;
}

export async function askSecondQuestion(question) {
  const agentNextState = await agent.invoke(
    {
      messages: [new HumanMessage(question)],
    },
    {
      configurable: { thread_id: "1" },
    },
  );

  return agentNextState.messages[agentNextState.messages.length - 1].content;
}

export async function generateGraph() {
  const graph = await agent.getGraphAsync();
  const image = await graph.drawMermaidPng();
  const arrayBuffer = await image.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");
  return `data:image/png;base64,${base64}`;
}
