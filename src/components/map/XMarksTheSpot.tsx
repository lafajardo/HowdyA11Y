/**
 * XMarksTheSpot  -  The final destination marker at the end of the treasure trail.
 *
 * Shows an overflowing treasure chest that glows gold when all bounties are complete.
 * Purely decorative  -  aria-hidden on the SVG, with a visible text label.
 */

interface XMarksTheSpotProps {
  allComplete: boolean;
}

export function XMarksTheSpot({ allComplete }: XMarksTheSpotProps) {
  const labelColor = allComplete ? "#ca8a04" : "#b91c1c";
  const glowFilter = allComplete
    ? "drop-shadow(0 0 16px rgba(202, 138, 4, 0.5))"
    : undefined;
  const treasureOpacity = allComplete ? 1 : 0.45;

  return (
    <div className="flex flex-col items-center gap-3 py-6">
      <svg
        aria-hidden="true"
        width="120"
        height="100"
        viewBox="0 0 120 100"
        fill="none"
        style={{ filter: glowFilter }}
      >
        {/* Ground shadow */}
        <ellipse cx="60" cy="94" rx="50" ry="6" fill="#1c1917" opacity="0.15" />

        {/* Chest body */}
        <rect x="20" y="52" width="80" height="40" rx="4" fill="#5c3a1e" />
        {/* Front panel highlight */}
        <rect x="24" y="56" width="72" height="32" rx="2" fill="#8B6914" opacity="0.3" />
        {/* Metal bands */}
        <rect x="20" y="60" width="80" height="3" fill="#3d2410" opacity="0.7" />
        <rect x="20" y="78" width="80" height="3" fill="#3d2410" opacity="0.7" />
        {/* Side shading */}
        <rect x="20" y="52" width="6" height="40" rx="2" fill="#3d2410" opacity="0.3" />
        <rect x="94" y="52" width="6" height="40" rx="2" fill="#3d2410" opacity="0.3" />
        {/* Lock/clasp */}
        <rect x="54" y="68" width="12" height="10" rx="2" fill="#ca8a04" />
        <circle cx="60" cy="74" r="2" fill="#3d2410" />

        {/* Chest lid (open, tilted back) */}
        <path
          d="M18 52 L22 24 L98 24 L102 52 Z"
          fill="#6b4226"
        />
        {/* Lid top face */}
        <rect x="22" y="22" width="76" height="6" rx="2" fill="#7c4f2d" />
        {/* Lid metal band */}
        <rect x="22" y="30" width="76" height="3" fill="#3d2410" opacity="0.6" />
        {/* Lid inner shadow */}
        <path
          d="M24 52 L26 36 L94 36 L96 52 Z"
          fill="#2d1a0e"
          opacity="0.4"
        />

        {/* Overflowing treasure */}
        <g opacity={treasureOpacity}>
          {/* Gold coins spilling out top */}
          <circle cx="38" cy="44" r="6" fill="#f59e0b" stroke="#ca8a04" strokeWidth="1" className={allComplete ? "treasure-shimmer" : ""} />
          <circle cx="52" cy="40" r="7" fill="#fbbf24" stroke="#ca8a04" strokeWidth="1" className={allComplete ? "treasure-shimmer" : ""} />
          <circle cx="68" cy="42" r="6" fill="#f59e0b" stroke="#ca8a04" strokeWidth="1" className={allComplete ? "treasure-shimmer" : ""} />
          <circle cx="80" cy="46" r="5" fill="#fbbf24" stroke="#ca8a04" strokeWidth="1" className={allComplete ? "treasure-shimmer" : ""} />
          <circle cx="46" cy="48" r="5" fill="#fbbf24" stroke="#ca8a04" strokeWidth="1" className={allComplete ? "treasure-shimmer" : ""} />

          {/* Coins spilling over edges */}
          <circle cx="16" cy="64" r="4.5" fill="#f59e0b" stroke="#ca8a04" strokeWidth="0.8" className={allComplete ? "treasure-shimmer" : ""} />
          <circle cx="104" cy="68" r="4" fill="#fbbf24" stroke="#ca8a04" strokeWidth="0.8" className={allComplete ? "treasure-shimmer" : ""} />
          <circle cx="12" cy="72" r="3.5" fill="#fbbf24" stroke="#ca8a04" strokeWidth="0.8" className={allComplete ? "treasure-shimmer" : ""} />

          {/* Ruby gem */}
          <path d="M74 38 L78 44 L74 46 L70 44 Z" fill="#dc2626" stroke="#991b1b" strokeWidth="0.8" />
          {/* Emerald gem */}
          <path d="M32 42 L36 46 L34 50 L30 48 Z" fill="#16a34a" stroke="#15803d" strokeWidth="0.8" />

          {/* Pearl necklace draped over edge */}
          <circle cx="86" cy="50" r="2" fill="#fefce8" stroke="#d6d3d1" strokeWidth="0.5" />
          <circle cx="90" cy="54" r="2" fill="#fefce8" stroke="#d6d3d1" strokeWidth="0.5" />
          <circle cx="93" cy="58" r="2" fill="#fefce8" stroke="#d6d3d1" strokeWidth="0.5" />
          <circle cx="95" cy="62" r="2" fill="#fefce8" stroke="#d6d3d1" strokeWidth="0.5" />
          <line x1="86" y1="50" x2="90" y2="54" stroke="#d6d3d1" strokeWidth="0.5" />
          <line x1="90" y1="54" x2="93" y2="58" stroke="#d6d3d1" strokeWidth="0.5" />
          <line x1="93" y1="58" x2="95" y2="62" stroke="#d6d3d1" strokeWidth="0.5" />
        </g>
      </svg>

      {/* Label */}
      <span
        className="font-display text-sm tracking-widest"
        style={{ color: labelColor }}
        aria-hidden="true"
      >
        WCAG MASTERY
      </span>

      {allComplete && (
        <span className="text-xs text-success font-semibold">
          All bounties captured!
        </span>
      )}
    </div>
  );
}
