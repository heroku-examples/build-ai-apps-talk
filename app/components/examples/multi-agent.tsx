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
import { json, useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";

interface MultiAgentAnswer {
  output: string[];
  graph: string;
}

export function MultiAgent() {
  const fetcher = useFetcher<MultiAgentAnswer>();
  const [answers, setAnswers] = useState<string[]>([]);
  const [graph, setGraph] = useState<string>("");

  const isSubmitting = fetcher.state === "submitting";
  const output = fetcher.data?.output;
  const graphOutput = fetcher.data?.graph;

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
        <fetcher.Form method="post" action="/examples">
          <Input type="hidden" name="example" value="multi-agent" />
          <div className="flex space-x-4">
            <Input
              type="text"
              name="city"
              placeholder="Enter a city name (e.g., New York, London, Tokyo)"
              className="flex-grow p-2"
              onKeyDown={(e) => {
                const keyCode = e.which || e.keyCode;
                if (keyCode === 13) {
                  setAnswers([]);
                  setGraph("");
                  fetcher.submit(e.currentTarget.form, {
                    method: "POST",
                  });
                }
              }}
            />
            <Button type="submit" className="p-2">
              Analyze
            </Button>
          </div>
        </fetcher.Form>
        {isSubmitting && <LoadingIndicator className="my-4" />}
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
        <Highlight language="typescript">
          {`import "dotenv/config";
import {
  AIMessage,
  HumanMessage,
  SystemMessage,
} from "@langchain/core/messages";
import {
  END,
  MessagesAnnotation,
  START,
  StateGraph,
} from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";

const model = new ChatOpenAI({
  model: process.env.OPENAI_MODEL,
});

function fetchWeatherAgent(city) {
  return async (state) => {
    try {
      const response = await fetch(
        \`https://api.openweathermap.org/data/2.5/weather?units=imperial&q=\${city}&appid=\${process.env.OPENWEATHER_API_KEY}\`,
      );
      const json = await response.json();

      if (!json.main || !json.weather || !json.wind) {
        return {
          messages: [new AIMessage({ content: "No weather data available" })],
        };
      }

      // Use the model to format the weather data in a more natural way
      const weatherPrompt = \`Format this weather data in a clear, natural way: Temperature: \${json.main.temp}°F, Weather: \${json.weather[0].description}, Humidity: \${json.main.humidity}%, Wind Speed: \${json.wind.speed} mph\`;
      const formattedWeather = await model.invoke([
        new SystemMessage(
          "You are a helpful weather assistant. Format weather data in a clear, natural way.",
        ),
        new HumanMessage(weatherPrompt),
      ]);

      const messageContent = \`Weather data for \${city}: \${formattedWeather.content}\`;
      const responseMessage = new AIMessage({ content: messageContent });
      return { messages: [responseMessage] };
    } catch (error) {
      const messageContent = \`Error fetching weather data for \${city}: \${
        error instanceof Error ? error.message : "Unknown error"
      }\`;
      const responseMessage = new AIMessage({ content: messageContent });
      return { messages: [responseMessage] };
    }
  };
}

async function analyzeWeatherAgent(state) {
  const dataMessage = state.messages.find(
    (msg) =>
      msg instanceof AIMessage && msg.content.includes("Weather data for"),
  );
  if (!dataMessage) {
    return {
      messages: [new AIMessage({ content: "No weather data available" })],
    };
  }

  // Use the model to analyze the weather and provide personalized suggestions
  const analysisPrompt = \`Based on this weather data: "\${dataMessage.content}", provide personalized suggestions for activities and clothing. Consider temperature, weather conditions, and general comfort.\`;

  const analysis = await model.invoke([
    new SystemMessage(
      "You are a helpful weather advisor. Provide personalized suggestions based on weather conditions.",
    ),
    new HumanMessage(analysisPrompt),
  ]);

  const responseMessage = new AIMessage({ content: analysis.content });
  return { messages: [responseMessage] };
}

async function localEventsAgent(state) {
  const dataMessage = state.messages.find(
    (msg) =>
      msg instanceof AIMessage && msg.content.includes("Weather data for"),
  );
  if (!dataMessage) {
    return {
      messages: [new AIMessage({ content: "No weather data available" })],
    };
  }

  // Use the model to suggest local events based on weather
  const eventsPrompt = \`Based on this weather data: "\${dataMessage.content}", suggest 2-3 local events or activities that would be enjoyable in these conditions.\`;

  const events = await model.invoke([
    new SystemMessage(
      "You are a local events coordinator. Suggest activities based on current weather conditions.",
    ),
    new HumanMessage(eventsPrompt),
  ]);

  const responseMessage = new AIMessage({ content: events.content });
  return { messages: [responseMessage] };
}

function shouldContinue(state) {
  const dataFetcherMessage = state.messages.find(
    (msg) =>
      msg instanceof AIMessage && msg.content.includes("Weather data for"),
  );

  // If there's no weather data or there's an error, end the workflow
  if (
    !dataFetcherMessage ||
    dataFetcherMessage.content.includes("Error") ||
    dataFetcherMessage.content.includes("No weather data available")
  ) {
    return END;
  }

  // Otherwise
  return ["analyzeWeather", "suggestEvents"];
}

const createGraph = (city) => {
  return new StateGraph(MessagesAnnotation)
    .addNode("fetchWeather", fetchWeatherAgent(city))
    .addNode("analyzeWeather", analyzeWeatherAgent)
    .addNode("suggestEvents", localEventsAgent)
    .addEdge(START, "fetchWeather")
    .addConditionalEdges("fetchWeather", shouldContinue)
    .addEdge("analyzeWeather", END)
    .addEdge("suggestEvents", END)
    .compile();
};

export async function runMultiAgent(city = "New York") {
  const graph = createGraph(city);
  const result = await graph.invoke({
    messages: [
      new HumanMessage(\`Fetch and analyze the current weather for \${city}\`),
    ],
  });

  const compiledGraph = await graph.getGraphAsync();
  const image = await compiledGraph.drawMermaidPng();
  const arrayBuffer = await image.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");
  return {
    messages: result.messages,
    graph: \`data:image/png;base64,\${base64}\`,
  };
}
`}
        </Highlight>
      </CardContent>
    </Card>
  );
}
