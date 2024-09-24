import "dotenv/config";
import { WikipediaQueryRun } from "@langchain/community/tools/wikipedia_query_run";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { DynamicTool } from "@langchain/core/tools";
import { ChatOpenAI } from "@langchain/openai";
import { AgentExecutor } from "langchain/agents";
import { createToolCallingAgent } from "langchain/agents";

// Create an instance of a chat model
const llm = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0,
});

// Create a tool to query Wikipedia
const wikipediaTool = new WikipediaQueryRun({
  topKResults: 1,
  maxDocContentLength: 6000,
});

// Create a custom tool to get the weather
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

// Create a list of tools
const tools = [weatherTool, wikipediaTool];

// Create a prompt template with a placeholder for the agent's scratchpad
const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "You are an assistant who knows about the weather and facts from Wikipedia",
  ],
  ["human", "{input}"],
  ["placeholder", "{agent_scratchpad}"],
]);

// Create an agent with the LLM, tools, and prompt
const agent = createToolCallingAgent({
  llm,
  tools,
  prompt,
});

// Create an agent executor with the agent and tools
const executor = new AgentExecutor({
  agent,
  tools,
});

// Call the agent executor with a query
export async function agentQuestion(input) {
  return executor.invoke({ input });
}
