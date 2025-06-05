import { Highlight } from "@/components/hightlight/hightlight";
import type { HTMLAttributes } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
        remarkPlugins={[remarkGfm]}
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
          table: ({ children }) => (
            <div className="overflow-x-auto my-4">
              <table className="min-w-full border-collapse border border-gray-300">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-gray-50">{children}</thead>
          ),
          tbody: ({ children }) => <tbody>{children}</tbody>,
          tr: ({ children }) => (
            <tr className="border-b border-gray-200">{children}</tr>
          ),
          th: ({ children }) => (
            <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-900">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-gray-300 px-4 py-2 text-gray-700">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
