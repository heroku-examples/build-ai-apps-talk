import { useEffect, useState } from "react";

export function useLoaded() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => setLoaded(true), []);
  return loaded;
}

export function useExampleCode(exampleName: string) {
  const [code, setCode] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCode = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/examples?code=${exampleName}`);
        const data = await response.json();

        if (data.error) {
          setError(data.error);
          setCode("");
        } else if (data.code) {
          setCode(data.code);
          setError(null);
        } else {
          setError("No code found for this example");
          setCode("");
        }
      } catch (error) {
        console.error(`Failed to fetch code for ${exampleName}:`, error);
        setError("Failed to load example code");
        setCode("");
      } finally {
        setLoading(false);
      }
    };

    fetchCode();
  }, [exampleName]);

  return { code, loading, error };
}
