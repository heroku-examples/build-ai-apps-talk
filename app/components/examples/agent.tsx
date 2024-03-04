import { Highlight } from "@/components/hightlight/hightlight";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";

interface Answer {
	output: string;
}

export function Agent() {
	const fetcher = useFetcher<Answer>();
	const [answer, setAnswer] = useState("");

	const isSubmitting = fetcher.state === "submitting";
	const output = fetcher.data?.output;

	useEffect(() => {
		if (output) {
			setAnswer(output);
		}
	}, [output]);

	return (
		<Card className="w-[800px]">
			<CardHeader>
				<CardTitle>Weather Agent</CardTitle>
				<CardDescription>Ask about the weather by city</CardDescription>
			</CardHeader>
			<CardContent>
				<fetcher.Form method="post" action="/examples">
					<Input type="hidden" name="example" value="agent" />
					<Input
						type="text"
						name="question"
						placeholder="What is the weather in London?"
						onKeyDown={(e) => {
							const keyCode = e.which || e.keyCode;
							if (keyCode === 13) {
								fetcher.submit(e.currentTarget.form, {
									method: "POST",
								});
							}
						}}
					/>
				</fetcher.Form>
				{isSubmitting && <p>Thinking...</p>}
				{answer && <p>{answer}</p>}
				<Highlight language="js">
					{`import { ChatOpenAI } from "@langchain/openai";
import { DynamicTool } from "@langchain/core/tools";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { convertToOpenAIFunction } from "@langchain/core/utils/function_calling";
import { RunnableSequence } from "@langchain/core/runnables";
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
      \`https://api.openweathermap.org/data/2.5/weather?units=imperial&q=\${city}&appid=\${process.env.OPENWEATHER_API_KEY}\`
    );
    const json = await response.json();
    return \`\${json.main.temp}°F and \${json.weather[0].description}\`;
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
  console.log(\`Calling agent executor with query: \${input}\`);
  return executor.invoke({ input });
}
`}
				</Highlight>
			</CardContent>
		</Card>
	);
}
