import { title } from "@/config.shared";
import type { MetaFunction } from "@remix-run/node";
export const meta: MetaFunction = () => {
	return [
		{ title: `${title()} - Learning Resources` },
		{
			name: "description",
			content: "Learning Resources",
		},
	];
};

export default function Resources() {
	return (
		<main className="container-xl prose mx-20 py-2">
			<div>
				<h1>Learning Resources</h1>
				<ul>
					<li>
						<a href="https://github.com/heroku-reference-apps">
							Heroku Reference Applications
						</a>
					</li>
					<li>
						<a href="https://github.com/heroku-reference-apps/menumaker">
							Menu Maker - ChatGPT Function Calling
						</a>
					</li>
					<li>
						<a href="https://github.com/heroku-reference-apps/employee-directory-gpt-action">
							Employee Directory - Custom GPT Action
						</a>
					</li>
					<li>
						<a href="https://github.com/heroku-reference-apps/ask-pdf">
							Ask PDF - Retrieval-Augmented Generation with pgvector
						</a>
					</li>
					<li>
						<a href="https://github.com/heroku-reference-apps/moodflicks">
							Moodflicks - MongoDB Atlas Vector Search with a React UI
						</a>
					</li>
					<li>
						<a href="https://blog.heroku.com/working-with-chatgpt-functions-on-heroku">
							Working with ChatGPT Functions on Heroku
						</a>
					</li>
					<li>
						<a href="https://developer.salesforce.com/blogs/2023/11/building-ai-applications-with-langchain-and-node-js">
							Building AI Applications with LangChain and Node.js
						</a>
					</li>
					<li>
						<a href="https://blog.heroku.com/pgvector-for-similarity-search-on-heroku-postgres">
							How to Use pgvector for Similarity Search on Heroku Postgres
						</a>
					</li>
					<li>
						<a href="https://github.com/heroku/buildpacks">
							Heroku Cloud Native Buildpacks
						</a>
					</li>
					<li>
						<a href="https://github.com/Malax/buildpack-ollama/">
							Ollama Cloud Native Buildpack
						</a>
					</li>
				</ul>
			</div>
		</main>
	);
}
