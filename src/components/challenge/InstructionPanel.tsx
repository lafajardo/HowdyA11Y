import type { ChallengeDefinition } from "@/data/challenges/types";
import type { ValidationResult } from "@/lib/validation/engine";
import { WCAGBadge } from "./WCAGBadge";
import { HintSystem } from "./HintSystem";
import { AIHintButton } from "../ai/AIHintButton";

interface InstructionPanelProps {
  challenge: ChallengeDefinition;
  hintsUsed: number;
  onUseHint: () => void;
  currentCode?: string;
  controlValues?: Record<string, unknown>;
  validationResult?: ValidationResult | null;
}

const difficultyLabels = {
  beginner: { text: "Greenhorn", className: "bg-green-100 text-green-800" },
  intermediate: { text: "Wrangler", className: "bg-yellow-100 text-yellow-800" },
  advanced: { text: "Outlaw Hunter", className: "bg-red-100 text-red-800" },
};

const modeLabels = {
  "code-editor": "Code Fix",
  "ui-controls": "UI Tuning",
  experience: "Empathy Trail",
};

const levelGuidance = {
  A: "Essential access basics. Missing this can block people from using the page.",
  AA: "The recommended baseline for most products and teams.",
  AAA: "The highest level. Great when feasible, but not always required.",
};

const estimatedByDifficulty = {
  beginner: 8,
  intermediate: 12,
  advanced: 18,
};

const modeAdjustment = {
  "code-editor": 0,
  "ui-controls": -2,
  experience: -3,
};

export function InstructionPanel({
  challenge,
  hintsUsed,
  onUseHint,
  currentCode,
  controlValues,
  validationResult,
}: InstructionPanelProps) {
  const difficulty = difficultyLabels[challenge.difficulty];
  const modeLabel = modeLabels[challenge.mode];
  const estimatedMinutes =
    challenge.estimatedMinutes ??
    Math.max(
      5,
      estimatedByDifficulty[challenge.difficulty] +
        modeAdjustment[challenge.mode]
    );
  const wcagLevelGuidance = levelGuidance[challenge.wcagRef.level];

  return (
    <div className="space-y-5">
      {/* Difficulty badge */}
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${difficulty.className}`}
        >
          {difficulty.text}
        </span>
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-stone-100 text-stone-700">
          {modeLabel}
        </span>
      </div>

      {/* Mission brief */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2" aria-label="Mission brief">
        <div className="rounded-md border border-border bg-surface-muted px-3 py-2">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-text-muted">Estimated time</p>
          <p className="text-sm font-semibold text-text">{estimatedMinutes} min</p>
        </div>
        <div className="rounded-md border border-border bg-surface-muted px-3 py-2">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-text-muted">WCAG level</p>
          <p className="text-sm font-semibold text-text">{challenge.wcagRef.level}</p>
        </div>
        <div className="rounded-md border border-border bg-surface-muted px-3 py-2">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-text-muted">Target score</p>
          <p className="text-sm font-semibold text-text">{challenge.maxScore} gold</p>
        </div>
      </div>

      {/* Instructions - always visible */}
      <section aria-labelledby="instructions-heading">
        <h2 id="instructions-heading" className="text-sm font-semibold text-text-muted uppercase tracking-wide mb-2">
          Your Mission
        </h2>
        <p className="text-sm text-text leading-relaxed">{challenge.instructions}</p>
      </section>

      <details className="border border-border rounded-lg">
        <summary className="px-4 py-3 cursor-pointer text-sm font-medium text-text-muted hover:text-text transition-colors">
          WCAG level in plain language
        </summary>
        <div className="px-4 pb-4 pt-1 border-t border-border">
          <p className="text-sm text-text leading-relaxed">{wcagLevelGuidance}</p>
        </div>
      </details>

      {/* Hints - always visible */}
      <HintSystem
        hints={challenge.hints}
        hintsUsed={hintsUsed}
        onUseHint={onUseHint}
      />

      {/* AI Hint */}
      <AIHintButton
        challenge={challenge}
        currentCode={currentCode}
        controlValues={controlValues}
        validationResult={validationResult ?? null}
        hintsUsed={hintsUsed}
      />

      {/* WCAG details - collapsible */}
      <details className="border border-border rounded-lg">
        <summary className="flex items-center gap-2 px-4 py-3 cursor-pointer text-sm font-medium text-text-muted hover:text-text transition-colors">
          <svg
            aria-hidden="true"
            className="w-4 h-4 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          View WCAG Details
          <WCAGBadge
            criterion={challenge.wcagRef.criterion}
            level={challenge.wcagRef.level}
          />
        </summary>
        <div className="px-4 pb-4 space-y-4 border-t border-border pt-3">
          <section>
            <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">
              The Outlaw
            </h3>
            <p className="text-sm text-text leading-relaxed">{challenge.description}</p>
          </section>
          <section>
            <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">
              Wanted For
            </h3>
            <p className="text-sm text-text leading-relaxed">{challenge.realWorldImpact}</p>
          </section>
          <a
            href={challenge.wcagRef.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary-dark transition-colors"
          >
            Read WCAG {challenge.wcagRef.criterion}: {challenge.wcagRef.title}
            <span className="sr-only"> (opens in new tab)</span>
            <svg aria-hidden="true" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </details>
    </div>
  );
}
