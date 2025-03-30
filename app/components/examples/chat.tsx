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
import { useFetcher } from "@remix-run/react";
import { useCallback, useEffect, useRef, useState } from "react";

interface ChatAnswer {
  output: string;
}

interface Message {
  key: number;
  type: "system" | "human";
  text: string;
}

export function Chat() {
  const fetcher = useFetcher<ChatAnswer>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>();
  const chatContainerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (output) {
      handleAddMessage("system", output);
      setTimeout(scrollToBottom, 100);
    }
  }, [output, handleAddMessage, scrollToBottom]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Chat with History</CardTitle>
        <CardDescription>
          Chat with an specialized LLM with a history of messages
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
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
        <fetcher.Form method="post" action="/examples">
          <Input type="hidden" name="example" value="chat" />
          <div className="flex space-x-4">
            <Input
              type="text"
              name="skill"
              placeholder="RPG"
              className="w-1/12 p-2"
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
                  if (message?.trim()) {
                    handleAddMessage("human", message);
                    fetcher.submit(e.currentTarget.form, {
                      method: "POST",
                    });
                    setMessage("");
                  }
                }
              }}
            />
            <Button
              type="submit"
              className="p-2"
              onClick={(e) => {
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
        <Highlight language="js">
          {`import "dotenv/config";
import { ChatMessageHistory } from "@langchain/community/stores/message/in_memory";
import { StringOutputParser } from "@langchain/core/output_parsers";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import { ChatOpenAI } from "@langchain/openai";

// Instantiate the chat model
const llm = new ChatOpenAI({
  model: process.env.OPENAI_MODEL,
  temperature: 0,
});

// Create a prompt template with a placeholder for the chat history
const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are an assistant who is good at {skill}."],
  new MessagesPlaceholder("history"),
  ["human", "{message}"],
]);

// Create a documents chain with the LLM, prompt, and output parser
const chain = prompt.pipe(llm).pipe(new StringOutputParser());

// Create an in-memory store for the chat history
const messageHistory = new ChatMessageHistory();

// Create a runnable with the chain and the chat history
const chainWithHistory = new RunnableWithMessageHistory({
  runnable: chain,
  getMessageHistory: () => messageHistory,
  inputMessagesKey: "message",
  historyMessagesKey: "history",
});

// Ask a question to the assistant
export async function assistantQuestion({ skill, message }) {
  return chainWithHistory.invoke(
    {
      skill,
      message,
    },
    {
      configurable: {
        sessionId: "assistant", // needed in case you are using a memory store like Redis
      },
    },
  );
}
`}
        </Highlight>
      </CardContent>
    </Card>
  );
}
