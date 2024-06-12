import { Highlight } from "@/components/hightlight/hightlight";
import { Button } from "@/components/ui/button";
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

export function LCEL() {
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
		<Card className="w-[1200px]">
			<CardHeader>
				<CardTitle>LCEL: LangChain Expression Language</CardTitle>
				<CardDescription>
					Generate code for a use case in a specified language
				</CardDescription>
			</CardHeader>
			<CardContent>
				<fetcher.Form method="post" action="/examples">
					<Input type="hidden" name="example" value="lcel" />
					<div className="flex space-x-4">
						<Input
							type="text"
							name="language"
							placeholder="JavaScript"
							className="w-1/12 p-2"
						/>
						<Input
							type="text"
							name="problem"
							placeholder="Reverse a string"
							className="flex-grow p-2"
						/>
					</div>
					<Button
						className="my-2"
						onClick={(e) => {
							fetcher.submit(e.currentTarget.form, {
								method: "POST",
							});
						}}
					>
						Generate Code
					</Button>
				</fetcher.Form>
				{isSubmitting && <p>Thinking...</p>}
				{answer && (
					<pre className="overflow-auto bg-white rounded border border-gray-200">
						{answer}
					</pre>
				)}
				<Highlight language="js">
					{`import { ChatOpenAI } from "@langchain/openai";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

// Create an instance of a chat model
const llm = new ChatOpenAI({
  modelName: "gpt-3.5-turbo-0125",
  temperature: 0,
});

// Create a chat prompt
const promptTemplate = ChatPromptTemplate.fromMessages([
  [
    "system",
    \`You are a professional software developer who knows about {language}. 
    Return just the code without any explanations, and not enclosed in markdown.
    You can add inline comments if necessary.\`,
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
`}
				</Highlight>
			</CardContent>
		</Card>
	);
}
