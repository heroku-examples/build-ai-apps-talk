import { useLoaded } from "@/utils/misc";
import prism from "prismjs";

interface HighlightProps {
  language: "js";
  children: React.ReactNode;
}
export const Highlight = ({ language, children }: HighlightProps) => {
  const loaded = useLoaded();

  return loaded ? (
    <pre
      data-syntax={language}
      className="overflow-auto bg-white rounded border border-gray-200"
    >
      <code
        dangerouslySetInnerHTML={{
          __html: prism.highlight(
            children as string,
            prism.languages[language],
            language,
          ),
        }}
      />
    </pre>
  ) : null;
};
