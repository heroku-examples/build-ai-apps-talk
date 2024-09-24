import "dotenv/config";
import { ChatMessageHistory } from "@langchain/community/stores/message/in_memory";
import { StringOutputParser } from "@langchain/core/output_parsers";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import { ChatOpenAI } from "@langchain/openai";

// Instantiate the chat model
const llm = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0,
});

// Create a prompt template with a placeholder for the chat history
const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are an assistant who is good at {skill}."],
  new MessagesPlaceholder("history"),
  ["human", "{message}"],
]);

// Create a documents chain with the LLM, prompt, and output parser
const chain = prompt.pipe(llm).pipe(new StringOutputParser());

// Create an in-memory store for the chat history
const messageHistory = new ChatMessageHistory();

// Create a runnable with the chain and the chat history
const chainWithHistory = new RunnableWithMessageHistory({
  runnable: chain,
  getMessageHistory: () => messageHistory,
  inputMessagesKey: "message",
  historyMessagesKey: "history",
});

// Ask a question to the assistant
export async function assistantQuestion({ skill, message }) {
  return chainWithHistory.invoke(
    {
      skill,
      message,
    },
    {
      configurable: {
        sessionId: "assistant", // needed in case you are using a memory store like Redis
      },
    },
  );
}
