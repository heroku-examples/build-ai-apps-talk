import "dotenv/config";
import { ChatHeroku } from "heroku-langchain";

// Create an instance of a LLM
const llm = new ChatHeroku({
  temperature: 0.5,
});

export async function getCompletion(input) {
  return llm.invoke(input);
}
