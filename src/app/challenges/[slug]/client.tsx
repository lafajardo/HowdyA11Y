"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { getChallengeBySlug } from "@/data/challenges";
import { getBountyForChallenge } from "@/data/bounties";
import { useProgress } from "@/context/ProgressContext";
import { useAuth } from "@/context/AuthContext";
import { ChallengeShell } from "@/components/challenge/ChallengeShell";

interface ChallengePageClientProps {
  slug: string;
}

export function ChallengePageClient({ slug }: ChallengePageClientProps) {
  const challenge = getChallengeBySlug(slug);
  const { isChallengeUnlocked } = useProgress();
  const { isAuthenticated } = useAuth();

  if (!challenge) {
    notFound();
  }

  // Unlock gate
  if (!isChallengeUnlocked(slug)) {
    const bounty = getBountyForChallenge(slug);
    const isEmpathy = bounty?.empathySlug === slug;

    // Locked because user isn't signed in (non-empathy challenge)
    if (!isAuthenticated && !isEmpathy) {
      return (
        <div className="max-w-lg mx-auto px-4 py-16 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-100 flex items-center justify-center">
            <svg aria-hidden="true" className="w-8 h-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-text font-display mb-2">
            Sign In to Continue
          </h1>
          <p className="text-sm text-text-muted mb-6">
            Create an account to unlock this quest and track your progress across the frontier.
          </p>
          <div className="flex items-center justify-center gap-3">
            <a
              href="/auth/login"
              className="inline-flex items-center px-5 py-2.5 bg-primary text-text-inverse font-semibold rounded-lg hover:bg-amber-600 transition-colors text-sm"
            >
              Sign In
            </a>
            {bounty && (
              <Link
                href={`/bounty/${bounty.id}`}
                className="inline-flex items-center px-5 py-2.5 border border-border text-text font-semibold rounded-lg hover:bg-surface-muted transition-colors text-sm"
              >
                Back to {bounty.name}
              </Link>
            )}
          </div>
        </div>
      );
    }

    // Locked because prerequisites aren't complete (user IS authenticated)
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-stone-200 flex items-center justify-center">
          <svg aria-hidden="true" className="w-8 h-8 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-text font-display mb-2">
          Quest Locked
        </h1>
        <p className="text-sm text-text-muted mb-6">
          Complete the prerequisite quests to unlock this challenge.
        </p>
        {bounty ? (
          <Link
            href={`/bounty/${bounty.id}`}
            className="inline-flex items-center px-5 py-2.5 bg-primary text-text-inverse font-semibold rounded-lg hover:bg-primary-dark transition-colors text-sm"
          >
            Go to {bounty.name}
          </Link>
        ) : (
          <Link
            href="/"
            className="inline-flex items-center px-5 py-2.5 bg-primary text-text-inverse font-semibold rounded-lg hover:bg-primary-dark transition-colors text-sm"
          >
            Return to Trail Map
          </Link>
        )}
      </div>
    );
  }

  return <ChallengeShell challenge={challenge} />;
}
