"use client";

import Link from "next/link";
import { bounties } from "@/data/bounties";
import { useProgress } from "@/context/ProgressContext";
import { PrincipleIcon } from "@/components/ui/PrincipleIcon";

export default function HomePage() {
  const { getBountyStatus, totalCompleted } = useProgress();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero */}
      <section className="py-12 sm:py-20 text-center">
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-text tracking-tight font-display">
          Howdy, A11y
        </h1>
        <p className="mt-4 text-lg text-text-muted max-w-xl mx-auto">
          Wrangle accessibility outlaws across the WCAG frontier.
          No experience needed &mdash; just grit.
        </p>
        {totalCompleted > 0 && (
          <p className="mt-2 text-sm font-medium text-primary">
            {totalCompleted}/21 quests completed
          </p>
        )}
      </section>

      {/* POUR intro - minimal */}
      <section className="mb-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3 rounded-lg bg-surface-muted border border-border">
            <div className="text-lg font-bold font-display text-amber-700">P</div>
            <div className="text-xs text-text-muted">Perceivable</div>
          </div>
          <div className="p-3 rounded-lg bg-surface-muted border border-border">
            <div className="text-lg font-bold font-display text-green-700">O</div>
            <div className="text-xs text-text-muted">Operable</div>
          </div>
          <div className="p-3 rounded-lg bg-surface-muted border border-border">
            <div className="text-lg font-bold font-display text-red-700">U</div>
            <div className="text-xs text-text-muted">Understandable</div>
          </div>
          <div className="p-3 rounded-lg bg-surface-muted border border-border">
            <div className="text-lg font-bold font-display text-purple-700">R</div>
            <div className="text-xs text-text-muted">Robust</div>
          </div>
        </div>
        <p className="text-center text-xs text-text-muted mt-3">
          The four laws of web accessibility. Complete all four bounties to master them.
        </p>
      </section>

      {/* Trail map - 4 bounty destinations */}
      <section aria-label="Bounty destinations" className="pb-16">
        <h2 className="text-xl font-bold text-text text-center mb-6 font-display">
          Choose Your Bounty
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {bounties.map((bounty) => {
            const status = getBountyStatus(bounty.id);
            const totalQuests = 1 + bounty.sideQuestSlugs.length + 1;
            const completed =
              (status.empathyDone ? 1 : 0) +
              status.sidesDone +
              (status.bossCompleted ? 1 : 0);
            const percent = Math.round((completed / totalQuests) * 100);

            return (
              <Link
                key={bounty.id}
                href={`/bounty/${bounty.id}`}
                className={`group block p-6 rounded-xl border-2 transition-all hover:shadow-lg ${
                  status.allDone
                    ? "border-green-400 bg-green-50"
                    : "border-border bg-surface-muted hover:border-primary"
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon + progress ring */}
                  <div className="relative flex-shrink-0">
                    <svg className="w-16 h-16" viewBox="0 0 64 64">
                      {/* Background circle */}
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        fill="none"
                        stroke="#d6d3d1"
                        strokeWidth="4"
                      />
                      {/* Progress circle */}
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        fill="none"
                        stroke={status.allDone ? "#16a34a" : bounty.color}
                        strokeWidth="4"
                        strokeDasharray={`${percent * 1.76} 176`}
                        strokeLinecap="round"
                        transform="rotate(-90 32 32)"
                        className="transition-all duration-500"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <PrincipleIcon
                        icon={bounty.icon}
                        color={status.allDone ? "#16a34a" : bounty.color}
                        size={24}
                      />
                    </div>
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-text font-display group-hover:text-primary transition-colors">
                      {bounty.name}
                    </h3>
                    <p className="text-sm text-text-muted mt-0.5">
                      {bounty.tagline}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-xs font-medium" style={{ color: bounty.color }}>
                        {completed}/{totalQuests} quests
                      </span>
                      {status.allDone && (
                        <span className="text-xs font-bold text-green-600">
                          COMPLETE
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Arrow */}
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5 text-text-muted flex-shrink-0 mt-1 group-hover:text-primary transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
