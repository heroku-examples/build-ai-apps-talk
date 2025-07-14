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

interface MCPAnswer {
  output?: string;
  graph?: string;
  error?: string;
}

interface MCPProps {
  enablePlayground: boolean;
}

export function MCP({ enablePlayground }: MCPProps) {
  const fetcher = useFetcher<MCPAnswer>();
  const [answer, setAnswer] = useState("");
  const [question, setQuestion] = useState("");
  const [graphImage, setGraphImage] = useState<string | null>(null);
  const { code, loading: codeLoading } = useExampleCode("mcp");

  const isSubmitting = fetcher.state === "submitting";
  const output = fetcher.data?.output;
  const graph = fetcher.data?.graph;
  const apiError = fetcher.data?.error;
  useEffect(() => {
    if (output) {
      setAnswer(output);
    }
  }, [output]);

  useEffect(() => {
    if (graph) {
      setGraphImage(graph);
    }
  }, [graph]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Model Context Protocol</CardTitle>
        <CardDescription>
          Ask questions using the MCP agent with database tools
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
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
                  setAnswer("");
                }}
              >
                <Input type="hidden" name="example" value="mcp" />
                <div className="flex space-x-4">
                  <Input
                    type="text"
                    name="question"
                    value={question}
                    placeholder="Ask a question about the database..."
                    className="flex-grow p-2"
                    onChange={(e) => {
                      setQuestion(e.currentTarget.value);
                    }}
                    onKeyDown={(e) => {
                      const keyCode = e.which || e.keyCode;
                      if (keyCode === 13) {
                        const form = e.currentTarget.form;
                        if (form) {
                          const formData = new FormData(form);
                          const question = formData.get("question") as string;
                          if (question?.trim()) {
                            setAnswer("");
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
              {graphImage && (
                <div className="space-y-2">
                  <h3 className="font-semibold">Agent's Thought Process:</h3>
                  <img
                    src={graphImage}
                    alt="Agent's thought process graph"
                    className="max-w-full"
                  />
                </div>
              )}
            </>
          )}
        </div>
        {codeLoading ? (
          <LoadingIndicator className="my-4" />
        ) : (
          <Highlight language="js">{code}</Highlight>
        )}
      </CardContent>
    </Card>
  );
}
