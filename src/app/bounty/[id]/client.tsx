"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { getBountyById, type BountyId } from "@/data/bounties";
import { getChallengeBySlug } from "@/data/challenges";
import { useProgress } from "@/context/ProgressContext";
import { PrincipleIcon } from "@/components/ui/PrincipleIcon";

interface BountyPageClientProps {
  bountyId: string;
}

export function BountyPageClient({ bountyId }: BountyPageClientProps) {
  const bounty = getBountyById(bountyId as BountyId);
  if (!bounty) notFound();

  const { getChallenge, isChallengeUnlocked, getBountyStatus } = useProgress();
  const status = getBountyStatus(bounty.id);

  const empathyChallenge = getChallengeBySlug(bounty.empathySlug);
  const sideQuests = bounty.sideQuestSlugs.map((s) => getChallengeBySlug(s)).filter(Boolean);
  const bossChallenge = getChallengeBySlug(bounty.bossSlug);

  const totalQuests = 1 + bounty.sideQuestSlugs.length + 1; // empathy + sides + boss
  const completedQuests =
    (status.empathyDone ? 1 : 0) + status.sidesDone + (status.bossCompleted ? 1 : 0);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-primary transition-colors mb-6"
      >
        <svg aria-hidden="true" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Trail Map
      </Link>

      {/* Bounty header */}
      <div className="flex items-center gap-4 mb-2">
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: bounty.color + "20" }}
        >
          <PrincipleIcon icon={bounty.icon} color={bounty.color} size={28} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-text font-display">{bounty.name}</h1>
          <p className="text-sm text-text-muted">{bounty.tagline}</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs text-text-muted mb-1">
          <span>{completedQuests}/{totalQuests} quests</span>
          {status.allDone && <span className="text-green-700 font-semibold">Bounty Complete!</span>}
        </div>
        <div className="w-full h-2 bg-surface-muted rounded-full overflow-hidden border border-border">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${(completedQuests / totalQuests) * 100}%`,
              backgroundColor: bounty.color,
            }}
          />
        </div>
      </div>

      {/* Quest chain */}
      <div className="space-y-3">
        {/* Step label */}
        <div className="text-xs font-semibold text-text-muted uppercase tracking-wide">
          Step 1 — Experience the Barrier
        </div>

        {/* Empathy gateway */}
        {empathyChallenge && (
          <QuestCard
            slug={empathyChallenge.slug}
            title={empathyChallenge.title}
            subtitle="Empathy Experience"
            color={bounty.color}
            completed={status.empathyDone}
            unlocked={true}
            isBoss={false}
            isEmpathy={true}
          />
        )}

        {/* Connector */}
        <div className="flex items-center gap-2 pl-6">
          <div className="w-0.5 h-6" style={{ backgroundColor: status.empathyDone ? bounty.color : "#d6d3d1" }} />
        </div>

        {/* Side quests */}
        <div className="text-xs font-semibold text-text-muted uppercase tracking-wide">
          Step 2 — Wrangle the Outlaws ({status.sidesDone}/{status.sidesTotal})
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {sideQuests.map((challenge) => {
            if (!challenge) return null;
            const done = !!getChallenge(challenge.slug)?.completed;
            const unlocked = isChallengeUnlocked(challenge.slug);
            return (
              <QuestCard
                key={challenge.slug}
                slug={challenge.slug}
                title={challenge.title}
                subtitle={challenge.mode === "code-editor" ? "Code" : "Controls"}
                color={bounty.color}
                completed={done}
                unlocked={unlocked}
                isBoss={false}
                isEmpathy={false}
              />
            );
          })}
        </div>

        {/* Connector */}
        <div className="flex items-center gap-2 pl-6">
          <div className="w-0.5 h-6" style={{ backgroundColor: status.bossUnlocked ? bounty.color : "#d6d3d1" }} />
        </div>

        {/* Boss battle */}
        <div className="text-xs font-semibold text-text-muted uppercase tracking-wide">
          Step 3 — Boss Battle
        </div>

        {bossChallenge && (
          <QuestCard
            slug={bossChallenge.slug}
            title={bossChallenge.title}
            subtitle="Final Showdown"
            color={bounty.color}
            completed={status.bossCompleted}
            unlocked={status.bossUnlocked}
            isBoss={true}
            isEmpathy={false}
          />
        )}
      </div>
    </div>
  );
}

interface QuestCardProps {
  slug: string;
  title: string;
  subtitle: string;
  color: string;
  completed: boolean;
  unlocked: boolean;
  isBoss: boolean;
  isEmpathy: boolean;
}

function QuestCard({
  slug,
  title,
  subtitle,
  color,
  completed,
  unlocked,
  isBoss,
  isEmpathy,
}: QuestCardProps) {
  const borderClass = completed
    ? "border-green-400 bg-green-50"
    : isBoss
      ? "border-2"
      : "border-border";

  const content = (
    <div
      className={`flex items-center gap-3 p-4 rounded-xl border ${borderClass} ${
        !unlocked ? "opacity-60" : "hover:border-primary"
      } transition-colors ${isBoss ? "bg-surface-muted" : ""}`}
      style={isBoss && !completed ? { borderColor: color } : undefined}
      aria-disabled={!unlocked}
    >
      {/* Status icon */}
      <div className="flex-shrink-0">
        {completed ? (
          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
            <svg aria-hidden="true" className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        ) : !unlocked ? (
          <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center">
            <svg aria-hidden="true" className="w-4 h-4 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
        ) : isEmpathy ? (
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: color + "20" }}>
            <svg aria-hidden="true" className="w-4 h-4" style={{ color }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4M12 8h.01" />
            </svg>
          </div>
        ) : isBoss ? (
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: color + "20" }}>
            <svg aria-hidden="true" className="w-5 h-5" style={{ color }} fill="currentColor" viewBox="0 0 24 24">
              <polygon points="12,2 14.5,9 22,9.5 16.5,14 18,22 12,18 6,22 7.5,14 2,9.5 9.5,9" />
            </svg>
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-surface-muted flex items-center justify-center">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
          </div>
        )}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <div className={`text-sm font-semibold ${completed ? "text-green-700" : "text-text"}`}>
          {title}
        </div>
        <div className="text-xs text-text-muted">{subtitle}</div>
      </div>

      {/* Arrow or lock message */}
      {unlocked && !completed && (
        <svg aria-hidden="true" className="w-4 h-4 text-text-muted flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      )}
    </div>
  );

  if (unlocked) {
    return (
      <Link href={`/challenges/${slug}`} className="block">
        {content}
      </Link>
    );
  }

  return content;
}
