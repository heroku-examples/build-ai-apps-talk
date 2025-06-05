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
import { useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";

interface MCPAnswer {
  output: string;
  graph?: string;
}

export function MCP() {
  const fetcher = useFetcher<MCPAnswer>();
  const [answer, setAnswer] = useState("");
  const [question, setQuestion] = useState("");
  const [graphImage, setGraphImage] = useState<string | null>(null);
  const { code, loading: codeLoading } = useExampleCode("mcp");

  const isSubmitting = fetcher.state === "submitting";
  const output = fetcher.data?.output;
  const graph = fetcher.data?.graph;
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
          <fetcher.Form method="post" action="/examples">
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
                    setAnswer("");
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
