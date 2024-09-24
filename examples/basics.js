import "dotenv/config";
import { OpenAI } from "@langchain/openai";

// Create an instance of a LLM
const llm = new OpenAI({
  model: "gpt-3.5-turbo-instruct",
  temperature: 0.5,
});

export async function getCompletion(input) {
  return llm.invoke(input);
}
