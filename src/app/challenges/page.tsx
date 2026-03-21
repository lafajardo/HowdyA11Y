"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { allChallenges, getChallengesByPrinciple } from "@/data/challenges";
import { principles } from "@/data/principles";
import { useProgress } from "@/context/ProgressContext";
import { WCAGBadge } from "@/components/challenge/WCAGBadge";
import type { WCAGPrinciple } from "@/data/challenges/types";

const difficultyOrder = { beginner: 0, intermediate: 1, advanced: 2 };

export default function ChallengesPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"><p>Loading challenges...</p></div>}>
      <ChallengesContent />
    </Suspense>
  );
}

function ChallengesContent() {
  const searchParams = useSearchParams();
  const initialPrinciple = searchParams.get("principle") as WCAGPrinciple | null;
  const [filter, setFilter] = useState<WCAGPrinciple | "all">(
    initialPrinciple || "all"
  );
  const { getChallenge, totalCompleted } = useProgress();

  const challenges =
    filter === "all"
      ? allChallenges
      : getChallengesByPrinciple(filter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-text font-display">Bounty Board</h1>
          <p className="text-text-muted mt-1">
            {totalCompleted} of {allChallenges.length} bounties collected
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="mb-8" role="tablist" aria-label="Filter by principle">
        <div className="flex flex-wrap gap-2">
          <button
            role="tab"
            aria-selected={filter === "all"}
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === "all"
                ? "bg-primary text-text-inverse"
                : "bg-surface-muted text-text hover:bg-gray-200"
            }`}
          >
            All ({allChallenges.length})
          </button>
          {principles.map((p) => (
            <button
              key={p.id}
              role="tab"
              aria-selected={filter === p.id}
              onClick={() => setFilter(p.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === p.id
                  ? "bg-primary text-text-inverse"
                  : "bg-surface-muted text-text hover:bg-gray-200"
              }`}
            >
              {p.name} ({p.challengeCount})
            </button>
          ))}
        </div>
      </div>

      {/* Challenge cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {challenges
          .sort(
            (a, b) =>
              difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
          )
          .map((challenge) => {
            const progress = getChallenge(challenge.slug);
            const principleInfo = principles.find(
              (p) => p.id === challenge.principle
            );

            return (
              <Link
                key={challenge.slug}
                href={`/challenges/${challenge.slug}`}
                className="group block p-5 rounded-xl border-2 border-border hover:border-primary transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <span
                    className="text-xs font-semibold px-2 py-1 rounded"
                    style={{
                      backgroundColor: principleInfo?.color + "20",
                      color: principleInfo?.color,
                    }}
                  >
                    {principleInfo?.name}
                  </span>
                  {progress?.completed && (
                    <span className="flex items-center gap-1 text-xs font-semibold text-green-600">
                      <svg
                        aria-hidden="true"
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {progress.score} gold
                    </span>
                  )}
                </div>

                <h2 className="text-base font-semibold text-text mb-2 group-hover:text-primary transition-colors">
                  {challenge.title}
                </h2>

                <p className="text-sm text-text-muted mb-3 line-clamp-2">
                  {challenge.description}
                </p>

                <div className="flex items-center gap-2 flex-wrap">
                  <WCAGBadge
                    criterion={challenge.wcagRef.criterion}
                    level={challenge.wcagRef.level}
                  />
                  <span
                    className={`text-xs px-2 py-0.5 rounded font-medium ${
                      challenge.difficulty === "beginner"
                        ? "bg-green-100 text-green-800"
                        : challenge.difficulty === "intermediate"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {challenge.difficulty === "beginner" ? "Greenhorn" : challenge.difficulty === "intermediate" ? "Wrangler" : "Outlaw Hunter"}
                  </span>
                  <span className="text-xs text-text-muted">
                    {challenge.mode === "code-editor" ? "Code" : "Controls"}
                  </span>
                </div>
              </Link>
            );
          })}
      </div>
    </div>
  );
}
