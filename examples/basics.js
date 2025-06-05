import "dotenv/config";
import { HerokuMia } from "heroku-langchain";

// Create an instance of a LLM
const llm = new HerokuMia({
  temperature: 0.5,
});

export async function getCompletion(input) {
  return llm.invoke(input);
}
