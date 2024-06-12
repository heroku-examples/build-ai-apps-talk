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

export function Structured() {
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
				<CardTitle>Structured Output</CardTitle>
				<CardDescription>
					Provide a list of ingredients and get a delicious recipe
				</CardDescription>
			</CardHeader>
			<CardContent>
				<fetcher.Form method="post" action="/examples">
					<Input type="hidden" name="example" value="structured" />
					<Input
						type="text"
						name="ingredients"
						placeholder="Peach, Flour, Eggs, Sugar"
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
				{answer && (
					<pre className="overflow-auto bg-white rounded border border-gray-200">
						{answer}
					</pre>
				)}
				<Highlight language="js">
					{`import { ChatOpenAI } from "@langchain/openai";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";
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
      "You are a chef who is writing a recipe with provided available ingredients."
    ),
    new HumanMessage(\`Ingredients: \${ingredients}.\`),
  ];
  return llmWithStructuredOutput.invoke(messages);
}
`}
				</Highlight>
			</CardContent>
		</Card>
	);
}
