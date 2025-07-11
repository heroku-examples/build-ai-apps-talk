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

interface LangGraphAnswer {
  firstAnswer: string;
  secondAnswer: string;
  graph?: string;
}

interface LangGraphProps {
  enablePlayground: boolean;
}

export function LangGraph({ enablePlayground }: LangGraphProps) {
  const fetcher = useFetcher<LangGraphAnswer>();
  const [firstAnswer, setFirstAnswer] = useState("");
  const [secondAnswer, setSecondAnswer] = useState("");
  const [graphImage, setGraphImage] = useState<string | null>(null);
  const [firstQuestion, setFirstQuestion] = useState("");
  const [secondQuestion, setSecondQuestion] = useState("");
  const { code, loading: codeLoading } = useExampleCode("langraph");

  const isSubmitting = fetcher.state === "submitting";
  const response = fetcher.data;

  useEffect(() => {
    if (response) {
      setFirstAnswer(response.firstAnswer);
      setSecondAnswer(response.secondAnswer);
      if (response.graph) {
        setGraphImage(response.graph);
      }
    }
  }, [response]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          LangGraph: Multi-turn Conversation with Graph Visualization
        </CardTitle>
        <CardDescription>
          Ask two questions and see how the agent's thought process is
          visualized
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {enablePlayground && (
            <>
              <fetcher.Form method="post" action="/examples">
                <div className="space-y-2">
                  <Input type="hidden" name="example" value="langraph" />
                  <div className="flex space-x-4">
                    <Input
                      type="text"
                      name="firstQuestion"
                      value={firstQuestion}
                      onChange={(e) => setFirstQuestion(e.currentTarget.value)}
                      placeholder="Ask your first question..."
                      className="flex-grow p-2"
                    />
                    <Input
                      type="text"
                      name="secondQuestion"
                      value={secondQuestion}
                      onChange={(e) => setSecondQuestion(e.currentTarget.value)}
                      placeholder="Ask your second question..."
                      className="flex-grow p-2"
                    />
                    <Button
                      type="submit"
                      disabled={
                        !firstQuestion || !secondQuestion || isSubmitting
                      }
                      className="p-2"
                    >
                      Submit
                    </Button>
                  </div>
                </div>
              </fetcher.Form>

              {isSubmitting && <LoadingIndicator className="my-4" />}

              {firstAnswer && (
                <div className="space-y-2">
                  <h3 className="font-semibold">First Answer:</h3>
                  <Answer content={firstAnswer} />
                </div>
              )}

              {secondAnswer && (
                <div className="space-y-2">
                  <h3 className="font-semibold">Second Answer:</h3>
                  <Answer content={secondAnswer} />
                </div>
              )}

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
