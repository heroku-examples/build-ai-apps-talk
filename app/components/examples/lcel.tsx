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

interface LCELAnswer {
  output: string;
}

const PROGRAMMING_LANGUAGES = [
  "JavaScript",
  "Python",
  "Ruby",
  "Go",
  "Rust",
  "Elixir",
  "Java",
  "C#",
  "PHP",
  "Swift",
  "Kotlin",
  "TypeScript",
];

interface LCELProps {
  enablePlayground: boolean;
}

export function LCEL({ enablePlayground }: LCELProps) {
  const fetcher = useFetcher<LCELAnswer>();
  const [answer, setAnswer] = useState("");
  const [language, setLanguage] = useState("JavaScript");
  const {
    code,
    loading: codeLoading,
    error: codeError,
  } = useExampleCode("lcel");

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
        <CardTitle>LCEL: LangChain Expression Language</CardTitle>
        <CardDescription>
          Generate code for a use case in a specified language
        </CardDescription>
      </CardHeader>
      <CardContent>
        {enablePlayground && (
          <>
            <fetcher.Form method="post" action="/examples">
              <Input type="hidden" name="example" value="lcel" />
              <div className="flex space-x-4">
                <select
                  name="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-[180px] rounded-md border border-input bg-background px-3 py-2"
                >
                  {PROGRAMMING_LANGUAGES.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
                <Input
                  type="text"
                  name="problem"
                  placeholder="Reverse a string"
                  className="flex-grow p-2"
                />
                <Button type="submit" className="p-2">
                  Generate Code
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
