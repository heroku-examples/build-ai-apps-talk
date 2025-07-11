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
import { useFetcher } from "react-router";

interface BasicsAnswer {
  output: string;
}

interface BasicsProps {
  enablePlayground: boolean;
}

export function Basics({ enablePlayground }: BasicsProps) {
  const fetcher = useFetcher<BasicsAnswer>();
  const {
    code,
    loading: codeLoading,
    error: codeError,
  } = useExampleCode("basics");

  const isSubmitting = fetcher.state === "submitting";
  const answer = fetcher.data?.output;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Hello World: Basic Completion</CardTitle>
        <CardDescription>
          Ask the LLM anything or let it complete something...
        </CardDescription>
      </CardHeader>
      <CardContent>
        {enablePlayground && (
          <>
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
          </>
        )}
        {codeLoading ? (
          <LoadingIndicator className="my-4" />
        ) : codeError ? (
          <div className="my-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">
              Failed to load example code: {codeError}
            </p>
          </div>
        ) : (
          <Highlight language="js">{code}</Highlight>
        )}
      </CardContent>
    </Card>
  );
}
