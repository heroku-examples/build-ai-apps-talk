import { ActionFunctionArgs } from "@remix-run/node";
import { agentQuestion } from "~/agent";
import { assistantQuestion } from "~/assistant";
import { askQuestion, loadVideo } from "~/rag";

export async function action({ request }: ActionFunctionArgs) {
	const formData = await request.formData();
	const example = formData.get("example") as string;
	if (example === "agent") {
		const question = formData.get("question") as string;
		const result = await agentQuestion(question);
		return result;
	}

	if (example === "assistant") {
		const question = formData.get("question") as string;
		const result = await assistantQuestion(question);
		return {
			output: result,
		};
	}

	if (example === "rag-load") {
		const video = formData.get("video") as string;
		await loadVideo(video);
		return {
			output: transformYouTubeURL(video),
		};
	}

	if (example === "rag") {
		const question = formData.get("question") as string;
		const output = await askQuestion(question);
		return {
			output,
		};
	}

	return new Response("Not Found", { status: 404 });
}

function transformYouTubeURL(url: string) {
	const regExp =
		/^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
	const match = url.match(regExp);
	return match && match[7].length === 11
		? `https://www.youtube.com/embed/${match[7]}`
		: null;
}
