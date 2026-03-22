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
    "M 400 105",
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
      overflow="visible"
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

      {/* Start marker  -  campfire (large, detailed) */}
      <g transform="translate(360, 30)">
        {/* Glow behind flame */}
        <circle
          cx="40"
          cy="30"
          r="45"
          fill="#f59e0b"
          className={`campfire-glow ${lit ? "lit" : ""}`}
          style={{ filter: "blur(14px)" }}
        />

        {/* Stone ring */}
        <ellipse cx="14" cy="62" rx="7" ry="4" fill="#78716c" opacity="0.6" />
        <ellipse cx="26" cy="66" rx="6" ry="4" fill="#6b7280" opacity="0.5" />
        <ellipse cx="40" cy="68" rx="7" ry="3.5" fill="#78716c" opacity="0.55" />
        <ellipse cx="54" cy="66" rx="6" ry="4" fill="#6b7280" opacity="0.5" />
        <ellipse cx="66" cy="62" rx="7" ry="4" fill="#78716c" opacity="0.6" />

        {/* Logs - gray when unlit, brown when lit */}
        <line
          x1="8" y1="58" x2="72" y2="50"
          stroke={lit ? "#78350f" : "#a8a29e"}
          strokeWidth="6" strokeLinecap="round"
          className="campfire-logs"
        />
        <line
          x1="72" y1="58" x2="8" y2="50"
          stroke={lit ? "#78350f" : "#a8a29e"}
          strokeWidth="6" strokeLinecap="round"
          className="campfire-logs"
        />
        <line
          x1="20" y1="60" x2="60" y2="52"
          stroke={lit ? "#92400e" : "#9ca3af"}
          strokeWidth="5" strokeLinecap="round"
          className="campfire-logs"
        />

        {/* Outer flame (large, red-orange) */}
        <path
          d="M40 4 C40 4, 18 26, 22 42 C24 48, 32 52, 36 44 C38 48, 42 48, 44 44 C48 52, 56 48, 58 42 C62 26, 40 4, 40 4Z"
          fill="#dc2626"
          opacity="0.8"
          className={`campfire-flame ${lit ? "lit" : ""}`}
        />
        {/* Middle flame (amber) */}
        <path
          d="M40 12 C40 12, 24 30, 27 40 C28 44, 34 46, 37 40 C39 44, 41 44, 43 40 C46 46, 52 44, 53 40 C56 30, 40 12, 40 12Z"
          fill="#f59e0b"
          className={`campfire-flame ${lit ? "lit" : ""}`}
        />
        {/* Inner flame (bright yellow) */}
        <path
          d="M40 22 C40 22, 32 34, 34 40 C35 42, 38 41, 40 38 C42 41, 45 42, 46 40 C48 34, 40 22, 40 22Z"
          fill="#fbbf24"
          className={`campfire-flame campfire-flame-inner ${lit ? "lit" : ""}`}
        />

        {/* Sparks (only when lit) */}
        {lit && (
          <>
            <circle cx="32" cy="8" r="1.5" fill="#f59e0b" className="campfire-spark" opacity="0.7" />
            <circle cx="48" cy="6" r="1.2" fill="#fbbf24" className="campfire-spark" opacity="0.6" />
            <circle cx="38" cy="2" r="1" fill="#f59e0b" className="campfire-spark" opacity="0.5" />
            <circle cx="44" cy="10" r="1.3" fill="#fbbf24" className="campfire-spark" opacity="0.6" />
          </>
        )}

        {/* Smoke wisps when unlit */}
        {!lit && (
          <>
            <path d="M36 30 C34 22, 38 18, 35 10" stroke="#a8a29e" strokeWidth="1.5" fill="none" opacity="0.25" strokeLinecap="round" />
            <path d="M44 28 C46 20, 42 16, 45 8" stroke="#a8a29e" strokeWidth="1.5" fill="none" opacity="0.2" strokeLinecap="round" />
            <path d="M40 26 C39 18, 41 14, 40 6" stroke="#a8a29e" strokeWidth="1" fill="none" opacity="0.15" strokeLinecap="round" />
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
