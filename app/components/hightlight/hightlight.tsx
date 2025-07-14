import { IconCheck, IconCopy } from "@tabler/icons-react";
import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vs } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { useLoaded } from "@/utils/misc";

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
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const text = String(children);

    try {
      // Try using the Clipboard API first
      await navigator.clipboard.writeText(text);
    } catch (_err) {
      // Fallback to the old method
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed"; // Prevent scrolling to bottom
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return loaded ? (
    <div className="mt-4 bg-white rounded border border-gray-200 shadow-sm relative">
      <button
        type="button"
        onClick={handleCopy}
        className="absolute top-2 right-2 p-2 text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded transition-colors flex items-center gap-1"
        title="Copy code"
      >
        {copied ? (
          <>
            <IconCheck size={16} />
            <span className="text-sm">Copied!</span>
          </>
        ) : (
          <>
            <IconCopy size={16} />
            <span className="text-sm">Copy</span>
          </>
        )}
      </button>
      <SyntaxHighlighter
        language={language}
        style={vs}
        customStyle={{
          margin: 0,
          fontSize: "1.2rem",
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
