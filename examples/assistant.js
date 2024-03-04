import "dotenv/config";
import OpenAI from "openai";

const openai = new OpenAI(process.env.OPENAI_API_KEY);

const assistant = await openai.beta.assistants.create({
	name: "Unit Conversion",
	instructions: "Convert units of measurement",
	tools: [{ type: "code_interpreter" }],
	model: "gpt-3.5-turbo-1106",
});

export async function assistantQuestion(question) {
	const thread = await openai.beta.threads.create();
	await openai.beta.threads.messages.create(thread.id, {
		role: "user",
		content: question,
	});

	const run = await openai.beta.threads.runs.create(thread.id, {
		assistant_id: assistant.id,
		additional_instructions:
			"Please address the user as Julián in the response",
	});

	const retrieve = (threadId, runId) => {
		return openai.beta.threads.runs.retrieve(threadId, runId);
	};

	const response = async () => {
		const output = [];
		const messages = await openai.beta.threads.messages.list(thread.id);
		messages.body.data.reverse();
		for (const message of messages.body.data) {
			output.push(message.content[0].text.value);
		}
		return output;
	};

	// Wait until is completed
	const waitForResponse = () =>
		new Promise((resolve, reject) => {
			const id = setInterval(async () => {
				const result = await retrieve(thread.id, run.id);
				if (result.status === "completed") {
					clearInterval(id);
					resolve(await response());
				}
			}, 1000);
		});

	return waitForResponse();
}
