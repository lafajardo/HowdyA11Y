import type { ChallengeDefinition } from "../types";

export const colorBlindness: ChallengeDefinition = {
  slug: "color-blindness-experience",
  title: "The Color Rustler",
  principle: "experience",
  wcagRef: {
    criterion: "1.4.1",
    title: "Use of Color",
    level: "A",
    url: "https://www.w3.org/WAI/WCAG21/Understanding/use-of-color.html",
  },
  difficulty: "beginner",
  mode: "experience",
  maxScore: 100,
  description:
    "See the web through the eyes of someone with red-green color blindness. A status dashboard uses only color to indicate problems — can you tell what is broken?",
  realWorldImpact:
    "About 8% of men and 0.5% of women have some form of color vision deficiency. When websites use color alone to convey meaning (red for error, green for success), these users miss critical information.",
  instructions:
    "View the server dashboard through a protanopia (red-green color blindness) filter. Try to identify which servers have problems, then answer the questions.",
  disclaimer:
    "This simulation uses a color matrix filter to approximate protanopia (a form of red-green color blindness). Actual color vision deficiency varies between individuals and this is only an approximation.",
  experienceType: "visual",
  phases: [
    {
      id: "phase-colorblind",
      title: "Color-Blind Dashboard",
      description:
        "This server dashboard uses red/green/yellow colors to show status. With the protanopia filter active, can you tell which servers have issues?",
      simulation: {
        type: "visual",
        effect: "protanopia",
        intensity: 1,
        targetHTML: `<div style="padding:1.5rem;font-family:system-ui,sans-serif;background:#f9fafb;">
          <h2 style="font-size:1.25rem;font-weight:bold;margin-bottom:1rem;color:#111;">Server Status Dashboard</h2>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;">
            <div style="padding:1rem;border-radius:8px;background:#dcfce7;border:2px solid #22c55e;">
              <div style="font-weight:600;color:#111;">Web Server</div>
              <div style="color:#22c55e;font-size:0.875rem;">&#9679; Online</div>
            </div>
            <div style="padding:1rem;border-radius:8px;background:#fee2e2;border:2px solid #ef4444;">
              <div style="font-weight:600;color:#111;">Database</div>
              <div style="color:#ef4444;font-size:0.875rem;">&#9679; Down</div>
            </div>
            <div style="padding:1rem;border-radius:8px;background:#fef9c3;border:2px solid #eab308;">
              <div style="font-weight:600;color:#111;">Cache Server</div>
              <div style="color:#eab308;font-size:0.875rem;">&#9679; Degraded</div>
            </div>
            <div style="padding:1rem;border-radius:8px;background:#dcfce7;border:2px solid #22c55e;">
              <div style="font-weight:600;color:#111;">API Gateway</div>
              <div style="color:#22c55e;font-size:0.875rem;">&#9679; Online</div>
            </div>
            <div style="padding:1rem;border-radius:8px;background:#fee2e2;border:2px solid #ef4444;">
              <div style="font-weight:600;color:#111;">Email Service</div>
              <div style="color:#ef4444;font-size:0.875rem;">&#9679; Down</div>
            </div>
            <div style="padding:1rem;border-radius:8px;background:#dcfce7;border:2px solid #22c55e;">
              <div style="font-weight:600;color:#111;">CDN</div>
              <div style="color:#22c55e;font-size:0.875rem;">&#9679; Online</div>
            </div>
          </div>
        </div>`,
      },
      tasks: [
        {
          id: "count-down",
          instruction:
            "How many servers are DOWN? (Hint: It is hard to tell when red and green look the same)",
          type: "text-match",
          params: { answer: "2" },
        },
        {
          id: "identify-issue",
          instruction: "Which of these is a problem with this dashboard?",
          type: "quiz",
          params: {
            options: [
              "The fonts are too small",
              "Color is the only way to tell server status",
              "The layout has too many columns",
              "The headings are missing",
            ],
            correctAnswer: "Color is the only way to tell server status",
          },
        },
      ],
      revealAfterComplete:
        "With the protanopia filter, the red (down) and green (online) backgrounds look nearly identical. The status text also relies on color. This is why WCAG 1.4.1 requires that color is NEVER the sole means of conveying information. Icons (checkmarks, X marks, warning triangles) and text labels (Online, Down, Degraded) must supplement color.",
    },
    {
      id: "phase-fixed",
      title: "Status Made Clear",
      description:
        "Now see the same dashboard with proper non-color indicators added. The protanopia filter is still active — but now you can tell exactly what is going on.",
      simulation: {
        type: "visual",
        effect: "protanopia",
        intensity: 1,
        targetHTML: `<div style="padding:1.5rem;font-family:system-ui,sans-serif;background:#f9fafb;">
          <h2 style="font-size:1.25rem;font-weight:bold;margin-bottom:1rem;color:#111;">Server Status Dashboard</h2>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;">
            <div style="padding:1rem;border-radius:8px;background:#dcfce7;border:2px solid #22c55e;">
              <div style="font-weight:600;color:#111;">Web Server</div>
              <div style="font-size:0.875rem;color:#111;display:flex;align-items:center;gap:0.25rem;">&#10003; Online</div>
            </div>
            <div style="padding:1rem;border-radius:8px;background:#fee2e2;border:2px solid #ef4444;">
              <div style="font-weight:600;color:#111;">Database</div>
              <div style="font-size:0.875rem;color:#111;display:flex;align-items:center;gap:0.25rem;">&#10007; DOWN</div>
            </div>
            <div style="padding:1rem;border-radius:8px;background:#fef9c3;border:2px solid #eab308;">
              <div style="font-weight:600;color:#111;">Cache Server</div>
              <div style="font-size:0.875rem;color:#111;display:flex;align-items:center;gap:0.25rem;">&#9888; Degraded</div>
            </div>
            <div style="padding:1rem;border-radius:8px;background:#dcfce7;border:2px solid #22c55e;">
              <div style="font-weight:600;color:#111;">API Gateway</div>
              <div style="font-size:0.875rem;color:#111;display:flex;align-items:center;gap:0.25rem;">&#10003; Online</div>
            </div>
            <div style="padding:1rem;border-radius:8px;background:#fee2e2;border:2px solid #ef4444;">
              <div style="font-weight:600;color:#111;">Email Service</div>
              <div style="font-size:0.875rem;color:#111;display:flex;align-items:center;gap:0.25rem;">&#10007; DOWN</div>
            </div>
            <div style="padding:1rem;border-radius:8px;background:#dcfce7;border:2px solid #22c55e;">
              <div style="font-weight:600;color:#111;">CDN</div>
              <div style="font-size:0.875rem;color:#111;display:flex;align-items:center;gap:0.25rem;">&#10003; Online</div>
            </div>
          </div>
        </div>`,
      },
      tasks: [
        {
          id: "confirm-fixed",
          instruction:
            "Can you now clearly identify which servers are down, even with the color filter still active?",
          type: "confirmation",
          params: {},
        },
      ],
      revealAfterComplete:
        "By adding text labels (Online, DOWN, Degraded) and symbols (checkmark, X, warning), the status is clear regardless of color perception. Icons and text work for everyone: color blind users, screen reader users, users printing in grayscale, and users in bright sunlight.",
    },
  ],
  validationRules: [
    {
      id: "all-tasks-complete",
      type: "task-completion",
      description: "Complete all experience tasks",
      params: {
        requiredTasks: ["count-down", "identify-issue", "confirm-fixed"],
      },
    },
  ],
  hints: [
    {
      text: "With protanopia, reds and greens appear as similar brownish-yellow tones. The status dots all look the same color.",
      scorePenalty: 10,
    },
    {
      text: "Two servers are DOWN: Database and Email Service. The colors are nearly indistinguishable from the green 'Online' servers.",
      scorePenalty: 20,
    },
  ],
  order: 2,
};
