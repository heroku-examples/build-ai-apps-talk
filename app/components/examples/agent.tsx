import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
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

interface AgentAnswer {
  output?: string;
  error?: string;
}

interface AgentProps {
  enablePlayground: boolean;
}

export function Agent({ enablePlayground }: AgentProps) {
  const fetcher = useFetcher<AgentAnswer>();
  const [answer, setAnswer] = useState("");
  const [question, setQuestion] = useState("");
  const { code, loading: codeLoading } = useExampleCode("agent");

  const isSubmitting = fetcher.state === "submitting";
  const output = fetcher.data?.output;
  const apiError = fetcher.data?.error;

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
            <fetcher.Form
              method="post"
              action="/examples"
              onSubmit={(e) => {
                const formData = new FormData(e.currentTarget);
                const question = formData.get("question") as string;
                if (!question?.trim()) {
                  e.preventDefault();
                  return;
                }
              }}
            >
              <Input type="hidden" name="example" value="agent" />
              <div className="flex space-x-4">
                <Input
                  type="text"
                  name="question"
                  value={question}
                  placeholder="What is the current weather in Atlanta?"
                  className="flex-grow p-2"
                  onChange={(e) => setQuestion(e.currentTarget.value)}
                  onKeyDown={(e) => {
                    const keyCode = e.which || e.keyCode;
                    if (keyCode === 13) {
                      const form = e.currentTarget.form;
                      if (form) {
                        const formData = new FormData(form);
                        const question = formData.get("question") as string;
                        if (question?.trim()) {
                          fetcher.submit(form, {
                            method: "POST",
                          });
                        }
                      }
                    }
                  }}
                />
                <Button
                  type="submit"
                  className="p-2"
                  disabled={!question.trim() || isSubmitting}
                >
                  Ask
                </Button>
              </div>
            </fetcher.Form>
            {isSubmitting && <LoadingIndicator className="my-4" />}
            {apiError && (
              <div className="my-4 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-sm">{apiError}</p>
              </div>
            )}
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
