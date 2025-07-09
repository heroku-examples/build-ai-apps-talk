import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { title } from "@/config.shared";
import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => {
  return [
    { title: `${title()} - Learning Resources` },
    {
      name: "description",
      content: "Learning Resources",
    },
  ];
};

interface Resource {
  title: string;
  description: string;
  url: string;
}

interface ResourceSection {
  title: string;
  description: string;
  resources: Resource[];
}

const resourceSections: ResourceSection[] = [
  {
    title: "Heroku AI Platform",
    description:
      "Official Heroku AI platform tools and services for building AI applications",
    resources: [
      {
        title: "Heroku AI",
        description:
          "A streamlined platform for building AI-powered apps with integrated tools and services",
        url: "https://www.heroku.com/ai",
      },
      {
        title: "Heroku Inference",
        description:
          "Production-ready AI inference capabilities with managed scaling and deployment",
        url: "https://devcenter.heroku.com/categories/heroku-inference",
      },
      {
        title: "Heroku MCP Server",
        description:
          "Model Context Protocol server for enhanced AI model interactions and context management",
        url: "https://github.com/heroku/heroku-mcp-server",
      },
    ],
  },
  {
    title: "Example Applications & Tutorials",
    description:
      "Real-world examples and step-by-step guides for building AI applications",
    resources: [
      {
        title: "Ask PDF - RAG with pgvector",
        description:
          "Complete retrieval-augmented generation example using PostgreSQL vector embeddings",
        url: "https://github.com/heroku-reference-apps/ask-pdf",
      },
      {
        title: "Building AI Apps with LangChain",
        description:
          "Tutorial on how to build AI applications using LangChain and Node.js",
        url: "https://developer.salesforce.com/blogs/2023/11/building-ai-applications-with-langchain-and-node-js",
      },
      {
        title: "Build Agentic AI Apps with LangChain and Node.js",
        description:
          "Complete source code for this demonstration app showing various AI patterns",
        url: "https://github.com/heroku-examples/build-ai-apps-talk",
      },
    ],
  },
  {
    title: "Development Tools & Infrastructure",
    description:
      "Buildpacks, deployment tools, and infrastructure components for AI applications",
    resources: [
      {
        title: "Heroku Reference Applications",
        description:
          "Collection of reference applications showcasing best practices and patterns",
        url: "https://github.com/heroku-reference-apps",
      },
      {
        title: "Heroku Cloud Native Buildpacks",
        description:
          "Official buildpacks for deploying applications with cloud-native approach",
        url: "https://github.com/heroku/buildpacks",
      },
      {
        title: "Ollama Buildpack",
        description:
          "Cloud Native Buildpack for running Ollama models in containerized environments",
        url: "https://github.com/Malax/buildpack-ollama/",
      },
    ],
  },
  {
    title: "Community & Learning",
    description:
      "Community resources, architectural patterns, and learning materials",
    resources: [
      {
        title: "pgvector for Similarity Search",
        description:
          "Learn how to implement vector similarity search using PostgreSQL and pgvector",
        url: "https://blog.heroku.com/pgvector-for-similarity-search-on-heroku-postgres",
      },
      {
        title: "LLM App Stack",
        description:
          "Emerging architectures and patterns for large language model applications",
        url: "https://github.com/a16z-infra/llm-app-stack",
      },
    ],
  },
];

export default function Resources() {
  return (
    <main className="container mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Learning Resources
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl">
          Explore our curated collection of resources to help you build, deploy,
          and scale AI applications with Heroku and modern AI frameworks.
        </p>
      </div>

      <div className="grid gap-8">
        {resourceSections.map((section, sectionIndex) => (
          <div key={section.title} className="space-y-4">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                {section.title}
              </h2>
              <p className="text-gray-600">{section.description}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {section.resources.map((resource, resourceIndex) => (
                <Card
                  key={resource.title}
                  className="transition-all duration-200 hover:shadow-lg hover:scale-[1.02] cursor-pointer group"
                  onClick={() => window.open(resource.url, "_blank")}
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                      {resource.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm leading-relaxed">
                      {resource.description}
                    </CardDescription>
                    <div className="mt-4 flex items-center text-sm text-blue-600 font-medium group-hover:text-blue-700">
                      Learn more
                      <svg
                        className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <title>External link arrow</title>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
