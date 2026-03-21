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

export function InstructionPanel({
  challenge,
  hintsUsed,
  onUseHint,
  currentCode,
  controlValues,
  validationResult,
}: InstructionPanelProps) {
  const difficulty = difficultyLabels[challenge.difficulty];

  return (
    <div className="space-y-6">
      {/* Header badges */}
      <div className="flex flex-wrap items-center gap-2">
        <WCAGBadge
          criterion={challenge.wcagRef.criterion}
          level={challenge.wcagRef.level}
          title={challenge.wcagRef.title}
          url={challenge.wcagRef.url}
        />
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${difficulty.className}`}
        >
          {difficulty.text}
        </span>
      </div>

      {/* Description */}
      <section aria-labelledby="challenge-desc-heading">
        <h2 id="challenge-desc-heading" className="text-sm font-semibold text-text-muted uppercase tracking-wide mb-2">
          The Outlaw
        </h2>
        <p className="text-sm text-text leading-relaxed">{challenge.description}</p>
      </section>

      {/* Real world impact */}
      <section aria-labelledby="impact-heading">
        <h2 id="impact-heading" className="text-sm font-semibold text-text-muted uppercase tracking-wide mb-2">
          Wanted For
        </h2>
        <p className="text-sm text-text leading-relaxed">{challenge.realWorldImpact}</p>
      </section>

      {/* Instructions */}
      <section aria-labelledby="instructions-heading">
        <h2 id="instructions-heading" className="text-sm font-semibold text-text-muted uppercase tracking-wide mb-2">
          Your Mission
        </h2>
        <p className="text-sm text-text leading-relaxed">{challenge.instructions}</p>
      </section>

      {/* Hints */}
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
    </div>
  );
}
