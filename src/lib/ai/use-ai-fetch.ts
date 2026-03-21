"use client";

import { useState, useRef, useCallback } from "react";

interface UseAIFetchReturn {
  fetchAI: <T>(endpoint: string, body: Record<string, unknown>) => Promise<T | null>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

export function useAIFetch(): UseAIFetchReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const fetchAI = useCallback(async <T,>(
    endpoint: string,
    body: Record<string, unknown>
  ): Promise<T | null> => {
    // Cancel any in-flight request
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      if (res.status === 429) {
        setError("Whoa there, partner — too many questions at once. Wait a spell and try again.");
        return null;
      }

      if (res.status === 503) {
        setError("The Trail Guide is off-duty right now. Static hints are still available.");
        return null;
      }

      if (!res.ok) {
        setError("The Trail Guide seems to have wandered off. Try again in a moment.");
        return null;
      }

      return (await res.json()) as T;
    } catch (err) {
      if ((err as Error).name === "AbortError") return null;
      setError("The Trail Guide seems to have wandered off. Try again in a moment.");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return { fetchAI, isLoading, error, clearError };
}
