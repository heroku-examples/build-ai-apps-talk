import "dotenv/config";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import {
  Annotation,
  END,
  MessagesAnnotation,
  START,
  StateGraph,
} from "@langchain/langgraph";
import { HerokuMia } from "heroku-langchain";

const model = new HerokuMia({ temperature: 0 });

// Define the state for the supervisor graph
const SupervisorState = Annotation.Root({
  messages: Annotation({
    reducer: (x, y) => x.concat(y),
    default: () => [],
  }),
  route: Annotation({
    reducer: (x, y) => y ?? x,
    default: () => "general",
  }),
});

// Define worker agents
async function weatherAgent(state) {
  // Get the original human question (first message)
  const humanMessage = state.messages.find(
    (msg) => msg.constructor.name === "HumanMessage",
  );
  if (!humanMessage) {
    throw new Error("No human message found in state");
  }

  const response = await model.invoke([
    new SystemMessage(
      "You are a weather expert. Answer weather-related questions with helpful information about weather conditions, forecasts, and climate.",
    ),
    humanMessage,
  ]);
  return { messages: [response] };
}

async function mathAgent(state) {
  // Get the original human question (first message)
  const humanMessage = state.messages.find(
    (msg) => msg.constructor.name === "HumanMessage",
  );
  if (!humanMessage) {
    throw new Error("No human message found in state");
  }

  const response = await model.invoke([
    new SystemMessage(
      "You are a mathematics expert. Solve mathematical problems, explain mathematical concepts, and help with calculations.",
    ),
    humanMessage,
  ]);
  return { messages: [response] };
}

async function generalAgent(state) {
  // Get the original human question (first message)
  const humanMessage = state.messages.find(
    (msg) => msg.constructor.name === "HumanMessage",
  );
  if (!humanMessage) {
    throw new Error("No human message found in state");
  }

  const response = await model.invoke([
    new SystemMessage(
      "You are a helpful general knowledge assistant. Answer questions about various topics with accurate and helpful information.",
    ),
    humanMessage,
  ]);
  return { messages: [response] };
}

// Supervisor agent that routes to appropriate worker
async function supervisor(state) {
  // Get the original human question
  const humanMessage = state.messages.find(
    (msg) => msg.constructor.name === "HumanMessage",
  );
  if (!humanMessage || !humanMessage.content) {
    throw new Error("No valid human message found in state");
  }

  const routingPrompt = `You are a supervisor that routes questions to specialized agents. 
Based on the following question, decide which agent should handle it:
- "weather" for weather-related questions
- "math" for mathematical problems or calculations
- "general" for general knowledge questions

Question: ${humanMessage.content}

Respond with only one word: weather, math, or general`;

  const response = await model.invoke([
    new SystemMessage(
      "You are a routing supervisor. Respond with only one word: weather, math, or general",
    ),
    new HumanMessage(routingPrompt),
  ]);

  const route = response.content?.toLowerCase().trim() || "general";

  // Add supervisor's routing decision to messages
  const routingMessage = new SystemMessage(
    `Supervisor routed to: ${route} agent`,
  );
  return {
    messages: [routingMessage],
    route: route,
  };
}

// Define the routing logic
function route(state) {
  const routeDecision = state.route || "general";

  if (routeDecision.includes("weather")) {
    return "weather_agent";
  }
  if (routeDecision.includes("math")) {
    return "math_agent";
  }
  return "general_agent";
}

// Create the supervisor graph
export function createSupervisorGraph() {
  const workflow = new StateGraph(SupervisorState)
    .addNode("supervisor", supervisor)
    .addNode("weather_agent", weatherAgent)
    .addNode("math_agent", mathAgent)
    .addNode("general_agent", generalAgent)
    .addEdge(START, "supervisor")
    .addConditionalEdges("supervisor", route)
    .addEdge("weather_agent", END)
    .addEdge("math_agent", END)
    .addEdge("general_agent", END);

  return workflow.compile();
}

export async function askSupervisorQuestion(question) {
  if (!question || typeof question !== "string") {
    throw new Error("Question must be a non-empty string");
  }

  const graph = createSupervisorGraph();

  const result = await graph.invoke({
    messages: [new HumanMessage(question)],
  });

  // Return the final agent response (last message)
  const agentResponse = result.messages[result.messages.length - 1];

  if (!agentResponse || !agentResponse.content) {
    throw new Error("No valid response received from agent");
  }

  return agentResponse.content;
}

export async function generateSupervisorGraph() {
  const graph = createSupervisorGraph();
  const graphAsync = await graph.getGraphAsync();
  const image = await graphAsync.drawMermaidPng();
  const arrayBuffer = await image.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");
  return `data:image/png;base64,${base64}`;
}
