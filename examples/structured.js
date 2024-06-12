import "dotenv/config";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatOpenAI } from "@langchain/openai";
import { z } from "zod";

// Create an instance of a LLM
const llm = new ChatOpenAI({
	modelName: "gpt-3.5-turbo-0125",
	temperature: 0,
});

// Define object schema for the recipe
const recipe = z.object({
	title: z.string().describe("The title of the recipe"),
	description: z.string().describe("A description of the recipe"),
	ingredients: z
		.array(z.string())
		.describe("A list of ingredients with quantities and units"),
	steps: z.array(z.string()).describe("The steps to prepare the recipe"),
});

// Create a new LLM instance with structured output
const llmWithStructuredOutput = llm.withStructuredOutput(recipe);

// Generate a recipe based on the provided ingredients
export async function generateRecipe(ingredients) {
	const messages = [
		new SystemMessage(
			"You are a chef who is writing a recipe with provided available ingredients.",
		),
		new HumanMessage(`Ingredients: ${ingredients}.`),
	];
	return llmWithStructuredOutput.invoke(messages);
}
