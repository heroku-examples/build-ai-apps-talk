import { randomUUID } from "node:crypto";
import type { AIMessage, HumanMessage } from "@langchain/core/messages";
import type { ActionFunctionArgs } from "@remix-run/node";
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

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const example = formData.get("example") as string;

  if (example === "basics") {
    const question = formData.get("question") as string;
    const output = await getCompletion(question);
    return {
      output,
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
