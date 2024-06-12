import "dotenv/config";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatOpenAI } from "@langchain/openai";

// Create an instance of a chat model
const llm = new ChatOpenAI({
	modelName: "gpt-3.5-turbo-0125",
	temperature: 0,
});

// Create a chat prompt
const promptTemplate = ChatPromptTemplate.fromMessages([
	[
		"system",
		`You are a professional software developer who knows about {language}. 
    Return just the code without any explanations, and not enclosed in markdown.
    You can add inline comments if necessary.`,
	],
	["human", "Generate code for the following use case: {problem}"],
]);

// Example of composing Runnables with pipe
const chain = promptTemplate.pipe(llm).pipe(new StringOutputParser());

export async function generateCode({ language, problem }) {
	return chain.invoke({ language, problem });
}

// Example of composing Runnables with RunnableSequence
const chain2 = RunnableSequence.from([
	promptTemplate,
	llm,
	new StringOutputParser(),
]);

const output2 = await chain2.invoke({
	language: "Elixir",
	problem: "reverse a string",
});
console.log(output2);
