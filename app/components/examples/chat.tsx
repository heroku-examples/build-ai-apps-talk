import { useCallback, useEffect, useRef, useState } from "react";
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

interface ChatAnswer {
  output?: string;
  error?: string;
}

interface Message {
  key: number;
  type: "system" | "human";
  text: string;
}

interface ChatProps {
  enablePlayground: boolean;
}

export function Chat({ enablePlayground }: ChatProps) {
  const fetcher = useFetcher<ChatAnswer>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>();
  const [skill, setSkill] = useState<string>("");
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { code, loading: codeLoading } = useExampleCode("chat");

  const scrollToBottom = useCallback(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, []);

  const handleAddMessage = useCallback(
    (type: "system" | "human" | undefined, text: string | undefined) => {
      if (!type || !text) return;

      setMessages((currentMessages) => [
        ...currentMessages,
        { key: currentMessages.length + 1, type, text },
      ]);
      setTimeout(scrollToBottom, 100);
    },
    [scrollToBottom],
  );

  const isSubmitting = fetcher.state === "submitting";
  const output = fetcher.data?.output;
  const apiError = fetcher.data?.error;

  useEffect(() => {
    if (output) {
      handleAddMessage("system", output);
    }
  }, [output, handleAddMessage]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Chat with History</CardTitle>
        <CardDescription>
          Chat with an specialized LLM with a history of messages
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {enablePlayground && (
          <>
            {messages && messages.length > 0 && (
              <div
                ref={chatContainerRef}
                className="h-[400px] overflow-y-auto border rounded-lg p-3 bg-white"
              >
                <div className="space-y-3">
                  {messages.map((message) => (
                    <div
                      key={message.key}
                      className={`flex ${message.type === "system" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] min-w-[200px] rounded-lg p-2 ${
                          message.type === "system"
                            ? "bg-blue-100 text-blue-900"
                            : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        <div className="text-sm font-semibold mb-0.5">
                          {message.type === "system" ? "Assistant" : "You"}
                        </div>
                        <Answer content={message.text} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {isSubmitting && <LoadingIndicator className="my-4" />}
            <fetcher.Form
              method="post"
              action="/examples"
              onSubmit={(e) => {
                const formData = new FormData(e.currentTarget);
                const skill = formData.get("skill") as string;
                const message = formData.get("message") as string;
                if (!skill?.trim() || !message?.trim()) {
                  e.preventDefault();
                  return;
                }
                handleAddMessage("human", message);
                setMessage("");
              }}
            >
              <Input type="hidden" name="example" value="chat" />
              <div className="flex space-x-4">
                <Input
                  type="text"
                  name="skill"
                  value={skill}
                  placeholder="RPG"
                  className="w-1/12 p-2"
                  onChange={(e) => setSkill(e.currentTarget.value)}
                />
                <Input
                  type="text"
                  name="message"
                  value={message}
                  placeholder="Hello, my name is Julián"
                  className="flex-grow p-2"
                  onChange={(e) => {
                    setMessage(e.currentTarget.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const form = e.currentTarget.form;
                      if (form) {
                        const formData = new FormData(form);
                        const skill = formData.get("skill") as string;
                        const message = formData.get("message") as string;
                        if (skill?.trim() && message?.trim()) {
                          handleAddMessage("human", message);
                          fetcher.submit(form, {
                            method: "POST",
                          });
                          setMessage("");
                        }
                      }
                    }
                  }}
                />
                <Button
                  type="submit"
                  className="p-2"
                  disabled={!skill.trim() || !message?.trim() || isSubmitting}
                  onClick={(_e) => {
                    if (message?.trim()) {
                      handleAddMessage("human", message);
                      setMessage("");
                    }
                  }}
                >
                  Send
                </Button>
              </div>
            </fetcher.Form>
            {apiError && (
              <div className="my-4 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-sm">{apiError}</p>
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
