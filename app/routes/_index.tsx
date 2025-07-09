import { Agent } from "@/components/examples/agent";
import { Basics } from "@/components/examples/basics";
import { Chat } from "@/components/examples/chat";
import { LangGraph } from "@/components/examples/langraph";
import { LCEL } from "@/components/examples/lcel";
import { MCP } from "@/components/examples/mcp";
import { MultiAgent } from "@/components/examples/multi-agent";
import { Rag } from "@/components/examples/rag";
import { Structured } from "@/components/examples/structured";
import { Supervisor } from "@/components/examples/supervisor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { title } from "@/config.shared";
import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => {
  return [
    { title: `${title()} - LangChain Examples` },
    {
      name: "description",
      content:
        "LangChain Examples in Node.js and Heroku Managed Inference and Agents",
    },
  ];
};

export default function Index() {
  return (
    <main className="container mx-auto max-w-7xl px-4 py-2">
      <Tabs defaultValue="basics" orientation="vertical" className="flex gap-6">
        {/* Left Sidebar with Tabs */}
        <div className="flex-shrink-0 w-64">
          <TabsList className="flex-col h-auto w-full space-y-1 bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg rounded-xl p-3">
            <TabsTrigger
              value="basics"
              className="w-full justify-start text-left"
            >
              🎯 Basics
            </TabsTrigger>
            <TabsTrigger
              value="structured"
              className="w-full justify-start text-left"
            >
              📋 Structured Output
            </TabsTrigger>
            <TabsTrigger
              value="lcel"
              className="w-full justify-start text-left"
            >
              🔗 LCEL
            </TabsTrigger>
            <TabsTrigger
              value="chat"
              className="w-full justify-start text-left"
            >
              💬 Chat
            </TabsTrigger>
            <TabsTrigger
              value="agents"
              className="w-full justify-start text-left"
            >
              🤖 Agent (Tools)
            </TabsTrigger>
            <TabsTrigger value="rag" className="w-full justify-start text-left">
              📚 RAG
            </TabsTrigger>
            <TabsTrigger
              value="langraph"
              className="w-full justify-start text-left"
            >
              🕸️ LangGraph
            </TabsTrigger>
            <TabsTrigger value="mcp" className="w-full justify-start text-left">
              🔌 MCP
            </TabsTrigger>
            <TabsTrigger
              value="multi-agent"
              className="w-full justify-start text-left"
            >
              👥 Multi-Agent
            </TabsTrigger>
            <TabsTrigger
              value="supervisor"
              className="w-full justify-start text-left"
            >
              👨‍💼 Supervisor
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 min-w-0">
          <TabsContent value="basics" className="mt-0">
            <Basics />
          </TabsContent>
          <TabsContent value="structured" className="mt-0">
            <Structured />
          </TabsContent>
          <TabsContent value="lcel" className="mt-0">
            <LCEL />
          </TabsContent>
          <TabsContent value="chat" className="mt-0">
            <Chat />
          </TabsContent>
          <TabsContent value="agents" className="mt-0">
            <Agent />
          </TabsContent>
          <TabsContent value="rag" className="mt-0">
            <Rag />
          </TabsContent>
          <TabsContent value="langraph" className="mt-0">
            <LangGraph />
          </TabsContent>
          <TabsContent value="mcp" className="mt-0">
            <MCP />
          </TabsContent>
          <TabsContent value="multi-agent" className="mt-0">
            <MultiAgent />
          </TabsContent>
          <TabsContent value="supervisor" className="mt-0">
            <Supervisor />
          </TabsContent>
        </div>
      </Tabs>
    </main>
  );
}
