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

interface SupervisorAnswer {
  output: string;
  graph?: string;
}

export function Supervisor() {
  const fetcher = useFetcher<SupervisorAnswer>();
  const [answer, setAnswer] = useState("");
  const [graphImage, setGraphImage] = useState<string | null>(null);
  const [question, setQuestion] = useState("");
  const { code, loading: codeLoading } = useExampleCode("supervisor");

  const isSubmitting = fetcher.state === "submitting";
  const response = fetcher.data;

  useEffect(() => {
    if (response) {
      setAnswer(response.output);
      if (response.graph) {
        setGraphImage(response.graph);
      }
    }
  }, [response]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>LangGraph Supervisor Pattern</CardTitle>
        <CardDescription>
          Ask any question and watch the supervisor route it to the appropriate
          specialized agent (Weather, Math, or General Knowledge)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <fetcher.Form method="post" action="/examples">
            <div className="space-y-2">
              <Input type="hidden" name="example" value="supervisor" />
              <div className="flex space-x-4">
                <Input
                  type="text"
                  name="question"
                  value={question}
                  onChange={(e) => setQuestion(e.currentTarget.value)}
                  placeholder="Ask about weather, math, or general knowledge..."
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
                <Button
                  type="submit"
                  disabled={!question || isSubmitting}
                  className="p-2"
                >
                  Submit
                </Button>
              </div>
            </div>
          </fetcher.Form>

          {isSubmitting && <LoadingIndicator className="my-4" />}

          {answer && (
            <div className="space-y-2">
              <h3 className="font-semibold">Agent Response:</h3>
              <Answer content={answer} />
            </div>
          )}

          {graphImage && (
            <div className="space-y-2">
              <h3 className="font-semibold">Supervisor Graph Structure:</h3>
              <img
                src={graphImage}
                alt="Supervisor pattern graph showing routing logic"
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
