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
import { useState } from "react";
import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { useLoaderData } from "react-router";

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

export async function loader({ request }: LoaderFunctionArgs) {
  const enablePlayground = process.env.ENABLE_PLAYGROUND === "true";
  return { enablePlayground };
}

export default function Index() {
  const { enablePlayground } = useLoaderData<typeof loader>();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <main className="container mx-auto max-w-7xl px-4 py-2">
      <Tabs
        defaultValue="basics"
        orientation="vertical"
        className="flex gap-6 relative"
      >
        {/* Mobile Menu Button */}
        <button
          type="button"
          className="md:hidden fixed top-20 left-4 z-50 p-2 bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg rounded-lg"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <title>{mobileMenuOpen ? "Close menu" : "Open menu"}</title>
            {mobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Mobile Overlay */}
        {mobileMenuOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setMobileMenuOpen(false)}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setMobileMenuOpen(false);
              }
            }}
            tabIndex={0}
            role="button"
            aria-label="Close menu"
          />
        )}

        {/* Left Sidebar with Tabs */}
        <div
          className={`
          flex-shrink-0 w-64 transition-transform duration-300 ease-in-out
          md:translate-x-0 md:static md:z-auto
          ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
          fixed left-0 top-0 h-full z-50 md:h-auto
          bg-white md:bg-transparent
          pt-16 md:pt-0
          px-4 md:px-0
        `}
        >
          <TabsList className="flex-col h-auto w-full space-y-1 bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg rounded-xl p-3">
            <TabsTrigger
              value="basics"
              className="w-full justify-start text-left"
              onClick={() => setMobileMenuOpen(false)}
            >
              🎯 Basics
            </TabsTrigger>
            <TabsTrigger
              value="structured"
              className="w-full justify-start text-left"
              onClick={() => setMobileMenuOpen(false)}
            >
              📋 Structured Output
            </TabsTrigger>
            <TabsTrigger
              value="lcel"
              className="w-full justify-start text-left"
              onClick={() => setMobileMenuOpen(false)}
            >
              🔗 LCEL
            </TabsTrigger>
            <TabsTrigger
              value="chat"
              className="w-full justify-start text-left"
              onClick={() => setMobileMenuOpen(false)}
            >
              💬 Chat
            </TabsTrigger>
            <TabsTrigger
              value="agents"
              className="w-full justify-start text-left"
              onClick={() => setMobileMenuOpen(false)}
            >
              🤖 Agent (Tools)
            </TabsTrigger>
            <TabsTrigger
              value="rag"
              className="w-full justify-start text-left"
              onClick={() => setMobileMenuOpen(false)}
            >
              📚 RAG
            </TabsTrigger>
            <TabsTrigger
              value="langraph"
              className="w-full justify-start text-left"
              onClick={() => setMobileMenuOpen(false)}
            >
              🕸️ LangGraph
            </TabsTrigger>
            <TabsTrigger
              value="mcp"
              className="w-full justify-start text-left"
              onClick={() => setMobileMenuOpen(false)}
            >
              🔌 MCP
            </TabsTrigger>
            <TabsTrigger
              value="multi-agent"
              className="w-full justify-start text-left"
              onClick={() => setMobileMenuOpen(false)}
            >
              👥 Multi-Agent
            </TabsTrigger>
            <TabsTrigger
              value="supervisor"
              className="w-full justify-start text-left"
              onClick={() => setMobileMenuOpen(false)}
            >
              👨‍💼 Supervisor
            </TabsTrigger>
          </TabsList>

          {/* Playground Status Badge */}
          <div className="mt-3 w-full">
            <div
              className={`
              inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
              ${
                enablePlayground
                  ? "bg-green-100 text-green-800 border border-green-200"
                  : "bg-gray-100 text-gray-600 border border-gray-200"
              }
            `}
            >
              <div
                className={`
                w-2 h-2 rounded-full mr-2
                ${enablePlayground ? "bg-green-500" : "bg-gray-400"}
              `}
              />
              Playground {enablePlayground ? "Enabled" : "Disabled"}
            </div>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 min-w-0 md:ml-0 ml-0">
          <TabsContent value="basics" className="mt-0">
            <Basics enablePlayground={enablePlayground} />
          </TabsContent>
          <TabsContent value="structured" className="mt-0">
            <Structured enablePlayground={enablePlayground} />
          </TabsContent>
          <TabsContent value="lcel" className="mt-0">
            <LCEL enablePlayground={enablePlayground} />
          </TabsContent>
          <TabsContent value="chat" className="mt-0">
            <Chat enablePlayground={enablePlayground} />
          </TabsContent>
          <TabsContent value="agents" className="mt-0">
            <Agent enablePlayground={enablePlayground} />
          </TabsContent>
          <TabsContent value="rag" className="mt-0">
            <Rag enablePlayground={enablePlayground} />
          </TabsContent>
          <TabsContent value="langraph" className="mt-0">
            <LangGraph enablePlayground={enablePlayground} />
          </TabsContent>
          <TabsContent value="mcp" className="mt-0">
            <MCP enablePlayground={enablePlayground} />
          </TabsContent>
          <TabsContent value="multi-agent" className="mt-0">
            <MultiAgent enablePlayground={enablePlayground} />
          </TabsContent>
          <TabsContent value="supervisor" className="mt-0">
            <Supervisor enablePlayground={enablePlayground} />
          </TabsContent>
        </div>
      </Tabs>
    </main>
  );
}
