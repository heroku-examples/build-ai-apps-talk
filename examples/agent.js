import {
	ChatPromptTemplate,
	MessagesPlaceholder,
} from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { DynamicTool } from "@langchain/core/tools";
import { convertToOpenAIFunction } from "@langchain/core/utils/function_calling";
import { ChatOpenAI } from "@langchain/openai";
import "dotenv/config";
import { AgentExecutor } from "langchain/agents";

import { formatToOpenAIFunctionMessages } from "langchain/agents/format_scratchpad";
import { OpenAIFunctionsAgentOutputParser } from "langchain/agents/openai/output_parser";

const model = new ChatOpenAI({
	modelName: "gpt-3.5-turbo-1106",
	temperature: 0,
});

const weatherTool = new DynamicTool({
	name: "get_weather",
	description: "Get the weather by city",
	func: async (city) => {
		const response = await fetch(
			`https://api.openweathermap.org/data/2.5/weather?units=imperial&q=${city}&appid=${process.env.OPENWEATHER_API_KEY}`,
		);
		const json = await response.json();
		return `${json.main.temp}°F and ${json.weather[0].description}`;
	},
});

const tools = [weatherTool];

const prompt = ChatPromptTemplate.fromMessages([
	["system", "You are an assistant who knows about the weather."],
	["human", "{input}"],
	new MessagesPlaceholder("agent_scratchpad"),
]);

const modelWithFunctions = model.bind({
	functions: tools.map((tool) => convertToOpenAIFunction(tool)),
});

const runnableAgent = RunnableSequence.from([
	{
		input: (i) => i.input,
		agent_scratchpad: (i) => formatToOpenAIFunctionMessages(i.steps),
	},
	prompt,
	modelWithFunctions,
	new OpenAIFunctionsAgentOutputParser(),
]);

const executor = AgentExecutor.fromAgentAndTools({
	agent: runnableAgent,
	tools,
});

export async function agentQuestion(input) {
	console.log(`Calling agent executor with query: ${input}`);
	return executor.invoke({ input });
}
