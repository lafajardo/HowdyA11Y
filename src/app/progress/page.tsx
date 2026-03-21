"use client";

import Link from "next/link";
import { useProgress } from "@/context/ProgressContext";
import { bounties } from "@/data/bounties";
import { allChallenges } from "@/data/challenges";
import { PrincipleIcon } from "@/components/ui/PrincipleIcon";

export default function ProgressPage() {
  const { progress, totalCompleted, getBountyStatus, resetProgress } =
    useProgress();
  const totalPossibleScore = allChallenges.reduce(
    (sum, c) => sum + c.maxScore,
    0
  );
  const completionPercent = Math.round(
    (totalCompleted / allChallenges.length) * 100
  );
  const bountiesComplete = bounties.filter(
    (b) => getBountyStatus(b.id).allDone
  ).length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-text mb-8 font-display">
        Trail Map
      </h1>

      {/* Overview stats */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        <div className="p-5 rounded-xl border border-border bg-surface-muted text-center">
          <div className="text-3xl font-bold text-primary font-display">
            {bountiesComplete}/4
          </div>
          <div className="text-xs text-text-muted mt-1">Bounties Complete</div>
        </div>
        <div className="p-5 rounded-xl border border-border bg-surface-muted text-center">
          <div className="text-3xl font-bold text-primary font-display">
            {totalCompleted}/21
          </div>
          <div className="text-xs text-text-muted mt-1">Quests Done</div>
        </div>
        <div className="p-5 rounded-xl border border-border bg-surface-muted text-center">
          <div className="text-3xl font-bold text-primary font-display">
            {progress.totalScore}
          </div>
          <div className="text-xs text-text-muted mt-1">Gold Earned</div>
        </div>
      </div>

      {/* Overall progress */}
      <div className="mb-10">
        <div
          className="w-full h-3 bg-surface-muted rounded-full overflow-hidden border border-border"
          role="progressbar"
          aria-valuenow={completionPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${completionPercent}% overall progress`}
        >
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${completionPercent}%` }}
          />
        </div>
        <p className="text-xs text-text-muted text-center mt-1">
          {completionPercent}% trail blazed
        </p>
      </div>

      {/* Per-bounty cards */}
      <div className="space-y-4 mb-10">
        {bounties.map((bounty) => {
          const status = getBountyStatus(bounty.id);
          const totalQuests = 1 + bounty.sideQuestSlugs.length + 1;
          const completed =
            (status.empathyDone ? 1 : 0) +
            status.sidesDone +
            (status.bossCompleted ? 1 : 0);

          return (
            <Link
              key={bounty.id}
              href={`/bounty/${bounty.id}`}
              className={`flex items-center gap-4 p-4 rounded-xl border transition-colors ${
                status.allDone
                  ? "border-green-400 bg-green-50"
                  : "border-border bg-surface-muted hover:border-primary"
              }`}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: bounty.color + "20" }}
              >
                <PrincipleIcon
                  icon={bounty.icon}
                  color={status.allDone ? "#16a34a" : bounty.color}
                  size={20}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-text">
                  {bounty.name}
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex-1 h-1.5 bg-stone-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${(completed / totalQuests) * 100}%`,
                        backgroundColor: bounty.color,
                      }}
                    />
                  </div>
                  <span className="text-xs text-text-muted whitespace-nowrap">
                    {completed}/{totalQuests}
                  </span>
                </div>
              </div>
              {status.allDone && (
                <span className="text-xs font-bold text-green-600 flex-shrink-0">
                  DONE
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Reset */}
      <div className="pt-8 border-t border-border">
        <h2 className="text-lg font-semibold text-text mb-2 font-display">
          Start a New Journey
        </h2>
        <p className="text-sm text-text-muted mb-4">
          This will wipe your trail clean and reset all bounties and gold.
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
