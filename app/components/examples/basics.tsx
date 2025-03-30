import { Answer } from "@/components/answer/answer";
import { Highlight } from "@/components/hightlight/hightlight";
import { LoadingIndicator } from "@/components/loading-indicator";
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

interface BasicsAnswer {
  output: string;
}

export function Basics() {
  const fetcher = useFetcher<BasicsAnswer>();
  const [answer, setAnswer] = useState("");

  const isSubmitting = fetcher.state === "submitting";
  const output = fetcher.data?.output;

  useEffect(() => {
    if (output) {
      setAnswer(output);
    }
  }, [output]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Hello World: Basic Completion</CardTitle>
        <CardDescription>
          Ask the LLM anything or let it complete something...
        </CardDescription>
      </CardHeader>
      <CardContent>
        <fetcher.Form method="post" action="/examples">
          <Input type="hidden" name="example" value="basics" />
          <div className="flex space-x-4">
            <Input
              type="text"
              name="question"
              placeholder="What is love?"
              className="flex-grow p-2"
              onKeyDown={(e) => {
                const keyCode = e.which || e.keyCode;
                if (keyCode === 13) {
                  setAnswer("");
                  fetcher.submit(e.currentTarget.form, {
                    method: "POST",
                  });
                }
              }}
            />
            <Button type="submit" className="p-2">
              Submit
            </Button>
          </div>
        </fetcher.Form>
        {isSubmitting && <LoadingIndicator className="my-4" />}
        {answer && <Answer content={answer} />}
        <Highlight language="js">
          {`import { OpenAI } from "@langchain/openai";

// Create an instance of a LLM
const llm = new OpenAI({
  model: "gpt-3.5-turbo-instruct",
  temperature: 0.5,
});

export async function getCompletion(input) {
  return llm.invoke(input);
}`}
        </Highlight>
      </CardContent>
    </Card>
  );
}
