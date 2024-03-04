import { Agent } from "@/components/examples/agent";
import { Assistant } from "@/components/examples/assistant";
import { Rag } from "@/components/examples/rag";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { title } from "@/config.shared";
import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
	return [{ title: title() }, { name: "description", content: "AI Patterns" }];
};

export default function Index() {
	return (
		<main className="container-xl prose mx-20 py-2">
			<Tabs defaultValue="agents">
				<TabsList className="w-[800px]">
					<TabsTrigger value="agents">Agents</TabsTrigger>
					<TabsTrigger value="assistant">Assistants</TabsTrigger>
					<TabsTrigger value="rag">RAG</TabsTrigger>
				</TabsList>
				<TabsContent value="agents">
					<Agent />
				</TabsContent>
				<TabsContent value="assistant">
					<Assistant />
				</TabsContent>
				<TabsContent value="rag">
					<Rag />
				</TabsContent>
			</Tabs>
		</main>
	);
}
