import { Agent } from "@/components/examples/agent";
import { Basics } from "@/components/examples/basics";
import { Chat } from "@/components/examples/chat";
import { LangGraph } from "@/components/examples/langraph";
import { LCEL } from "@/components/examples/lcel";
import { MCP } from "@/components/examples/mcp";
import { MultiAgent } from "@/components/examples/multi-agent";
import { Rag } from "@/components/examples/rag";
import { Structured } from "@/components/examples/structured";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { title } from "@/config.shared";
import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => {
  return [
    { title: `${title()} - AI Patterns` },
    { name: "description", content: "AI Patterns" },
  ];
};

export default function Index() {
  return (
    <main className="container mx-auto max-w-7xl px-4 py-2">
      <Tabs defaultValue="basics">
        <TabsList className="w-full">
          <TabsTrigger value="basics">Basics</TabsTrigger>
          <TabsTrigger value="structured">Structured Output</TabsTrigger>
          <TabsTrigger value="lcel">LCEL</TabsTrigger>
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="agents">Agents</TabsTrigger>
          <TabsTrigger value="rag">RAG</TabsTrigger>
          <TabsTrigger value="langraph">LangGraph</TabsTrigger>
          <TabsTrigger value="multi-agent">Multi-Agent</TabsTrigger>
          <TabsTrigger value="mcp">MCP</TabsTrigger>
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
        <TabsContent value="langraph">
          <LangGraph />
        </TabsContent>
        <TabsContent value="multi-agent">
          <MultiAgent />
        </TabsContent>
        <TabsContent value="mcp">
          <MCP />
        </TabsContent>
      </Tabs>
    </main>
  );
}
