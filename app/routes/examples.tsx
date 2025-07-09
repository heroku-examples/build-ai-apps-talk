import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { AIMessage, HumanMessage } from "@langchain/core/messages";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { agentQuestion } from "~/agent";
import { getCompletion } from "~/basics";
import { assistantQuestion } from "~/chat";
import {
  askFirstQuestion,
  askSecondQuestion,
  createAgent,
  generateGraph,
} from "~/langraph";
import { generateCode } from "~/lcel";
import {
  askQuestion as mcpAskQuestion,
  generateGraph as mcpGenerateGraph,
} from "~/mcp";
import { runMultiAgent } from "~/multi-agent";
import { askQuestion, getRepositories, loadRepo } from "~/rag";
import { generateRecipe } from "~/structured";
import { askSupervisorQuestion, generateSupervisorGraph } from "~/supervisor";

// Whitelist of allowed example files - prevents path traversal attacks
// To add a new example:
// 1. Add the filename (without .js extension) to this array
// 2. Create the corresponding file in the examples/ directory
// 3. Add the component to the examples page
const ALLOWED_EXAMPLES = [
  "basics",
  "chat",
  "structured",
  "lcel",
  "agent",
  "langraph",
  "supervisor",
  "mcp",
  "multi-agent",
  "rag",
] as const;

type AllowedExample = (typeof ALLOWED_EXAMPLES)[number];

function isValidExample(example: string): example is AllowedExample {
  return ALLOWED_EXAMPLES.includes(example as AllowedExample);
}

// Helper function to get available examples (useful for debugging/development)
export function getAvailableExamples(): readonly string[] {
  return ALLOWED_EXAMPLES;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const example = url.searchParams.get("code");

  if (!example) {
    return { code: null, error: "No example specified" };
  }

  // Validate against whitelist to prevent path traversal attacks
  if (!isValidExample(example)) {
    console.warn(
      `Invalid example requested: ${example}. Available examples: ${ALLOWED_EXAMPLES.join(", ")}`,
    );
    return { code: null, error: "Invalid example name" };
  }

  try {
    // Safe to use the example name since it's validated against our whitelist
    const filePath = join(process.cwd(), "examples", `${example}.js`);
    const code = await readFile(filePath, "utf-8");

    return { code, error: null };
  } catch (error) {
    console.error(`Error reading example file ${example}:`, error);
    return { code: null, error: "Failed to read example file" };
  }
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const example = formData.get("example") as string;

  if (example === "basics") {
    const question = formData.get("question") as string;
    const response = await getCompletion(question);
    return {
      output: response?.content,
    };
  }

  if (example === "structured") {
    const ingredients = formData.get("ingredients") as string;
    const output = await generateRecipe(ingredients);
    return {
      output: JSON.stringify(output, null, 2),
    };
  }

  if (example === "chat") {
    const skill = formData.get("skill") as string;
    const message = formData.get("message") as string;
    const output = await assistantQuestion({ skill, message });

    return {
      output,
    };
  }

  if (example === "lcel") {
    const language = formData.get("language") as string;
    const problem = formData.get("problem") as string;
    const output = await generateCode({ language, problem });
    return {
      output,
    };
  }

  if (example === "agent") {
    const question = formData.get("question") as string;
    const result = await agentQuestion(question);
    return result;
  }

  if (example === "rag-load") {
    const repo = formData.get("repo") as string;
    const repoData = await loadRepo(repo);
    return repoData;
  }

  if (example === "rag") {
    const question = formData.get("question") as string;
    const repoUrl = formData.get("repoUrl") as string;
    const output = await askQuestion({ question, repoUrl });
    return {
      output,
    };
  }

  if (example === "langraph") {
    const firstQuestion = formData.get("firstQuestion") as string;
    const secondQuestion = formData.get("secondQuestion") as string;

    const agent = await createAgent();
    const threadId = randomUUID();
    const firstAnswer = await askFirstQuestion(agent, firstQuestion, threadId);
    const secondAnswer = await askSecondQuestion(
      agent,
      secondQuestion,
      threadId,
    );
    const graph = await generateGraph(agent);

    return {
      firstAnswer,
      secondAnswer,
      graph,
    };
  }

  if (example === "supervisor") {
    const question = formData.get("question") as string;
    const output = await askSupervisorQuestion(question);
    const graph = await generateSupervisorGraph();

    return {
      output,
      graph,
    };
  }

  if (example === "mcp") {
    const question = formData.get("question") as string;
    const output = await mcpAskQuestion(question);
    const graph = await mcpGenerateGraph();
    return {
      output,
      graph,
    };
  }

  if (example === "rag-repos") {
    const repositories = await getRepositories();
    return repositories;
  }

  if (example === "multi-agent") {
    const city = formData.get("city") as string;
    const result = await runMultiAgent(city);
    return {
      output: result.messages.map(
        (msg: AIMessage | HumanMessage) => msg.content,
      ),
      graph: result.graph,
    };
  }

  return new Response("Not Found", { status: 404 });
}
