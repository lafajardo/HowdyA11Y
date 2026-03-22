"use client";

import { useRef, useEffect, useState } from "react";
import { bounties } from "@/data/bounties";
import { useProgress } from "@/context/ProgressContext";
import { TreasureTrail } from "@/components/map/TreasureTrail";
import { BountyPoster } from "@/components/map/BountyPoster";
import { XMarksTheSpot } from "@/components/map/XMarksTheSpot";

/** Reusable scroll-triggered fade-in via Intersection Observer */
function useScrollFadeIn() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    el.style.opacity = "0";
    el.style.transform = "translateY(2rem)";

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = "";
          el.style.transform = "";
          el.classList.add("trail-fade-in");
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

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
  const [campfireLit, setCampfireLit] = useState(false);

  const introRef = useScrollFadeIn();
  const trailRef = useScrollFadeIn();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* ── Hero ── */}
      <section className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center text-center">
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

        {/* CTA scroll button */}
        <a
          href="#intro"
          className="cta-western mt-10 inline-flex flex-col items-center gap-2 px-10 py-5 bg-gradient-to-b from-parchment to-parchment-dark text-primary-dark font-display text-lg border-2 border-poster-border shadow-[3px_5px_10px_rgba(0,0,0,0.3)]"
          aria-label="Scroll down to the introduction"
        >
          Hit the Trail
          <svg aria-hidden="true" className="cta-bounce" width="22" height="16" viewBox="0 0 22 16" fill="none">
            <path d="M11 16L1 6" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M11 16L21 6" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M11 12L4 2" stroke="#78350f" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
            <path d="M11 12L18 2" stroke="#78350f" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
          </svg>
        </a>
      </section>

      {/* ── Intro Section ── */}
      <section
        ref={introRef}
        id="intro"
        aria-labelledby="intro-heading"
        className="py-16"
      >
        <div className="bg-parchment/60 backdrop-blur-sm border border-poster-border/30 rounded-2xl p-8 sm:p-10">
          <h2
            id="intro-heading"
            className="text-2xl sm:text-3xl font-bold text-text text-center font-display mb-8"
          >
            Gather &rsquo;Round, Partner
          </h2>

          <div className="max-w-2xl mx-auto text-center space-y-4">
            <p className="text-base sm:text-lg text-text-muted leading-relaxed">
              Welcome to the frontier, partner. This here is an interactive
              adventure that teaches web accessibility through hands-on bounty
              hunting. Instead of dusty textbooks, you&rsquo;ll wrangle real
              accessibility outlaws and see the impact of your fixes in real time.
            </p>
            <p className="text-base sm:text-lg text-text-muted leading-relaxed">
              The web is a lawless place. The vast majority of websites
              have issues that keep folks with disabilities locked out. Most
              developers ride out into the industry without any accessibility
              training. This roundup aims to change that.
            </p>
            <p className="text-base sm:text-lg text-text-muted leading-relaxed">
              Your bounties follow the four laws of the WCAG
              frontier: <strong>Perceivable</strong>, <strong>Operable</strong>,{" "}
              <strong>Understandable</strong>, and <strong>Robust</strong>.
              Master them all, and you&rsquo;ll bring law and order to every
              line of code you write.
            </p>
          </div>

          {/* Decorative divider */}
          <div className="flex items-center justify-center gap-3 mt-8 mb-2 text-poster-border/50" aria-hidden="true">
            <span className="block w-12 border-t border-poster-border/30" />
            <span className="text-xs font-display tracking-widest">&#x2726;</span>
            <span className="block w-12 border-t border-poster-border/30" />
          </div>

          {/* Light the Campfire CTA */}
          <div className="mt-10 text-center">
            <button
              onClick={() => {
                setCampfireLit(true);
                document.getElementById("bounty-trail")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="cta-western inline-flex flex-col items-center gap-2 px-10 py-5 bg-gradient-to-b from-parchment to-parchment-dark text-primary-dark font-display text-lg border-2 border-poster-border shadow-[3px_5px_10px_rgba(0,0,0,0.3)]"
              aria-label="Light the campfire and scroll to the bounty trail"
            >
              Light the Campfire
              <svg aria-hidden="true" className="cta-bounce" width="20" height="26" viewBox="0 0 20 26" fill="none">
                <path d="M10 0C10 0 2 10 4 16C4 18 8 20 10 17C12 20 16 18 16 16C18 10 10 0 10 0Z" fill="#f59e0b" stroke="#dc2626" strokeWidth="1" />
                <path d="M10 8C10 8 7 13 8 15C8 16 10 15 10 15C10 15 12 16 12 15C13 13 10 8 10 8Z" fill="#fbbf24" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* ── Treasure Map ── */}
      <section ref={trailRef} id="bounty-trail" aria-label="Bounty trail map" className="pb-16">
        <h2 className="sr-only">Choose Your Bounty</h2>

        {/* ═══════ Desktop layout: winding trail + absolutely-positioned posters ═══════ */}
        <div className="relative hidden md:block" style={{ minHeight: "1600px" }}>
          {/* Decorative SVG trail */}
          <TreasureTrail lit={campfireLit} />

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

          {/* Start marker — campfire */}
          <div className="relative mb-6" aria-hidden="true">
            <div className={`absolute -left-[2.2rem] -top-1 ${campfireLit ? "mobile-fire-lit" : "mobile-fire-unlit"}`}>
              <svg aria-hidden="true" width="30" height="34" viewBox="0 0 40 44" fill="none">
                {/* Stones */}
                <ellipse cx="8" cy="38" rx="4" ry="2.5" fill="#78716c" opacity="0.5" />
                <ellipse cx="20" cy="40" rx="4" ry="2" fill="#6b7280" opacity="0.45" />
                <ellipse cx="32" cy="38" rx="4" ry="2.5" fill="#78716c" opacity="0.5" />
                {/* Logs */}
                <line x1="6" y1="34" x2="34" y2="30" stroke={campfireLit ? "#78350f" : "#a8a29e"} strokeWidth="3.5" strokeLinecap="round" />
                <line x1="34" y1="34" x2="6" y2="30" stroke={campfireLit ? "#78350f" : "#a8a29e"} strokeWidth="3.5" strokeLinecap="round" />
                {/* Outer flame */}
                <path d="M20 2C20 2 8 16 12 26C13 28 17 30 20 25C23 30 27 28 28 26C32 16 20 2 20 2Z" fill="#dc2626" opacity="0.8" className={`campfire-flame ${campfireLit ? "lit" : ""}`} />
                {/* Middle flame */}
                <path d="M20 8C20 8 12 20 15 26C16 28 18 27 20 24C22 27 24 28 25 26C28 20 20 8 20 8Z" fill="#f59e0b" className={`campfire-flame ${campfireLit ? "lit" : ""}`} />
                {/* Inner flame */}
                <path d="M20 14C20 14 16 22 18 25C19 26 20 25 20 25C20 25 21 26 22 25C24 22 20 14 20 14Z" fill="#fbbf24" className={`campfire-flame campfire-flame-inner ${campfireLit ? "lit" : ""}`} />
              </svg>
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

          {/* Treasure chest at trail end */}
          <div className="relative">
            <div
              className="absolute -left-[2.3rem] top-4"
              aria-hidden="true"
            >
              <svg width="22" height="18" viewBox="0 0 30 24" fill="none">
                {/* Chest body */}
                <rect x="3" y="10" width="24" height="12" rx="1.5" fill="#5c3a1e" />
                <rect x="3" y="14" width="24" height="1.5" fill="#3d2410" opacity="0.6" />
                {/* Lid */}
                <path d="M2 10 L4 4 L26 4 L28 10 Z" fill="#6b4226" />
                <rect x="4" y="3" width="22" height="2" rx="1" fill="#7c4f2d" />
                {/* Clasp */}
                <rect x="13" y="12" width="4" height="4" rx="1" fill="#ca8a04" />
                {/* Coins */}
                <circle cx="10" cy="7" r="2.5" fill="#f59e0b" stroke="#ca8a04" strokeWidth="0.5" />
                <circle cx="18" cy="6" r="2.5" fill="#fbbf24" stroke="#ca8a04" strokeWidth="0.5" />
              </svg>
            </div>
            <XMarksTheSpot allComplete={allBountiesDone} />
          </div>
        </div>
      </section>
    </div>
  );
}
