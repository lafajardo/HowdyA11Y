"use client";

import { useEffect, useRef, useState } from "react";

/** Parallax speed multipliers (fraction of scrollY applied as translateY) */
const RATES = {
  sun: -0.02,
  mesas: 0.05,
  hills: 0.15,
  foreground: 0.3,
};

/** Pre-computed sun ray endpoints to avoid SSR/client hydration mismatch from Math.cos/sin */
const SUN_CX = 1100;
const SUN_CY = 120;
const SUN_RAYS = Array.from({ length: 12 }).map((_, i) => {
  const angle = (i * 30 * Math.PI) / 180;
  return {
    x1: Math.round((SUN_CX + Math.cos(angle) * 48) * 100) / 100,
    y1: Math.round((SUN_CY + Math.sin(angle) * 48) * 100) / 100,
    x2: Math.round((SUN_CX + Math.cos(angle) * 80) * 100) / 100,
    y2: Math.round((SUN_CY + Math.sin(angle) * 80) * 100) / 100,
  };
});

/** Dust particle definitions (x%, y%, radius, duration, delay) */
const DUST = [
  { x: 8, y: 15, r: 1.5, dur: 10, del: 0 },
  { x: 22, y: 35, r: 2, dur: 13, del: 2 },
  { x: 45, y: 10, r: 1, dur: 9, del: 4 },
  { x: 60, y: 50, r: 2.5, dur: 14, del: 1 },
  { x: 75, y: 20, r: 1.5, dur: 11, del: 3 },
  { x: 88, y: 40, r: 1, dur: 8, del: 5 },
  { x: 15, y: 60, r: 2, dur: 12, del: 2.5 },
  { x: 35, y: 25, r: 1.5, dur: 10, del: 1.5 },
  { x: 52, y: 55, r: 1, dur: 15, del: 0.5 },
  { x: 70, y: 8, r: 2, dur: 11, del: 3.5 },
  { x: 92, y: 30, r: 1.5, dur: 9, del: 4.5 },
  { x: 40, y: 45, r: 1, dur: 13, del: 2 },
];

export function WesternBackground() {
  const [scrollY, setScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const rafRef = useRef(0);
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    setIsMobile(window.innerWidth < 768);

    if (reducedMotion.current) return;

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        rafRef.current = requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  /** Helper: build parallax transform style */
  const px = (rate: number) =>
    reducedMotion.current
      ? undefined
      : {
          transform: `translate3d(0, ${scrollY * rate}px, 0)`,
          willChange: "transform" as const,
        };

  // Scroll progress 0→1 over first 1200px of scroll
  const sunsetProgress = Math.min(scrollY / 1200, 1);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none"
    >
      {/* ── Layer 0: Sky gradient ── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(254,243,199,0.85) 0%, rgba(254,253,248,1) 70%, rgba(254,253,248,1) 100%)",
        }}
      />
      {/* Sunset overlay — fades in as user scrolls */}
      <div
        className="absolute inset-0 transition-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(234,88,12,0.15) 0%, rgba(180,83,9,0.08) 30%, transparent 60%)",
          opacity: sunsetProgress,
        }}
      />

      {/* ── Layer 4: Sun (moves UP as you scroll) ── */}
      <div className="absolute inset-0" style={px(RATES.sun)}>
        <svg
          role="presentation"
          focusable="false"
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1440 900"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
        >
          {/* Sun glow */}
          <circle cx="1100" cy="120" r="60" fill="rgba(245,158,11,0.12)" />
          <circle cx="1100" cy="120" r="40" fill="rgba(245,158,11,0.2)" />
          <circle cx="1100" cy="120" r="24" fill="rgba(245,158,11,0.3)" />
          {/* Sun rays */}
          {SUN_RAYS.map((ray, i) => (
            <line
              key={i}
              x1={ray.x1}
              y1={ray.y1}
              x2={ray.x2}
              y2={ray.y2}
              stroke="rgba(245,158,11,0.2)"
              strokeWidth="2"
              strokeLinecap="round"
            />
          ))}
        </svg>
      </div>

      {/* ── Layer 1: Distant mesas ── */}
      <div className="absolute inset-0" style={px(RATES.mesas)}>
        <svg
          role="presentation"
          focusable="false"
          className="absolute bottom-0 w-full"
          style={{ height: "45%" }}
          viewBox="0 0 1440 400"
          preserveAspectRatio="none"
          fill="none"
        >
          {/* Mesa 1 — tall left */}
          <polygon
            points="80,400 140,160 200,140 320,140 380,180 420,400"
            fill="rgba(146,64,14,0.12)"
          />
          {/* Mesa 2 — medium center-left */}
          <polygon
            points="500,400 550,220 600,200 700,200 740,230 780,400"
            fill="rgba(146,64,14,0.1)"
          />
          {/* Mesa 3 — tall center-right */}
          <polygon
            points="850,400 920,120 980,100 1080,100 1120,130 1180,400"
            fill="rgba(146,64,14,0.14)"
          />
          {/* Mesa 4 — short far right */}
          <polygon
            points="1250,400 1290,240 1330,230 1400,230 1430,250 1440,400"
            fill="rgba(146,64,14,0.08)"
          />
          {/* Mesa arch/window in mesa 3 */}
          <path
            d="M990,200 Q1020,160 1050,200"
            stroke="rgba(254,253,248,0.5)"
            strokeWidth="8"
            fill="none"
          />
        </svg>
      </div>

      {/* ── Layer 2: Desert hills + cacti ── */}
      <div className="absolute inset-0" style={px(RATES.hills)}>
        <svg
          role="presentation"
          focusable="false"
          className="absolute bottom-0 w-full"
          style={{ height: "35%" }}
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          fill="none"
        >
          {/* Rolling hills */}
          <path
            d="M0,320 C120,240 240,280 360,250 S600,220 720,260 S960,200 1080,240 S1320,210 1440,260 L1440,320 Z"
            fill="rgba(146,64,14,0.1)"
          />
          <path
            d="M0,320 C100,280 200,300 360,270 S560,250 720,280 S920,240 1100,270 S1340,240 1440,280 L1440,320 Z"
            fill="rgba(146,64,14,0.08)"
          />

          {/* Saguaro cacti */}
          {/* Cactus 1 */}
          <g transform="translate(150, 210)" opacity="0.25">
            <line x1="10" y1="0" x2="10" y2="50" stroke="#15803d" strokeWidth="5" strokeLinecap="round" />
            <path d="M10,15 C-2,15 -2,5 -2,0" stroke="#15803d" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M10,22 C22,22 22,12 22,6" stroke="#15803d" strokeWidth="4" strokeLinecap="round" fill="none" />
          </g>
          {/* Cactus 2 */}
          <g transform="translate(520, 200)" opacity="0.2">
            <line x1="10" y1="0" x2="10" y2="60" stroke="#15803d" strokeWidth="5" strokeLinecap="round" />
            <path d="M10,18 C-4,18 -4,8 -4,0" stroke="#15803d" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M10,28 C24,28 24,14 24,6" stroke="#15803d" strokeWidth="4" strokeLinecap="round" fill="none" />
          </g>
          {/* Cactus 3 — small */}
          <g transform="translate(880, 220)" opacity="0.18">
            <line x1="8" y1="0" x2="8" y2="35" stroke="#15803d" strokeWidth="4" strokeLinecap="round" />
            <path d="M8,10 C0,10 0,5 0,0" stroke="#15803d" strokeWidth="3" strokeLinecap="round" fill="none" />
          </g>
          {/* Cactus 4 */}
          <g transform="translate(1200, 215)" opacity="0.22">
            <line x1="10" y1="0" x2="10" y2="45" stroke="#15803d" strokeWidth="5" strokeLinecap="round" />
            <path d="M10,12 C-2,12 -2,4 -2,0" stroke="#15803d" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M10,20 C20,20 20,10 20,4" stroke="#15803d" strokeWidth="4" strokeLinecap="round" fill="none" />
          </g>
          {/* Cactus 5 — small */}
          <g transform="translate(1380, 230)" opacity="0.15">
            <line x1="6" y1="0" x2="6" y2="30" stroke="#15803d" strokeWidth="3" strokeLinecap="round" />
            <path d="M6,10 C14,10 14,4 14,0" stroke="#15803d" strokeWidth="3" strokeLinecap="round" fill="none" />
          </g>
        </svg>
      </div>

      {/* ── Layer 3: Foreground elements ── */}
      <div className="absolute inset-0" style={px(RATES.foreground)}>
        <svg
          role="presentation"
          focusable="false"
          className="absolute bottom-0 w-full"
          style={{ height: "25%" }}
          viewBox="0 0 1440 240"
          preserveAspectRatio="none"
          fill="none"
        >
          {/* Desert grass tufts */}
          {[80, 320, 560, 800, 1050, 1280].map((x, i) => (
            <g key={`grass-${i}`} transform={`translate(${x}, 220)`} opacity="0.25">
              <line x1="0" y1="0" x2="-4" y2="-14" stroke="#78716c" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="3" y1="0" x2="1" y2="-16" stroke="#78716c" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="6" y1="0" x2="10" y2="-13" stroke="#78716c" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="9" y1="0" x2="14" y2="-10" stroke="#78716c" strokeWidth="1.5" strokeLinecap="round" />
            </g>
          ))}

          {/* Rock clusters */}
          <g opacity="0.2">
            <ellipse cx="200" cy="228" rx="12" ry="5" fill="#78716c" />
            <ellipse cx="218" cy="232" rx="8" ry="4" fill="#78716c" />
          </g>
          <g opacity="0.18">
            <ellipse cx="700" cy="230" rx="10" ry="4" fill="#78716c" />
            <ellipse cx="715" cy="233" rx="6" ry="3" fill="#78716c" />
            <ellipse cx="690" cy="234" rx="5" ry="3" fill="#78716c" />
          </g>
          <g opacity="0.22">
            <ellipse cx="1100" cy="226" rx="14" ry="6" fill="#78716c" />
            <ellipse cx="1120" cy="231" rx="9" ry="4" fill="#78716c" />
          </g>

          {/* Tumbleweeds */}
          <g className="tumbleweed-spin" opacity="0.2">
            <circle cx="350" cy="210" r="12" stroke="#a8a29e" strokeWidth="1.5" fill="none" />
            <circle cx="350" cy="210" r="7" stroke="#a8a29e" strokeWidth="1" fill="none" />
            <line x1="342" y1="204" x2="358" y2="216" stroke="#a8a29e" strokeWidth="0.8" />
            <line x1="344" y1="218" x2="356" y2="202" stroke="#a8a29e" strokeWidth="0.8" />
          </g>
          <g className="tumbleweed-spin" style={{ animationDuration: "25s", animationDelay: "-8s" }} opacity="0.18">
            <circle cx="950" cy="215" r="9" stroke="#a8a29e" strokeWidth="1.5" fill="none" />
            <circle cx="950" cy="215" r="5" stroke="#a8a29e" strokeWidth="1" fill="none" />
            <line x1="944" y1="210" x2="956" y2="220" stroke="#a8a29e" strokeWidth="0.8" />
            <line x1="945" y1="221" x2="955" y2="209" stroke="#a8a29e" strokeWidth="0.8" />
          </g>
        </svg>
      </div>

      {/* ── Layer 5: Dust particles (desktop only) ── */}
      {!isMobile && (
        <svg
          role="presentation"
          focusable="false"
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          fill="none"
        >
          {DUST.map((d, i) => (
            <circle
              key={i}
              cx={d.x}
              cy={d.y}
              r={d.r}
              fill="rgba(168,162,158,0.15)"
              className="dust-particle"
              style={
                {
                  "--dust-duration": `${d.dur}s`,
                  "--dust-delay": `${d.del}s`,
                } as React.CSSProperties
              }
            />
          ))}
        </svg>
      )}
    </div>
  );
}
