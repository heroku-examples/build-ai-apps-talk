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

export function Basics() {
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
				<CardTitle>Hello World: Basic Completion</CardTitle>
				<CardDescription>Ask anything to the LLM</CardDescription>
			</CardHeader>
			<CardContent>
				<fetcher.Form method="post" action="/examples">
					<Input type="hidden" name="example" value="basics" />
					<Input
						type="text"
						name="question"
						placeholder="What is the meaning of the universe?"
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
					{`import { OpenAI } from "@langchain/openai";

// Create an instance of a LLM
const llm = new OpenAI({
	modelName: "gpt-3.5-turbo-0125",
	temperature: 0,
});

export async function getCompletion(input) {
	return llm.invoke(input);
}
`}
				</Highlight>
			</CardContent>
		</Card>
	);
}
