"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import type { ChallengeDefinition } from "@/data/challenges/types";
import type { ValidationResult } from "@/lib/validation/engine";
import { useAIFetch } from "@/lib/ai/use-ai-fetch";
import { useAuth } from "@/context/AuthContext";

interface ExplainButtonProps {
  challenge: ChallengeDefinition;
  validationResult: ValidationResult;
  currentCode?: string;
  controlValues?: Record<string, unknown>;
}

export function ExplainButton({
  challenge,
  validationResult,
  currentCode,
  controlValues,
}: ExplainButtonProps) {
  const { isAuthenticated } = useAuth();
  const [explanation, setExplanation] = useState<string | null>(null);
  const { fetchAI, isLoading, error, clearError } = useAIFetch();

  const failingRules = validationResult.results.filter((r) => !r.passed);

  async function handleExplain() {
    clearError();
    const result = await fetchAI<{ explanation: string }>("/api/ai/explain", {
      challengeDescription: challenge.description,
      instructions: challenge.instructions,
      wcagRef: challenge.wcagRef,
      failingRules,
      currentCode,
      controlValues,
    });

    if (result) {
      setExplanation(result.explanation);
    }
  }

  if (failingRules.length === 0) return null;

  return (
    <div className="mt-4">
      {!isAuthenticated ? (
        <p className="text-xs text-amber-700 italic">
          <a href="/auth/login" className="underline hover:no-underline">Sign in</a> to ask the Trail Guide what went wrong
        </p>
      ) : (
      <button
        type="button"
        onClick={handleExplain}
        disabled={isLoading}
        className="px-4 py-2 text-sm font-medium bg-amber-100 text-amber-900 border border-amber-300 rounded-lg hover:bg-amber-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Trail Guide is thinking..." : "What went wrong, Trail Guide?"}
      </button>
      )}

      {error && (
        <div role="alert" className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
          <button
            type="button"
            onClick={handleExplain}
            className="ml-2 underline hover:no-underline"
          >
            Retry
          </button>
        </div>
      )}

      {explanation && (
        <div
          aria-live="polite"
          className="mt-3 p-4 bg-amber-50 border border-amber-200 rounded-lg"
        >
          <p className="text-sm font-semibold text-amber-800 mb-1">
            Trail Guide explains:
          </p>
          <div className="prose-chat text-sm text-amber-900 leading-relaxed">
            <ReactMarkdown>{explanation}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
