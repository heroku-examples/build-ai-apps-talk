import { useLoaded } from "@/utils/misc";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vs } from "react-syntax-highlighter/dist/cjs/styles/prism";

interface HighlightProps {
  language:
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
    | "powershell";
  children: React.ReactNode;
}

export const Highlight = ({ language, children }: HighlightProps) => {
  const loaded = useLoaded();

  return loaded ? (
    <div className="mt-4 bg-white rounded border border-gray-200 shadow-sm">
      <SyntaxHighlighter
        language={language}
        style={vs}
        customStyle={{
          margin: 0,
          fontSize: "1.2rem",
          fontFamily: "'Fira Code', monospace",
          borderRadius: "0.375rem",
          border: "1px solid #e5e7eb",
          padding: "1rem",
          overflow: "auto",
        }}
        showLineNumbers={true}
      >
        {String(children)}
      </SyntaxHighlighter>
    </div>
  ) : null;
};
