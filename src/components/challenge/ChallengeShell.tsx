"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import type { ChallengeDefinition } from "@/data/challenges/types";
import { getChallengeBySlug } from "@/data/challenges";
import {
  getBountyForChallenge,
  getChallengeRole,
  type BountyDefinition,
  type ChallengeRole,
} from "@/data/bounties";
import { validate, type ValidationResult } from "@/lib/validation/engine";
import { useProgress } from "@/context/ProgressContext";
import { useChallengeContext } from "@/context/ChallengeContext";
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
  const { setChallengeContext } = useChallengeContext();
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

  const bounty = getBountyForChallenge(challenge.slug);
  const challengeRole = getChallengeRole(challenge.slug);
  const isExperience = challenge.mode === "experience";

  useEffect(() => {
    setLastVisited(challenge.slug);
  }, [challenge.slug, setLastVisited]);

  // Sync challenge state to context so MentorChat can access it
  useEffect(() => {
    setChallengeContext({
      slug: challenge.slug,
      title: challenge.title,
      description: challenge.description,
      instructions: challenge.instructions,
      wcagRef: {
        criterion: challenge.wcagRef.criterion,
        title: challenge.wcagRef.title,
        level: challenge.wcagRef.level,
      },
      difficulty: challenge.difficulty,
      mode: challenge.mode,
      currentCode: code || undefined,
      controlValues:
        Object.keys(controlValues).length > 0 ? controlValues : undefined,
      validationResult: validationResult
        ? {
            allPassed: validationResult.allPassed,
            results: validationResult.results,
          }
        : undefined,
    });
  }, [
    challenge.slug,
    challenge.title,
    challenge.description,
    challenge.instructions,
    challenge.wcagRef,
    challenge.difficulty,
    challenge.mode,
    code,
    controlValues,
    validationResult,
    setChallengeContext,
  ]);

  // Clear context on unmount
  useEffect(() => {
    return () => setChallengeContext(null);
  }, [setChallengeContext]);

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
      {/* Title + nav */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          {challengeRole === "boss" && (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded mb-1">
              <svg aria-hidden="true" className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <polygon points="12,2 14.5,9 22,9.5 16.5,14 18,22 12,18 6,22 7.5,14 2,9.5 9.5,9" />
              </svg>
              BOSS BATTLE
            </span>
          )}
          {challengeRole === "empathy" && (
            <span className="inline-flex items-center text-xs font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded mb-1">
              EMPATHY TRAIL
            </span>
          )}
          <h1 className="text-2xl font-bold text-text font-display">
            {challenge.title}
          </h1>
          {existing?.completed && (
            <p className="text-sm text-amber-700 font-medium mt-1">
              Captured  -  Best haul: {existing.score}/{challenge.maxScore} gold
            </p>
          )}
        </div>
        {bounty && (
          <Link
            href={`/bounty/${bounty.id}`}
            className="inline-flex items-center gap-1 px-3 py-2 text-sm border border-border rounded-lg hover:bg-surface-muted transition-colors"
          >
            <svg aria-hidden="true" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            {bounty.name}
          </Link>
        )}
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
              currentCode={code}
              controlValues={controlValues}
              validationResult={validationResult}
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
                currentCode={code}
                controlValues={controlValues}
                validationResult={validationResult}
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
          className="px-6 py-3 bg-primary text-text-inverse font-semibold rounded-lg hover:bg-primary-dark transition-colors text-sm cursor-pointer"
        >
          Draw!
        </button>

        {validationResult?.allPassed && bounty && (
          <CompletionAction bounty={bounty} challengeRole={challengeRole} />
        )}
      </div>

      {/* Validation results */}
      <ValidationFeedback
        result={validationResult}
        maxScore={challenge.maxScore}
        challenge={challenge}
        currentCode={code}
        controlValues={controlValues}
      />
    </div>
  );
}

function CompletionAction({
  bounty,
  challengeRole,
}: {
  bounty: BountyDefinition;
  challengeRole: ChallengeRole | undefined;
}) {
  const { getBountyStatus } = useProgress();
  const status = getBountyStatus(bounty.id);

  // Boss completed → bounty done
  if (challengeRole === "boss") {
    return (
      <Link
        href="/"
        className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors text-sm"
      >
        Bounty Complete! Return to Trail Map
      </Link>
    );
  }

  // Last side quest done → boss unlocked
  if (challengeRole === "side-quest" && status.bossUnlocked) {
    const bossChallenge = getChallengeBySlug(bounty.bossSlug);
    return (
      <Link
        href={`/challenges/${bounty.bossSlug}`}
        className="px-6 py-3 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition-colors text-sm font-display"
      >
        Boss Unlocked! Face {bossChallenge?.title || "the Boss"}
      </Link>
    );
  }

  // Default → return to bounty
  return (
    <Link
      href={`/bounty/${bounty.id}`}
      className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors text-sm"
    >
      Return to {bounty.name}
    </Link>
  );
}
