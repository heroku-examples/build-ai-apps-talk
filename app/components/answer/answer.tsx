import { Highlight } from "@/components/hightlight/hightlight";
import type { HTMLAttributes } from "react";
import ReactMarkdown from "react-markdown";

interface AnswerProps {
  content: string;
}

interface CodeProps extends HTMLAttributes<HTMLElement> {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function Answer({ content }: AnswerProps) {
  return (
    <div className="space-y-4 text-gray-600">
      <ReactMarkdown
        components={{
          p: ({ children }) => <p className="leading-relaxed">{children}</p>,
          a: ({ children, href }) => (
            <a href={href} className="text-blue-600 hover:underline">
              {children}
            </a>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-gray-900">{children}</strong>
          ),
          code({ inline, className, children, ...props }: CodeProps) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <Highlight
                language={
                  match[1] as
                    | "js"
                    | "python"
                    | "bash"
                    | "json"
                    | "yaml"
                    | "markdown"
                    | "html"
                    | "css"
                    | "javascript"
                    | "typescript"
                    | "jsx"
                    | "tsx"
                    | "sql"
                    | "graphql"
                    | "yaml"
                    | "json"
                    | "toml"
                    | "ini"
                    | "dockerfile"
                    | "ruby"
                    | "php"
                    | "swift"
                    | "kotlin"
                    | "go"
                    | "rust"
                    | "scala"
                    | "haskell"
                    | "erlang"
                    | "elixir"
                    | "ocaml"
                    | "lua"
                    | "julia"
                    | "powershell"
                    | "yaml"
                    | "json"
                    | "toml"
                    | "ini"
                    | "dockerfile"
                    | "ruby"
                    | "php"
                    | "swift"
                    | "kotlin"
                    | "go"
                    | "rust"
                    | "scala"
                    | "haskell"
                    | "erlang"
                    | "elixir"
                    | "ocaml"
                    | "lua"
                    | "julia"
                    | "powershell"
                }
                {...props}
              >
                {String(children).replace(/\n$/, "")}
              </Highlight>
            ) : (
              <code
                className="rounded border border-gray-200 border-dashed px-1 py-0.5 text-gray-900"
                {...props}
              >
                {children}
              </code>
            );
          },
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-gray-200 pl-4 italic">
              {children}
            </blockquote>
          ),
          ul: ({ children }) => <ul className="list-disc pl-6">{children}</ul>,
          ol: ({ children }) => (
            <ol className="list-decimal pl-6">{children}</ol>
          ),
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
