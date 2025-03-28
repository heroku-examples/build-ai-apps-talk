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
import { useEffect, useState } from "react";

interface LangGraphAnswer {
  firstAnswer: string;
  secondAnswer: string;
  graph?: string;
}

export function LangGraph() {
  const fetcher = useFetcher<LangGraphAnswer>();
  const [firstAnswer, setFirstAnswer] = useState("");
  const [secondAnswer, setSecondAnswer] = useState("");
  const [graphImage, setGraphImage] = useState<string | null>(null);
  const [firstQuestion, setFirstQuestion] = useState("");
  const [secondQuestion, setSecondQuestion] = useState("");

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
    <Card className="w-[1200px]">
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
          <fetcher.Form method="post" action="/examples">
            <div className="space-y-2">
              <Input type="hidden" name="example" value="langraph" />
              <Input
                type="text"
                name="firstQuestion"
                value={firstQuestion}
                onChange={(e) => setFirstQuestion(e.currentTarget.value)}
                placeholder="Ask your first question..."
              />
              <Input
                type="text"
                name="secondQuestion"
                value={secondQuestion}
                onChange={(e) => setSecondQuestion(e.currentTarget.value)}
                placeholder="Ask your second question..."
              />
              <Button
                type="submit"
                disabled={!firstQuestion || !secondQuestion || isSubmitting}
              >
                Submit Questions
              </Button>
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
        </div>
        <Highlight language="js">
          {`import "dotenv/config";
import { HumanMessage } from "@langchain/core/messages";
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { OpenAIEmbeddings } from "@langchain/openai";
import { ChatOpenAI } from "@langchain/openai";
import { WebBrowser } from "langchain/tools/webbrowser";

const model = new ChatOpenAI({
  model: process.env.OPENAI_MODEL,
});
const embeddings = new OpenAIEmbeddings();
const browser = new WebBrowser({ model, embeddings });

const checkpointer = new MemorySaver();
const tools = [browser];

const agent = createReactAgent({
  llm: model,
  tools,
  checkpointSaver: checkpointer,
});

export async function askFirstQuestion(question) {
  const finalState = await agent.invoke(
    {
      messages: [new HumanMessage(question)],
    },
    {
      configurable: { thread_id: "1" },
    },
  );

  return finalState.messages[finalState.messages.length - 1].content;
}

export async function askSecondQuestion(question) {
  const agentNextState = await agent.invoke(
    {
      messages: [new HumanMessage(question)],
    },
    {
      configurable: { thread_id: "1" },
    },
  );

  return agentNextState.messages[agentNextState.messages.length - 1].content;
}

export async function generateGraph() {
  const graph = await agent.getGraphAsync();
  const image = await graph.drawMermaidPng();
  const arrayBuffer = await image.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");
  return \`data:image/png;base64,\${base64}\`;
}
`}
        </Highlight>
      </CardContent>
    </Card>
  );
}
