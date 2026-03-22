"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import type { ChallengeDefinition } from "@/data/challenges/types";
import type { ValidationResult } from "@/lib/validation/engine";
import { useAIFetch } from "@/lib/ai/use-ai-fetch";
import { useAuth } from "@/context/AuthContext";

interface AIHintButtonProps {
  challenge: ChallengeDefinition;
  currentCode?: string;
  controlValues?: Record<string, unknown>;
  validationResult: ValidationResult | null;
  hintsUsed: number;
}

export function AIHintButton({
  challenge,
  currentCode,
  controlValues,
  validationResult,
  hintsUsed,
}: AIHintButtonProps) {
  const { isAuthenticated } = useAuth();
  const [aiHint, setAiHint] = useState<string | null>(null);
  const { fetchAI, isLoading, error, clearError } = useAIFetch();

  async function handleAsk() {
    clearError();
    const result = await fetchAI<{ hint: string }>("/api/ai/hint", {
      description: challenge.description,
      instructions: challenge.instructions,
      wcagRef: challenge.wcagRef,
      validationRules: challenge.validationRules.map((r) => ({
        id: r.id,
        type: r.type,
        description: r.description,
      })),
      currentCode,
      controlValues,
      validationResult,
      hintsUsed,
    });

    if (result) {
      setAiHint(result.hint);
    }
  }

  return (
    <div className="mt-4 pt-4 border-t border-border">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-semibold text-text-muted uppercase tracking-wide">
          Or ask the Trail Guide
        </span>
        <span className="text-xs text-text-muted">(no gold penalty)</span>
      </div>

      {!isAuthenticated ? (
        <p className="text-xs text-amber-700 italic">
          <a href="/auth/login" className="underline hover:no-underline">Sign in</a> to ask the Trail Guide for hints
        </p>
      ) : (
        <>
          <button
            type="button"
            onClick={handleAsk}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium bg-amber-100 text-amber-900 border border-amber-300 rounded-lg hover:bg-amber-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg
                  aria-hidden="true"
                  className="w-4 h-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 2v4m0 12v4m-7.07-3.93l2.83-2.83m8.49-8.49l2.83-2.83M2 12h4m12 0h4m-3.93 7.07l-2.83-2.83M7.76 7.76L4.93 4.93" />
                </svg>
                Scouting the trail...
              </span>
            ) : (
              "Ask the Trail Guide"
            )}
          </button>

          {error && (
            <div role="alert" className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
              <button
                type="button"
                onClick={handleAsk}
                className="ml-2 underline hover:no-underline"
              >
                Retry
              </button>
            </div>
          )}

          {aiHint && (
            <div
              aria-live="polite"
              className="mt-3 p-4 bg-amber-50 border border-amber-200 rounded-lg"
            >
              <p className="text-sm font-semibold text-amber-800 mb-1">
                Trail Guide says:
              </p>
              <div className="prose-chat text-sm text-amber-900 leading-relaxed">
                <ReactMarkdown>{aiHint}</ReactMarkdown>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
