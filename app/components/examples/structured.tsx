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
import { useExampleCode } from "@/utils/misc";
import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
interface StructuredAnswer {
  output: string;
}

export function Structured() {
  const fetcher = useFetcher<StructuredAnswer>();
  const [answer, setAnswer] = useState("");
  const { code, loading: codeLoading } = useExampleCode("structured");

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
        {codeLoading ? (
          <LoadingIndicator className="my-4" />
        ) : (
          <Highlight language="js">{code}</Highlight>
        )}
      </CardContent>
    </Card>
  );
}
