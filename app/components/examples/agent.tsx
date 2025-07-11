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

interface AgentAnswer {
  output: string;
}

interface AgentProps {
  enablePlayground: boolean;
}

export function Agent({ enablePlayground }: AgentProps) {
  const fetcher = useFetcher<AgentAnswer>();
  const [answer, setAnswer] = useState("");
  const { code, loading: codeLoading } = useExampleCode("agent");

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
        <CardTitle>Chat Agent with Tool usage</CardTitle>
        <CardDescription>
          Ask about Wikipedia facts and current weather information
        </CardDescription>
      </CardHeader>
      <CardContent>
        {enablePlayground && (
          <>
            <fetcher.Form method="post" action="/examples">
              <Input type="hidden" name="example" value="agent" />
              <div className="flex space-x-4">
                <Input
                  type="text"
                  name="question"
                  placeholder="What is the current weather in Atlanta?"
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
                  Ask
                </Button>
              </div>
            </fetcher.Form>
            {isSubmitting && <LoadingIndicator className="my-4" />}
            {answer && <Answer content={answer} />}
          </>
        )}
        {codeLoading ? (
          <LoadingIndicator className="my-4" />
        ) : (
          <Highlight language="js">{code}</Highlight>
        )}
      </CardContent>
    </Card>
  );
}
