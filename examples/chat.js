import "dotenv/config";
import { ChatMessageHistory } from "@langchain/community/stores/message/in_memory";
import { StringOutputParser } from "@langchain/core/output_parsers";
import {
	ChatPromptTemplate,
	MessagesPlaceholder,
} from "@langchain/core/prompts";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import { ChatOpenAI } from "@langchain/openai";

const llm = new ChatOpenAI({
	modelName: "gpt-3.5-turbo-0125",
	temperature: 0,
});

const prompt = ChatPromptTemplate.fromMessages([
	["system", "You are an assistant who is good at {skill}."],
	new MessagesPlaceholder("history"),
	["human", "{message}"],
]);

const chain = prompt.pipe(llm).pipe(new StringOutputParser());
const messageHistory = new ChatMessageHistory();

const chainWithHistory = new RunnableWithMessageHistory({
	runnable: chain,
	getMessageHistory: () => messageHistory,
	inputMessagesKey: "message",
	historyMessagesKey: "history",
});

export async function assistantQuestion({ skill, message }) {
	return chainWithHistory.invoke(
		{
			skill,
			message,
		},
		{
			configurable: {
				sessionId: "assistant",
			},
		},
	);
}
