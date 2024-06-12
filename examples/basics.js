import "dotenv/config";
import { OpenAI } from "@langchain/openai";

// Create an instance of a LLM
const llm = new OpenAI({
	modelName: "gpt-3.5-turbo-0125",
	temperature: 0,
});

export async function getCompletion(input) {
	return llm.invoke(input);
}
