import { Agent } from "@/components/examples/agent";
import { Basics } from "@/components/examples/basics";
import { Chat } from "@/components/examples/chat";
import { LCEL } from "@/components/examples/lcel";
import { Rag } from "@/components/examples/rag";
import { Structured } from "@/components/examples/structured";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { title } from "@/config.shared";
import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: `${title()} - AI Patterns` },
    { name: "description", content: "AI Patterns" },
  ];
};

export default function Index() {
  return (
    <main className="container-xl prose mx-20 py-2">
      <Tabs defaultValue="basics">
        <TabsList className="w-[1200px]">
          <TabsTrigger value="basics">Basics</TabsTrigger>
          <TabsTrigger value="structured">Structured Output</TabsTrigger>
          <TabsTrigger value="lcel">LCEL</TabsTrigger>
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="agents">Agents</TabsTrigger>
          <TabsTrigger value="rag">RAG</TabsTrigger>
        </TabsList>
        <TabsContent value="basics">
          <Basics />
        </TabsContent>
        <TabsContent value="structured">
          <Structured />
        </TabsContent>
        <TabsContent value="lcel">
          <LCEL />
        </TabsContent>
        <TabsContent value="chat">
          <Chat />
        </TabsContent>
        <TabsContent value="agents">
          <Agent />
        </TabsContent>
        <TabsContent value="rag">
          <Rag />
        </TabsContent>
      </Tabs>
    </main>
  );
}
