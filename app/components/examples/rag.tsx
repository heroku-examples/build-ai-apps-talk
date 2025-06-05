import { Answer } from "@/components/answer/answer";
import { Highlight } from "@/components/hightlight/hightlight";
import { LoadingIndicator } from "@/components/loading-indicator";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useExampleCode } from "@/utils/misc";
import { IconBrandGithub } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useFetcher } from "react-router";

interface RepoData {
  repoUrl: string;
  owner: string;
  repo: string;
}

interface RAGAnswer {
  output: string;
}

export function Rag() {
  const questionFetcher = useFetcher<RAGAnswer>();
  const repoFetcher = useFetcher<RepoData>();
  const reposFetcher = useFetcher<RepoData[]>();
  const [answer, setAnswer] = useState("");
  const [question, setQuestion] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [repoData, setRepoData] = useState<RepoData | null>(null);
  const [repositories, setRepositories] = useState<RepoData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { code, loading: codeLoading } = useExampleCode("rag");

  const isSubmitting = questionFetcher.state === "submitting";
  const questionOutput = questionFetcher.data?.output;

  const isRepoSubmitting = repoFetcher.state === "submitting";
  const repoOutput = repoFetcher.data;

  const reposOutput = reposFetcher.data;

  useEffect(() => {
    if (questionOutput) {
      setAnswer(questionOutput);
    }
  }, [questionOutput]);

  useEffect(() => {
    if (repoOutput) {
      setRepoData(repoOutput);
      setRepoUrl(repoOutput.repoUrl);
      // Refresh the repositories list when a new repo is loaded
      reposFetcher.submit(
        { example: "rag-repos" },
        { method: "POST", action: "/examples" },
      );
    }
  }, [repoOutput, reposFetcher.submit]);

  useEffect(() => {
    if (reposOutput) {
      setRepositories(reposOutput);
    }
  }, [reposOutput]);

  useEffect(() => {
    // Fetch repositories when component mounts
    reposFetcher.submit(
      { example: "rag-repos" },
      { method: "POST", action: "/examples" },
    );
  }, [reposFetcher.submit]);

  const formatRepoUrl = (input: string) => {
    // Remove any existing GitHub URL prefix
    const cleanUrl = input.replace(/^https?:\/\/github\.com\//, "");

    // Validate the format (owner/repo)
    if (!/^[a-zA-Z0-9-]+\/[a-zA-Z0-9._-]+$/.test(cleanUrl)) {
      throw new Error("Invalid GitHub repository format. Use owner/repo");
    }

    // Add the GitHub URL prefix
    return `https://github.com/${cleanUrl}`;
  };

  const handleRepoSelect = (value: string) => {
    setRepoUrl(value);
    setRepoData(repositories.find((repo) => repo.repoUrl === value) || null);
    setAnswer("");
    setQuestion("");
  };

  const handleRepoSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setAnswer("");
    setQuestion("");

    const form = e.currentTarget;
    const repoInput = form.querySelector(
      'input[name="repo"]',
    ) as HTMLInputElement;

    if (!repoInput.value.trim()) {
      setError("Please enter a repository URL");
      return;
    }

    try {
      const formattedUrl = formatRepoUrl(repoInput.value);
      repoInput.value = formattedUrl;
      repoFetcher.submit(form, {
        method: "POST",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid repository URL");
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Retrieval-Augmented Generation</CardTitle>
        <CardDescription>
          Ask questions about a GitHub repository
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex space-x-4">
            <div className="relative w-[300px]">
              <div className="flex items-center space-x-2 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                <IconBrandGithub className="h-4 w-4" />
                <select
                  value={repoUrl}
                  onChange={(e) => handleRepoSelect(e.target.value)}
                  className="w-full bg-transparent focus:outline-none"
                >
                  <option value="">Select a repository</option>
                  {repositories.map((repo) => (
                    <option key={repo.repoUrl} value={repo.repoUrl}>
                      {repo.owner}/{repo.repo}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex-grow">
              <repoFetcher.Form
                method="post"
                action="/examples"
                className="flex space-x-4"
                onSubmit={handleRepoSubmit}
              >
                <Input type="hidden" name="example" value="rag-load" />
                <div className="relative flex-grow">
                  <Input
                    type="text"
                    name="repo"
                    placeholder="GitHub repository URL (e.g., owner/repo)"
                    className="flex-grow p-2"
                    disabled={isRepoSubmitting || repoUrl !== ""}
                  />
                  {error && (
                    <p className="mt-1 left-0 text-sm text-red-500">{error}</p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="p-2"
                  disabled={isRepoSubmitting || repoUrl !== ""}
                >
                  Load repository
                </Button>
              </repoFetcher.Form>
            </div>
          </div>
          <div className="p-2">
            {isRepoSubmitting && <p>Loading repository content...</p>}
            {(repoData || repoUrl) && (
              <div className="mt-2">
                <a
                  href={formatRepoUrl(repoUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  View repository on GitHub
                </a>
              </div>
            )}
          </div>
          <div>
            {(repoData || repoUrl) && (
              <questionFetcher.Form method="post" action="/examples">
                <Input type="hidden" name="example" value="rag" />
                <Input
                  type="hidden"
                  name="repoUrl"
                  value={formatRepoUrl(repoUrl)}
                />
                <div className="flex space-x-4">
                  <Input
                    type="text"
                    name="question"
                    value={question}
                    placeholder="Ask a question about the repository..."
                    className="flex-grow p-2"
                    onChange={(e) => {
                      setQuestion(e.currentTarget.value);
                    }}
                    onKeyDown={(e) => {
                      const keyCode = e.which || e.keyCode;
                      if (keyCode === 13) {
                        setAnswer("");
                        questionFetcher.submit(e.currentTarget.form, {
                          method: "POST",
                        });
                      }
                    }}
                  />
                  <Button type="submit" className="p-2" disabled={isSubmitting}>
                    Ask
                  </Button>
                </div>
              </questionFetcher.Form>
            )}
          </div>
          {isSubmitting && <LoadingIndicator className="my-4" />}
          {answer && <Answer content={answer} />}
        </div>
        {codeLoading ? (
          <LoadingIndicator className="my-4" />
        ) : (
          <Highlight language="js">{code}</Highlight>
        )}
      </CardContent>
    </Card>
  );
}
