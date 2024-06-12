import type { ActionFunctionArgs } from "@remix-run/node";
import { agentQuestion } from "~/agent";
import { getCompletion } from "~/basics";
import { assistantQuestion } from "~/chat";
import { generateCode } from "~/lcel";
import { askQuestion, loadVideo } from "~/rag";
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
		const video = formData.get("video") as string;
		const { url, source } = await loadVideo(video);
		return {
			url,
			source,
		};
	}

	if (example === "rag") {
		const question = formData.get("question") as string;
		const source = formData.get("source") as string;
		const output = await askQuestion({ question, source });
		return {
			output,
		};
	}

	return new Response("Not Found", { status: 404 });
}
