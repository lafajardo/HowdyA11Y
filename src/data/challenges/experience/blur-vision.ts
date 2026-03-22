import type { ChallengeDefinition } from "../types";

export const blurVision: ChallengeDefinition = {
  slug: "blur-vision-experience",
  title: "Through the Dust Storm",
  principle: "experience",
  wcagRef: {
    criterion: "1.4.3",
    title: "Contrast (Minimum)",
    level: "AA",
    url: "https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html",
  },
  difficulty: "beginner",
  mode: "experience",
  maxScore: 100,
  description:
    "Experience what it feels like to browse the web with reduced vision. A dust storm has hit the frontier  -  can you still find what you need?",
  realWorldImpact:
    "Over 2.2 billion people worldwide have some form of vision impairment. Low contrast text combined with reduced visual acuity makes many websites nearly impossible to use.",
  instructions:
    "Navigate the blurred page and try to answer the questions. Then see how proper design choices make content readable even with reduced vision.",
  disclaimer:
    "This simulation applies a blur effect to approximate reduced visual acuity. It is a rough approximation meant to build awareness  -  it does not accurately represent any specific visual condition. Real visual impairments are diverse and personal.",
  experienceType: "visual",
  phases: [
    {
      id: "phase-blur",
      title: "Navigate the Dust Storm",
      description:
        "The page below is blurred to simulate reduced visual acuity combined with low contrast text. Try to read the content and answer the questions.",
      simulation: {
        type: "visual",
        effect: "blur",
        intensity: 0.5,
        targetHTML: `<div style="padding:2rem;font-family:system-ui,sans-serif;background:#fff;">
          <h1 style="font-size:1.1rem;color:#aaa;margin-bottom:0.5rem;">Welcome to Frontier General Store</h1>
          <p style="color:#bbb;font-size:0.85rem;line-height:1.4;margin-bottom:1rem;">Browse our latest supplies and trail provisions. Everything a cowpoke needs for the long ride.</p>
          <div style="display:flex;gap:1rem;margin-bottom:1rem;">
            <button style="background:#e0e0e0;color:#ccc;border:none;padding:8px 16px;font-size:0.8rem;border-radius:4px;">Shop Supplies</button>
            <button style="background:#e8e8e8;color:#d0d0d0;border:none;padding:8px 16px;font-size:0.8rem;border-radius:4px;">View Cart</button>
          </div>
          <p style="color:#c0c0c0;font-size:0.75rem;">Free shipping on orders over $50. Sale ends March 31, 2026.</p>
          <hr style="border:none;border-top:1px solid #eee;margin:1rem 0;">
          <p style="color:#b0b0b0;font-size:0.7rem;">Contact us: support@frontier-store.com | 1-800-555-RIDE</p>
        </div>`,
      },
      tasks: [
        {
          id: "find-store-name",
          instruction: "What is the name of the store?",
          type: "text-match",
          params: { answer: "Frontier General Store" },
        },
        {
          id: "find-shipping",
          instruction: "What is the minimum order for free shipping?",
          type: "text-match",
          params: { answer: "$50" },
        },
        {
          id: "find-phone",
          instruction: "What is the phone number?",
          type: "text-match",
          params: { answer: "1-800-555-RIDE" },
        },
      ],
      revealAfterComplete:
        "Difficult, right? Now imagine browsing every website like this. The combination of low contrast (#aaa text on #fff background = only 2.3:1 ratio) and blur makes text nearly invisible. WCAG requires at least 4.5:1 contrast ratio for normal text.",
    },
    {
      id: "phase-fixed",
      title: "The Storm Clears",
      description:
        "Now see the same page with proper contrast and larger fonts. The blur is still active  -  but notice how much easier it is to read with good design choices.",
      simulation: {
        type: "visual",
        effect: "blur",
        intensity: 0.5,
        targetHTML: `<div style="padding:2rem;font-family:system-ui,sans-serif;background:#fff;">
          <h1 style="font-size:2rem;color:#1a1a1a;font-weight:bold;margin-bottom:0.75rem;">Welcome to Frontier General Store</h1>
          <p style="color:#333;font-size:1.1rem;line-height:1.6;margin-bottom:1.25rem;">Browse our latest supplies and trail provisions. Everything a cowpoke needs for the long ride.</p>
          <div style="display:flex;gap:1rem;margin-bottom:1.25rem;">
            <button style="background:#92400e;color:#fff;border:none;padding:12px 24px;font-size:1.1rem;font-weight:bold;border-radius:6px;">Shop Supplies</button>
            <button style="background:#1a1a1a;color:#fff;border:none;padding:12px 24px;font-size:1.1rem;font-weight:bold;border-radius:6px;">View Cart</button>
          </div>
          <p style="color:#222;font-size:1rem;font-weight:600;">Free shipping on orders over $50. Sale ends March 31, 2026.</p>
          <hr style="border:none;border-top:2px solid #92400e;margin:1.25rem 0;">
          <p style="color:#333;font-size:0.95rem;">Contact us: support@frontier-store.com | 1-800-555-RIDE</p>
        </div>`,
      },
      tasks: [
        {
          id: "confirm-improvement",
          instruction:
            "Can you read this version more easily, even with the blur still active?",
          type: "confirmation",
          params: {},
        },
      ],
      revealAfterComplete:
        "Proper contrast (dark text on light background), larger font sizes, and bolder weights help users with low vision read content even in challenging conditions. These improvements help everyone  -  on sunny days, small screens, and as we all age. The fix is simple: use at least 4.5:1 contrast ratio and avoid tiny, thin fonts.",
    },
  ],
  validationRules: [
    {
      id: "all-tasks-complete",
      type: "task-completion",
      description: "Complete all experience tasks across both phases",
      params: {
        requiredTasks: [
          "find-store-name",
          "find-shipping",
          "find-phone",
          "confirm-improvement",
        ],
      },
    },
  ],
  hints: [
    {
      text: "Try squinting or leaning closer to the screen  -  that is exactly what many users with low vision do daily.",
      scorePenalty: 10,
    },
    {
      text: "The store name is the largest text at the top. Look for the heading.",
      scorePenalty: 15,
    },
  ],
  order: 1,
};
