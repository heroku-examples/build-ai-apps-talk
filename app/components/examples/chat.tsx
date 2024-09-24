import { Highlight } from "@/components/hightlight/hightlight";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useFetcher } from "@remix-run/react";
import { useCallback, useEffect, useState } from "react";

interface Answer {
  output: string;
}

interface Message {
  key: number;
  type: "system" | "human";
  text: string;
}

export function Chat() {
  const fetcher = useFetcher<Answer>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>();

  const handleAddMessage = useCallback(
    (type: "system" | "human" | undefined, text: string | undefined) => {
      if (!type || !text) return;

      setMessages((currentMessages) => [
        ...currentMessages,
        { key: currentMessages.length + 1, type, text },
      ]);
    },
    [],
  );

  const isSubmitting = fetcher.state === "submitting";
  const output = fetcher.data?.output;

  useEffect(() => {
    if (output) {
      handleAddMessage("system", output);
    }
  }, [output, handleAddMessage]);

  return (
    <Card className="w-[1200px]">
      <CardHeader>
        <CardTitle>Chat with History</CardTitle>
        <CardDescription>
          Chat with an specialized LLM with a history of messages
        </CardDescription>
      </CardHeader>
      <CardContent>
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
                const keyCode = e.which || e.keyCode;
                if (keyCode === 13) {
                  handleAddMessage("human", message);
                  fetcher.submit(e.currentTarget.form, {
                    method: "POST",
                  });
                  setMessage("");
                }
              }}
            />
          </div>
        </fetcher.Form>
        {isSubmitting && <p>Thinking...</p>}
        {messages && (
          <div className="space-y-2">
            {messages.map((message) => (
              <div
                key={message.key}
                className={message.type === "system" ? "text-right" : ""}
              >
                <p>
                  {message.type}: {message.text}
                </p>
              </div>
            ))}
          </div>
        )}
        <Highlight language="js">
          {`import { ChatMessageHistory } from "@langchain/community/stores/message/in_memory";
import { StringOutputParser } from "@langchain/core/output_parsers";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import { ChatOpenAI } from "@langchain/openai";

// Instantiate the chat model
const llm = new ChatOpenAI({
  model: "gpt-4o-mini",
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
    }
  );
}
`}
        </Highlight>
      </CardContent>
    </Card>
  );
}
