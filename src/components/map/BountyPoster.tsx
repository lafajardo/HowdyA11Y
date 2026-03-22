import Link from "next/link";
import { PrincipleIcon } from "@/components/ui/PrincipleIcon";
import type { BountyDefinition } from "@/data/bounties";

interface BountyStatus {
  empathyDone: boolean;
  sidesDone: number;
  sidesTotal: number;
  bossUnlocked: boolean;
  bossCompleted: boolean;
  allDone: boolean;
}

interface BountyPosterProps {
  bounty: BountyDefinition;
  status: BountyStatus;
  completed: number;
  totalQuests: number;
  /** Rotation in degrees (desktop only) */
  rotation: number;
  /** Which torn-paper clip-path class: "poster-clip-1" … "poster-clip-4" */
  clipClass: string;
}

export function BountyPoster({
  bounty,
  status,
  completed,
  totalQuests,
  rotation,
  clipClass,
}: BountyPosterProps) {
  const percent = totalQuests > 0 ? Math.round((completed / totalQuests) * 100) : 0;
  const isDone = status.allDone;

  return (
    <Link
      href={`/bounty/${bounty.id}`}
      aria-label={`${bounty.name} bounty — ${completed} of ${totalQuests} quests complete${isDone ? " (completed)" : ""}`}
      className={`bounty-poster group block ${clipClass}`}
      style={{
        transform: `rotate(${rotation}deg)`,
      }}
    >
      <article
        className={`
          relative w-full px-5 py-6 text-center
          bg-gradient-to-b from-parchment to-parchment-dark
          border-4 ring-1 ring-inset
          shadow-[4px_6px_12px_rgba(0,0,0,0.4)]
          ${isDone
            ? "border-success ring-success/30"
            : "border-poster-border ring-poster-border/30"
          }
        `}
      >
        {/* ── WANTED header ── */}
        <div className="flex items-center justify-center gap-1.5 mb-3" aria-hidden="true">
          <Star color={isDone ? "#16a34a" : bounty.color} />
          <Star color={isDone ? "#16a34a" : bounty.color} />
          <Star color={isDone ? "#16a34a" : bounty.color} />
          <span
            className="font-display text-sm tracking-[0.25em] mx-1"
            style={{ color: isDone ? "#16a34a" : bounty.color }}
          >
            WANTED
          </span>
          <Star color={isDone ? "#16a34a" : bounty.color} />
          <Star color={isDone ? "#16a34a" : bounty.color} />
          <Star color={isDone ? "#16a34a" : bounty.color} />
        </div>

        {/* ── Icon ── */}
        <div className="flex justify-center mb-2">
          <PrincipleIcon
            icon={bounty.icon}
            color={isDone ? "#16a34a" : bounty.color}
            size={48}
          />
        </div>

        {/* ── Name ── */}
        <h3
          className="font-display text-lg leading-tight mb-1 group-hover:underline"
          style={{ color: isDone ? "#16a34a" : "#1c1917" }}
        >
          {bounty.name}
        </h3>

        {/* ── Tagline ── */}
        <p className="text-xs italic text-text-muted leading-snug mb-3">
          &ldquo;{bounty.tagline}&rdquo;
        </p>

        {/* ── Divider ── */}
        <div
          className="mx-auto mb-3 h-0.5 w-3/4"
          style={{ backgroundColor: isDone ? "#16a34a" : bounty.color, opacity: 0.4 }}
          aria-hidden="true"
        />

        {/* ── Reward / Progress ── */}
        <div className="text-xs font-semibold mb-1.5" style={{ color: isDone ? "#16a34a" : bounty.color }}>
          REWARD: {completed}/{totalQuests} quests
        </div>

        {/* Progress bar */}
        <div className="mx-auto w-3/4 h-2 rounded-full bg-black/10 overflow-hidden mb-3">
          <div
            role="progressbar"
            aria-valuenow={completed}
            aria-valuemin={0}
            aria-valuemax={totalQuests}
            aria-label={`${bounty.name} progress: ${completed} of ${totalQuests}`}
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${percent}%`,
              backgroundColor: isDone ? "#16a34a" : bounty.color,
            }}
          />
        </div>

        {/* ── Status footer ── */}
        <div className="text-xs font-bold tracking-wide" aria-hidden="true">
          {isDone ? (
            <span className="text-success">
              &#10003; CAPTURED
            </span>
          ) : (
            <span className="text-text-muted">
              &#x25CF; DEAD OR ALIVE &#x25CF;
            </span>
          )}
        </div>

        {/* Complete badge overlay */}
        {isDone && (
          <div
            className="absolute -top-2 -right-2 bg-success text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md"
            aria-hidden="true"
          >
            &#10003;
          </div>
        )}
      </article>
    </Link>
  );
}

/** Tiny decorative star used in the WANTED header */
function Star({ color }: { color: string }) {
  return (
    <svg aria-hidden="true" width="8" height="8" viewBox="0 0 10 10" fill={color}>
      <polygon points="5,0 6.2,3.5 10,3.8 7,6.2 8,10 5,7.8 2,10 3,6.2 0,3.8 3.8,3.5" />
    </svg>
  );
}
