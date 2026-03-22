/**
 * XMarksTheSpot  -  The final destination marker at the end of the treasure trail.
 *
 * Shows a big red "X" that turns gold when all bounties are complete.
 * Purely decorative  -  aria-hidden on the SVG, with a visible text label.
 */

interface XMarksTheSpotProps {
  allComplete: boolean;
}

export function XMarksTheSpot({ allComplete }: XMarksTheSpotProps) {
  const color = allComplete ? "#ca8a04" : "#b91c1c";
  const glowColor = allComplete ? "rgba(202, 138, 4, 0.5)" : "transparent";

  return (
    <div className="flex flex-col items-center gap-2 py-6">
      {/* X mark */}
      <svg
        aria-hidden="true"
        width="64"
        height="64"
        viewBox="0 0 64 64"
        fill="none"
        style={{
          filter: allComplete ? `drop-shadow(0 0 12px ${glowColor})` : undefined,
        }}
      >
        <line
          x1="10" y1="10" x2="54" y2="54"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
        />
        <line
          x1="54" y1="10" x2="10" y2="54"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
        />
      </svg>

      {/* Label */}
      <span
        className="font-display text-sm tracking-widest"
        style={{ color }}
        aria-hidden="true"
      >
        {allComplete ? "WCAG MASTERY" : "WCAG MASTERY"}
      </span>

      {allComplete && (
        <span className="text-xs text-success font-semibold">
          All bounties captured!
        </span>
      )}
    </div>
  );
}
