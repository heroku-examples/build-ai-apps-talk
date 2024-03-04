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

export function Assistant() {
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
				<CardTitle>Convert units assistant</CardTitle>
				<CardDescription>
					A friendly assistant to convert measurement units
				</CardDescription>
			</CardHeader>
			<CardContent>
				<fetcher.Form method="post" action="/examples">
					<Input type="hidden" name="example" value="assistant" />
					<Input
						type="text"
						name="question"
						placeholder="How much is 10oz in grams?"
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
					{`import OpenAI from "openai";

const openai = new OpenAI(process.env.OPENAI_API_KEY);

const assistant = await openai.beta.assistants.create({
  name: "Unit Conversion",
  instructions: "Convert units of measurement",
  tools: [{ type: "code_interpreter" }],
  model: "gpt-3.5-turbo-1106",
});

export async function assistantQuestion(question) {
  const thread = await openai.beta.threads.create();
  await openai.beta.threads.messages.create(thread.id, {
    role: "user",
    content: question,
  });

  const run = await openai.beta.threads.runs.create(thread.id, {
    assistant_id: assistant.id,
    additional_instructions:
      "Please address the user as Julián in the response",
  });

  const retrieve = (threadId, runId) => {
    return openai.beta.threads.runs.retrieve(threadId, runId);
  };

  const response = async () => {
    const output = [];
    const messages = await openai.beta.threads.messages.list(thread.id);
    messages.body.data.reverse();
    for (const message of messages.body.data) {
      output.push(message.content[0].text.value);
    }
    return output;
  };

  // Wait until is completed
  const waitForResponse = () => new Promise((resolve, reject) => {
    const id = setInterval(async () => {
      const result = await retrieve(thread.id, run.id);
      if (result.status === "completed") {
        clearInterval(id);
        resolve(await response());
      }
    }, 1000);
  })

  return waitForResponse();
}
`}
				</Highlight>
			</CardContent>
		</Card>
	);
}
