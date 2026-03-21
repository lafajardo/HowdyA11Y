import type { ChallengeHint } from "@/data/challenges/types";

interface HintSystemProps {
  hints: ChallengeHint[];
  hintsUsed: number;
  onUseHint: () => void;
}

export function HintSystem({ hints, hintsUsed, onUseHint }: HintSystemProps) {
  const canRevealMore = hintsUsed < hints.length;

  return (
    <section aria-labelledby="hints-heading">
      <h2
        id="hints-heading"
        className="text-sm font-semibold text-text-muted uppercase tracking-wide mb-2"
      >
        Scout Reports ({hintsUsed}/{hints.length})
      </h2>

      {hintsUsed > 0 && (
        <ul className="space-y-2 mb-3" aria-label="Revealed hints">
          {hints.slice(0, hintsUsed).map((hint, i) => (
            <li
              key={i}
              className="text-sm p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900"
            >
              <span className="font-semibold">Scout Report {i + 1}:</span> {hint.text}
              <span className="block text-xs text-amber-600 mt-1">
                (-{hint.scorePenalty} gold)
              </span>
            </li>
          ))}
        </ul>
      )}

      {canRevealMore && (
        <button
          type="button"
          onClick={onUseHint}
          className="text-sm px-4 py-2 rounded-lg border border-amber-300 text-amber-800 bg-amber-50 hover:bg-amber-100 transition-colors font-medium"
        >
          Send a Scout ({hintsUsed + 1})
          <span className="text-xs text-amber-600 ml-1">
            (-{hints[hintsUsed].scorePenalty} gold)
          </span>
        </button>
      )}
    </section>
  );
}
