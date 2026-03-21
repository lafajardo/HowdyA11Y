import type { ChallengeDefinition } from "../types";

export const colorContrast: ChallengeDefinition = {
  slug: "color-contrast",
  title: "Fix the Color Contrast",
  principle: "perceivable",
  wcagRef: {
    criterion: "1.4.3",
    title: "Contrast (Minimum)",
    level: "AA",
    url: "https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html",
  },
  difficulty: "beginner",
  mode: "ui-controls",
  maxScore: 100,
  description:
    "This website has light gray text on a white background. Many users with low vision cannot read it. Your job is to adjust the colors until the contrast ratio meets WCAG AA requirements.",
  realWorldImpact:
    "Approximately 1 in 12 men and 1 in 200 women have some form of color vision deficiency. Low contrast text is also difficult to read in bright sunlight, on low-quality displays, or for aging users whose contrast sensitivity naturally decreases.",
  instructions:
    "Use the color pickers below to change the text and background colors. Watch the contrast ratio update in real time. Achieve a ratio of at least **4.5:1** for normal text (WCAG AA).",
  controls: [
    {
      id: "textColor",
      type: "color-picker",
      label: "Text Color",
      description: "The color of the paragraph text",
      initialValue: "#cccccc",
    },
    {
      id: "bgColor",
      type: "color-picker",
      label: "Background Color",
      description: "The background color behind the text",
      initialValue: "#ffffff",
    },
  ],
  renderPreview: (values) => `
    <div style="background:${values.bgColor};padding:2rem;font-family:system-ui,sans-serif;">
      <h2 style="color:${values.textColor};font-size:1.5rem;margin-bottom:0.5rem;">Welcome to Our Site</h2>
      <p style="color:${values.textColor};font-size:1rem;line-height:1.6;">
        This is sample body text that demonstrates how color contrast affects readability.
        Can you read this comfortably? Good contrast ensures everyone can access your content,
        regardless of visual ability or environmental conditions.
      </p>
      <a href="#" style="color:${values.textColor};font-size:1rem;" onclick="return false">Learn more about our services</a>
    </div>
  `,
  validationRules: [
    {
      id: "contrast-check",
      type: "contrast-ratio",
      description:
        "Text must have at least 4.5:1 contrast ratio against the background",
      params: {
        foregroundControlId: "textColor",
        backgroundControlId: "bgColor",
        minimumRatio: 4.5,
      },
    },
  ],
  hints: [
    {
      text: "Dark text on a light background is usually the easiest way to achieve good contrast.",
      scorePenalty: 10,
    },
    {
      text: "Try a text color darker than #767676 on a white background.",
      scorePenalty: 15,
    },
    {
      text: 'Black (#000000) on white (#FFFFFF) gives a ratio of 21:1 — the maximum possible.',
      scorePenalty: 25,
    },
  ],
  order: 1,
};
