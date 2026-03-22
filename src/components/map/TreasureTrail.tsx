/**
 * TreasureTrail  -  Decorative SVG trail of red dashes winding through the page.
 *
 * Purely visual / aria-hidden. The S-curve snakes through 4 waypoints
 * where the bounty posters are positioned, ending at the X-marks-the-spot.
 *
 * Desktop: winding S-curve path
 * Mobile:  handled by the parent layout (simple CSS dashed border)
 */
export function TreasureTrail({ lit = false }: { lit?: boolean }) {
  // S-curve trail snaking right → left → right → left through 4 poster stops.
  // Poster tops: 200, 490, 770, 1050 (each ~280px tall).
  // Trail passes near the vertical center of each poster (~y 340, 630, 910, 1190).
  const trailPath = [
    "M 400 30",
    // Start → curve right to waypoint 1 (poster center ~y340)
    "C 420 100, 600 180, 560 280",
    "S 520 330, 500 340",
    // Waypoint 1 (right, ~y340) → swing left to waypoint 2 (~y630)
    "C 440 400, 240 480, 260 560",
    "S 280 620, 300 630",
    // Waypoint 2 (left, ~y630) → swing right to waypoint 3 (~y910)
    "C 360 700, 580 780, 560 850",
    "S 520 900, 500 910",
    // Waypoint 3 (right, ~y910) → swing left to waypoint 4 (~y1190)
    "C 440 980, 240 1060, 260 1130",
    "S 280 1180, 300 1190",
    // Waypoint 4 (left, ~y1190) → long descent to X at bottom
    "C 340 1260, 380 1360, 400 1500",
  ].join(" ");

  return (
    <svg
      aria-hidden="true"
      role="presentation"
      focusable="false"
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 800 1600"
      preserveAspectRatio="none"
      fill="none"
    >
      {/* Main trail path */}
      <path
        d={trailPath}
        stroke="#b91c1c"
        strokeWidth="3.5"
        strokeDasharray="14 9"
        strokeLinecap="round"
        className="trail-path"
      />

      {/* Start marker  -  campfire */}
      <g transform="translate(384, 4)">
        {/* Glow behind flame */}
        <circle
          cx="16"
          cy="14"
          r="22"
          fill="#f59e0b"
          className={`campfire-glow ${lit ? "lit" : ""}`}
          style={{ filter: "blur(8px)" }}
        />
        {/* Logs - gray when unlit, brown when lit */}
        <line
          x1="4" y1="24" x2="28" y2="18"
          stroke={lit ? "#78350f" : "#a8a29e"}
          strokeWidth="3" strokeLinecap="round"
          className="campfire-logs"
        />
        <line
          x1="28" y1="24" x2="4" y2="18"
          stroke={lit ? "#78350f" : "#a8a29e"}
          strokeWidth="3" strokeLinecap="round"
          className="campfire-logs"
        />
        {/* Outer flame */}
        <path
          d="M16 4 C16 4, 8 14, 10 18 C10 20, 14 22, 16 19 C18 22, 22 20, 22 18 C24 14, 16 4, 16 4Z"
          fill="#f59e0b"
          stroke="#dc2626"
          strokeWidth="1"
          className={`campfire-flame ${lit ? "lit" : ""}`}
        />
        {/* Inner flame */}
        <path
          d="M16 10 C16 10, 13 15, 14 17 C14 18, 16 17, 16 17 C16 17, 18 18, 18 17 C19 15, 16 10, 16 10Z"
          fill="#fbbf24"
          className={`campfire-flame campfire-flame-inner ${lit ? "lit" : ""}`}
        />
        {/* Smoke wisps when unlit */}
        {!lit && (
          <>
            <line x1="14" y1="8" x2="13" y2="2" stroke="#a8a29e" strokeWidth="1" opacity="0.3" strokeLinecap="round" />
            <line x1="18" y1="6" x2="19" y2="1" stroke="#a8a29e" strokeWidth="1" opacity="0.2" strokeLinecap="round" />
          </>
        )}
      </g>

      {/* Decorative cactus between waypoints 1 & 2 */}
      <g transform="translate(640, 420)" opacity="0.25">
        <line x1="8" y1="0" x2="8" y2="30" stroke="#15803d" strokeWidth="3" strokeLinecap="round" />
        <path d="M8 10 C0 10, 0 5, 0 0" stroke="#15803d" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M8 14 C16 14, 16 8, 16 4" stroke="#15803d" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      </g>

      {/* Decorative cactus between waypoints 3 & 4 */}
      <g transform="translate(630, 980)" opacity="0.25">
        <line x1="8" y1="0" x2="8" y2="25" stroke="#15803d" strokeWidth="3" strokeLinecap="round" />
        <path d="M8 8 C0 8, 0 3, 0 0" stroke="#15803d" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M8 12 C14 12, 14 7, 14 3" stroke="#15803d" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      </g>

      {/* Tumbleweed between waypoints 1 & 2 */}
      <circle cx="170" cy="500" r="10" stroke="#a8a29e" strokeWidth="1.5" fill="none" opacity="0.2" />
      <circle cx="170" cy="500" r="6" stroke="#a8a29e" strokeWidth="1" fill="none" opacity="0.15" />

      {/* Small rocks between waypoints 3 & 4 */}
      <ellipse cx="180" cy="1060" rx="8" ry="4" fill="#a8a29e" opacity="0.2" />
      <ellipse cx="195" cy="1064" rx="5" ry="3" fill="#a8a29e" opacity="0.15" />
    </svg>
  );
}
