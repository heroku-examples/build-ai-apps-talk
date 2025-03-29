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
interface StructuredAnswer {
  output: string;
}

export function Structured() {
  const fetcher = useFetcher<StructuredAnswer>();
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
        <CardTitle>Structured Output</CardTitle>
        <CardDescription>
          Provide a list of ingredients and get a delicious recipe
        </CardDescription>
      </CardHeader>
      <CardContent>
        <fetcher.Form method="post" action="/examples">
          <Input type="hidden" name="example" value="structured" />
          <div className="flex space-x-4">
            <Input
              type="text"
              name="ingredients"
              placeholder="Peach, Flour, Eggs, Sugar"
              className="flex-grow p-2"
              onKeyDown={(e) => {
                const keyCode = e.which || e.keyCode;
                if (keyCode === 13) {
                  fetcher.submit(e.currentTarget.form, {
                    method: "POST",
                  });
                }
              }}
            />
            <Button type="submit" className="p-2">
              Generate Recipe
            </Button>
          </div>
        </fetcher.Form>
        {isSubmitting && <LoadingIndicator className="my-4" />}
        {answer && <Answer content={`\`\`\` json\n${answer}\`\`\``} />}
        <Highlight language="js">
          {`import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import { z } from "zod";

// Create an instance of a LLM
const llm = new ChatOpenAI({
  model: process.env.OPENAI_MODEL,
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
