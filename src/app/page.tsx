"use client";

import { bounties } from "@/data/bounties";
import { useProgress } from "@/context/ProgressContext";
import { TreasureTrail } from "@/components/map/TreasureTrail";
import { BountyPoster } from "@/components/map/BountyPoster";
import { XMarksTheSpot } from "@/components/map/XMarksTheSpot";

/** Per-poster layout config: rotation (desktop) and trail side */
const posterConfig = [
  { rotation: -3, side: "right" as const },
  { rotation: 2.5, side: "left" as const },
  { rotation: -2, side: "right" as const },
  { rotation: 3, side: "left" as const },
];

/**
 * Desktop poster positions  -  absolute pixel values.
 * Calibrated to sit beside the trail waypoints in the SVG
 * (viewBox 0 0 800 1600, container minHeight 1600px).
 *
 * Trail waypoints: y≈250, y≈530, y≈810, y≈1090
 * Posters are ~280px tall, so top = waypoint_y - 40 (roughly centered)
 */
const desktopPositions: Record<string, string>[] = [
  { top: "200px", left: "54%" },    // Waypoint 1  -  right side
  { top: "490px", right: "54%" },   // Waypoint 2  -  left side
  { top: "770px", left: "54%" },    // Waypoint 3  -  right side
  { top: "1050px", right: "54%" },  // Waypoint 4  -  left side
];

export default function HomePage() {
  const { getBountyStatus, totalCompleted } = useProgress();

  // Build bounty data with progress info
  const bountyData = bounties.map((bounty, i) => {
    const status = getBountyStatus(bounty.id);
    const totalQuests = 1 + bounty.sideQuestSlugs.length + 1; // empathy + sides + boss
    const completed =
      (status.empathyDone ? 1 : 0) +
      status.sidesDone +
      (status.bossCompleted ? 1 : 0);

    return { bounty, status, totalQuests, completed, index: i };
  });

  const allBountiesDone = bountyData.every((b) => b.status.allDone);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* ── Hero ── */}
      <section className="pt-10 sm:pt-16 pb-6 text-center">
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-text tracking-tight font-display">
          Howdy, A11y
        </h1>
        <p className="mt-4 text-lg text-text-muted max-w-xl mx-auto">
          Wrangle accessibility outlaws across the WCAG frontier.
          <br />
          <span className="text-sm">Follow the trail. Claim the bounties.</span>
        </p>
        {totalCompleted > 0 && (
          <p className="mt-2 text-sm font-medium text-primary">
            {totalCompleted}/21 quests completed
          </p>
        )}
      </section>

      {/* ── Treasure Map ── */}
      <section aria-label="Bounty trail map" className="pb-16">
        <h2 className="sr-only">Choose Your Bounty</h2>

        {/* ═══════ Desktop layout: winding trail + absolutely-positioned posters ═══════ */}
        <div className="relative hidden md:block" style={{ minHeight: "1600px" }}>
          {/* Decorative SVG trail */}
          <TreasureTrail />

          {/* Bounty posters along the trail */}
          {bountyData.map(({ bounty, status, totalQuests, completed, index }) => {
            const pos = desktopPositions[index];
            const config = posterConfig[index];

            return (
              <div
                key={bounty.id}
                className="absolute w-64"
                style={{
                  top: pos.top,
                  ...(pos.left ? { left: pos.left } : {}),
                  ...("right" in pos && pos.right ? { right: pos.right } : {}),
                }}
              >
                <BountyPoster
                  bounty={bounty}
                  status={status}
                  completed={completed}
                  totalQuests={totalQuests}
                  rotation={config.rotation}
                  clipClass={`poster-clip-${index + 1}`}
                />
              </div>
            );
          })}

          {/* X marks the spot  -  bottom center */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
            <XMarksTheSpot allComplete={allBountiesDone} />
          </div>
        </div>

        {/* ═══════ Mobile layout: vertical trail + stacked posters ═══════ */}
        <div className="md:hidden relative pl-12">
          {/* Vertical dashed trail line */}
          <div
            className="absolute left-5 top-0 bottom-0 w-0 border-l-[3px] border-dashed border-trail"
            aria-hidden="true"
          />

          {/* Start marker */}
          <div className="relative mb-6" aria-hidden="true">
            <div className="absolute -left-[1.85rem] top-0 text-lg">
              &#x1F525;
            </div>
            <p className="text-xs font-display text-text-muted pl-1">Begin here, partner</p>
          </div>

          {/* Posters */}
          {bountyData.map(({ bounty, status, totalQuests, completed, index }) => (
            <div key={bounty.id} className="relative mb-8">
              {/* Connector dot on the trail line */}
              <div
                className="absolute -left-[1.95rem] top-10 w-3 h-3 rounded-full bg-trail border-2 border-surface"
                aria-hidden="true"
              />
              <BountyPoster
                bounty={bounty}
                status={status}
                completed={completed}
                totalQuests={totalQuests}
                rotation={0}
                clipClass={`poster-clip-${index + 1}`}
              />
            </div>
          ))}

          {/* X marks the spot */}
          <div className="relative">
            <div
              className="absolute -left-[2.1rem] top-4 w-4 h-4 flex items-center justify-center"
              aria-hidden="true"
            >
              <span className="text-trail font-bold text-sm">&#x2716;</span>
            </div>
            <XMarksTheSpot allComplete={allBountiesDone} />
          </div>
        </div>
      </section>
    </div>
  );
}
