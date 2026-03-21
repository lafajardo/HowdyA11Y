"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import type { ChallengeDefinition } from "@/data/challenges/types";
import { getNextChallenge, getPreviousChallenge } from "@/data/challenges";
import { validate, type ValidationResult } from "@/lib/validation/engine";
import { useProgress } from "@/context/ProgressContext";
import { InstructionPanel } from "./InstructionPanel";
import { PreviewPane } from "./PreviewPane";
import { ValidationFeedback } from "./ValidationFeedback";
import { CodeEditorChallenge } from "./CodeEditorChallenge";
import { UIControlChallenge } from "./UIControlChallenge";
import { ExperienceChallenge } from "./ExperienceChallenge";

interface ChallengeShellProps {
  challenge: ChallengeDefinition;
}

export function ChallengeShell({ challenge }: ChallengeShellProps) {
  const { markComplete, setLastVisited, getChallenge } = useProgress();
  const existing = getChallenge(challenge.slug);

  // State
  const [code, setCode] = useState(challenge.initialCode || "");
  const [controlValues, setControlValues] = useState<Record<string, unknown>>(
    () => {
      const initial: Record<string, unknown> = {};
      challenge.controls?.forEach((c) => {
        initial[c.id] = c.initialValue;
      });
      return initial;
    }
  );
  const [hintsUsed, setHintsUsed] = useState(0);
  const [validationResult, setValidationResult] =
    useState<ValidationResult | null>(null);
  const [experienceCompletedTasks, setExperienceCompletedTasks] = useState<
    string[]
  >([]);

  const nextChallenge = getNextChallenge(challenge.slug);
  const prevChallenge = getPreviousChallenge(challenge.slug);
  const isExperience = challenge.mode === "experience";

  useEffect(() => {
    setLastVisited(challenge.slug);
  }, [challenge.slug, setLastVisited]);

  const handleControlChange = useCallback((id: string, value: unknown) => {
    setControlValues((prev) => ({ ...prev, [id]: value }));
    setValidationResult(null);
  }, []);

  const handleCodeChange = useCallback((newCode: string) => {
    setCode(newCode);
    setValidationResult(null);
  }, []);

  const handleCheck = useCallback(() => {
    let input: string | Record<string, unknown>;
    if (challenge.mode === "code-editor") {
      input = code;
    } else if (challenge.mode === "experience") {
      input = { completedTasks: experienceCompletedTasks };
    } else {
      input = controlValues;
    }

    const result = validate(challenge, input, hintsUsed);
    setValidationResult(result);

    if (result.allPassed) {
      markComplete(challenge.slug, result.score, hintsUsed);
    }
  }, [
    challenge,
    code,
    controlValues,
    experienceCompletedTasks,
    hintsUsed,
    markComplete,
  ]);

  const handleUseHint = useCallback(() => {
    setHintsUsed((prev) => Math.min(prev + 1, challenge.hints.length));
  }, [challenge.hints.length]);

  const handleExperienceComplete = useCallback((tasks: string[]) => {
    setExperienceCompletedTasks(tasks);
    setValidationResult(null);
  }, []);

  // Generate preview HTML (not used for experience mode)
  const currentPreviewHTML =
    challenge.mode === "code-editor"
      ? code
      : challenge.renderPreview?.(controlValues) || "";

  const initialPreviewHTML =
    challenge.mode === "code-editor"
      ? challenge.initialCode || ""
      : challenge.renderPreview?.(
          Object.fromEntries(
            (challenge.controls || []).map((c) => [c.id, c.initialValue])
          )
        ) || "";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text font-display">
            {challenge.title}
          </h1>
          {existing?.completed && (
            <p className="text-sm text-amber-700 font-medium mt-1">
              Captured — Best haul: {existing.score}/{challenge.maxScore} gold
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {prevChallenge && (
            <Link
              href={`/challenges/${prevChallenge.slug}`}
              className="px-3 py-2 text-sm border border-border rounded-lg hover:bg-surface-muted transition-colors"
            >
              Ride Back
            </Link>
          )}
          {nextChallenge && (
            <Link
              href={`/challenges/${nextChallenge.slug}`}
              className="px-3 py-2 text-sm border border-border rounded-lg hover:bg-surface-muted transition-colors"
            >
              Ride On
            </Link>
          )}
        </div>
      </div>

      {/* Experience mode: full-width layout */}
      {isExperience && challenge.phases && challenge.disclaimer && (
        <>
          {/* Instructions panel for experience */}
          <div className="bg-surface border border-border rounded-xl p-6 mb-6">
            <InstructionPanel
              challenge={challenge}
              hintsUsed={hintsUsed}
              onUseHint={handleUseHint}
            />
          </div>

          {/* Experience challenge component */}
          <div className="mb-6">
            <ExperienceChallenge
              phases={challenge.phases}
              disclaimer={challenge.disclaimer}
              onComplete={handleExperienceComplete}
            />
          </div>
        </>
      )}

      {/* Code-editor / UI-controls mode: 2-column layout */}
      {!isExperience && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-surface border border-border rounded-xl p-6">
              <InstructionPanel
                challenge={challenge}
                hintsUsed={hintsUsed}
                onUseHint={handleUseHint}
              />
            </div>

            <div className="bg-surface border border-border rounded-xl p-6">
              <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wide mb-4">
                {challenge.mode === "code-editor" ? "Code Editor" : "Controls"}
              </h2>

              {challenge.mode === "code-editor" && challenge.initialCode && (
                <CodeEditorChallenge
                  initialCode={challenge.initialCode}
                  currentCode={code}
                  onChange={handleCodeChange}
                />
              )}

              {challenge.mode === "ui-controls" && challenge.controls && (
                <UIControlChallenge
                  controls={challenge.controls}
                  values={controlValues}
                  onChange={handleControlChange}
                />
              )}
            </div>
          </div>

          {/* Preview */}
          <div className="mb-6">
            <PreviewPane
              currentHTML={currentPreviewHTML}
              initialHTML={initialPreviewHTML}
            />
          </div>
        </>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
        <button
          type="button"
          onClick={handleCheck}
          className="px-6 py-3 bg-primary text-text-inverse font-semibold rounded-lg hover:bg-primary-dark transition-colors text-sm"
        >
          Draw!
        </button>

        {validationResult?.allPassed && nextChallenge && (
          <Link
            href={`/challenges/${nextChallenge.slug}`}
            className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors text-sm"
          >
            Next Bounty: {nextChallenge.title}
          </Link>
        )}
      </div>

      {/* Validation results */}
      <ValidationFeedback
        result={validationResult}
        maxScore={challenge.maxScore}
      />
    </div>
  );
}
