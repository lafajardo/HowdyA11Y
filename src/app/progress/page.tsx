"use client";

import Link from "next/link";
import { useProgress } from "@/context/ProgressContext";
import { allChallenges, getChallengesByPrinciple } from "@/data/challenges";
import { principles } from "@/data/principles";

export default function ProgressPage() {
  const { progress, totalCompleted, resetProgress } = useProgress();
  const totalPossibleScore = allChallenges.reduce(
    (sum, c) => sum + c.maxScore,
    0
  );
  const completionPercent = Math.round(
    (totalCompleted / allChallenges.length) * 100
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-text mb-8 font-display">Your Trail Map</h1>

      {/* Overview stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="p-6 rounded-xl border border-border bg-surface-muted text-center">
          <div className="text-4xl font-bold text-primary font-display">
            {totalCompleted}/{allChallenges.length}
          </div>
          <div className="text-sm text-text-muted mt-1">
            Bounties Collected
          </div>
        </div>
        <div className="p-6 rounded-xl border border-border bg-surface-muted text-center">
          <div className="text-4xl font-bold text-primary font-display">
            {progress.totalScore}
          </div>
          <div className="text-sm text-text-muted mt-1">
            Gold Earned (out of {totalPossibleScore})
          </div>
        </div>
        <div className="p-6 rounded-xl border border-border bg-surface-muted text-center">
          <div className="text-4xl font-bold text-primary font-display">
            {completionPercent}%
          </div>
          <div className="text-sm text-text-muted mt-1">Trail Blazed</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-10">
        <div className="flex items-center justify-between text-sm text-text-muted mb-2">
          <span>Trail Progress</span>
          <span>
            {totalCompleted} of {allChallenges.length}
          </span>
        </div>
        <div
          className="w-full h-4 bg-surface-muted rounded-full overflow-hidden border border-border"
          role="progressbar"
          aria-valuenow={completionPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${completionPercent}% of bounties collected`}
        >
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${completionPercent}%` }}
          />
        </div>
      </div>

      {/* Per-principle breakdown */}
      <div className="space-y-8 mb-10">
        {principles.map((p) => {
          const principleChalls = getChallengesByPrinciple(p.id);
          const completed = principleChalls.filter(
            (c) => progress.challenges[c.slug]?.completed
          ).length;
          const percent = Math.round((completed / principleChalls.length) * 100);

          return (
            <section key={p.id} aria-labelledby={`progress-${p.id}`}>
              <div className="flex items-center justify-between mb-3">
                <h2
                  id={`progress-${p.id}`}
                  className="text-lg font-semibold text-text"
                >
                  <span
                    className="inline-block w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: p.color }}
                    aria-hidden="true"
                  />
                  {p.name}
                </h2>
                <span className="text-sm text-text-muted">
                  {completed}/{principleChalls.length}
                </span>
              </div>

              <div
                className="w-full h-2 bg-surface-muted rounded-full overflow-hidden mb-3"
                role="progressbar"
                aria-valuenow={percent}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${p.name}: ${percent}% complete`}
              >
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${percent}%`, backgroundColor: p.color }}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {principleChalls.map((challenge) => {
                  const cp = progress.challenges[challenge.slug];
                  return (
                    <Link
                      key={challenge.slug}
                      href={`/challenges/${challenge.slug}`}
                      className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary transition-colors text-sm"
                    >
                      <span
                        className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          cp?.completed
                            ? "bg-amber-100 text-amber-700"
                            : "bg-surface-muted text-text-muted"
                        }`}
                      >
                        {cp?.completed ? "\u2713" : challenge.order}
                      </span>
                      <span className="flex-1 truncate">{challenge.title}</span>
                      {cp?.completed && (
                        <span className="text-xs text-text-muted">
                          {cp.score} gold
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      {/* Reset */}
      <div className="pt-8 border-t border-border">
        <h2 className="text-lg font-semibold text-text mb-2 font-display">Start a New Journey</h2>
        <p className="text-sm text-text-muted mb-4">
          This will wipe your trail clean and reset all bounties and gold.
          This action cannot be undone.
        </p>
        <button
          type="button"
          onClick={() => {
            if (
              window.confirm(
                "Are you sure you want to start over, partner? All progress will be lost."
              )
            ) {
              resetProgress();
            }
          }}
          className="px-4 py-2 text-sm bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 transition-colors font-medium"
        >
          Reset All Progress
        </button>
      </div>
    </div>
  );
}
