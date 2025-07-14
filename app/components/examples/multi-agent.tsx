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

interface MultiAgentAnswer {
  output?: string[];
  graph?: string;
  error?: string;
}

interface MultiAgentProps {
  enablePlayground: boolean;
}

export function MultiAgent({ enablePlayground }: MultiAgentProps) {
  const fetcher = useFetcher<MultiAgentAnswer>();
  const [answers, setAnswers] = useState<string[]>([]);
  const [graph, setGraph] = useState<string>("");
  const [city, setCity] = useState("");
  const { code, loading: codeLoading } = useExampleCode("multi-agent");

  const isSubmitting = fetcher.state === "submitting";
  const output = fetcher.data?.output;
  const graphOutput = fetcher.data?.graph;
  const apiError = fetcher.data?.error;

  useEffect(() => {
    if (output) {
      setAnswers(output);
    }
    if (graphOutput) {
      setGraph(graphOutput);
    }
  }, [output, graphOutput]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Multi-Agent Weather Analysis System</CardTitle>
        <CardDescription>
          Enter a city name to get weather analysis using multiple AI agents
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
                const city = formData.get("city") as string;
                if (!city?.trim()) {
                  e.preventDefault();
                  return;
                }
                setAnswers([]);
                setGraph("");
              }}
            >
              <Input type="hidden" name="example" value="multi-agent" />
              <div className="flex space-x-4">
                <Input
                  type="text"
                  name="city"
                  value={city}
                  placeholder="Enter a city name (e.g., New York, London, Tokyo)"
                  className="flex-grow p-2"
                  onChange={(e) => setCity(e.currentTarget.value)}
                  onKeyDown={(e) => {
                    const keyCode = e.which || e.keyCode;
                    if (keyCode === 13) {
                      const form = e.currentTarget.form;
                      if (form) {
                        const formData = new FormData(form);
                        const city = formData.get("city") as string;
                        if (city?.trim()) {
                          setAnswers([]);
                          setGraph("");
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
                  disabled={!city.trim() || isSubmitting}
                >
                  Analyze
                </Button>
              </div>
            </fetcher.Form>
            {isSubmitting && <LoadingIndicator className="my-4" />}
            {apiError && (
              <div className="my-4 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-sm">{apiError}</p>
              </div>
            )}
            {answers.length > 0 && (
              <div className="space-y-4 my-4">
                {answers.map((answer) => (
                  <Answer key={answer} content={answer} />
                ))}
              </div>
            )}
            {graph && (
              <div className="mt-4 p-4 bg-gray-50 rounded">
                <h3 className="font-semibold mb-2">Agent Interaction Graph</h3>
                <img src={graph} alt="Agent Interaction Graph" />
              </div>
            )}
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
