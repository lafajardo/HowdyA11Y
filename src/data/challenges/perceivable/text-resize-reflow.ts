import type { ChallengeDefinition } from "../types";

export const textResizeReflow: ChallengeDefinition = {
  slug: "text-resize-reflow",
  title: "Fix Text Resize and Reflow",
  principle: "perceivable",
  wcagRef: {
    criterion: "1.4.4",
    title: "Resize Text",
    level: "AA",
    url: "https://www.w3.org/WAI/WCAG21/Understanding/resize-text.html",
  },
  difficulty: "intermediate",
  mode: "ui-controls",
  maxScore: 100,
  description:
    "This page uses fixed pixel sizes for text and containers. When users zoom or increase text size, content overflows and becomes unreadable. Fix the units to allow proper reflow.",
  realWorldImpact:
    "Many users with low vision rely on browser zoom or increased text size to read web content. If text is locked in pixel sizes or containers don't reflow, zooming causes overlapping text, horizontal scrolling, or cut-off content.",
  instructions:
    "Switch from fixed pixel units to relative units (rem/em) for font sizes, and use flexible containers that reflow properly. Adjust the settings until text can resize up to 200% without breaking the layout.",
  controls: [
    {
      id: "fontUnit",
      type: "dropdown",
      label: "Font Size Unit",
      description: "The CSS unit used for font sizes",
      initialValue: "px",
      options: [
        { label: "Pixels (px) - Fixed", value: "px" },
        { label: "Rem - Relative to root", value: "rem" },
        { label: "Em - Relative to parent", value: "em" },
      ],
    },
    {
      id: "containerUnit",
      type: "dropdown",
      label: "Container Width",
      description: "How the content container width is defined",
      initialValue: "fixed",
      options: [
        { label: "Fixed (800px)", value: "fixed" },
        { label: "Max-width with percentage", value: "flexible" },
        { label: "Ch-based (max 70ch)", value: "ch" },
      ],
    },
    {
      id: "textZoom",
      type: "slider",
      label: "Simulate Text Zoom",
      description: "Preview how the page looks at different zoom levels",
      initialValue: 100,
      min: 100,
      max: 200,
      step: 25,
    },
  ],
  renderPreview: (values) => {
    const zoom = Number(values.textZoom) / 100;
    const unit = values.fontUnit;
    const fontSize = unit === "px" ? `${16 * zoom}px` : unit === "rem" ? `${zoom}rem` : `${zoom}em`;
    const headingSize = unit === "px" ? `${24 * zoom}px` : unit === "rem" ? `${1.5 * zoom}rem` : `${1.5 * zoom}em`;
    const containerStyle = values.containerUnit === "fixed"
      ? "width:800px;"
      : values.containerUnit === "flexible"
        ? "max-width:100%;width:100%;"
        : "max-width:70ch;width:100%;";

    return `
      <div style="font-family:system-ui,sans-serif;padding:1rem;overflow:auto;">
        <div style="${containerStyle}">
          <h2 style="font-size:${headingSize};margin-bottom:0.5rem;">Article Title</h2>
          <p style="font-size:${fontSize};line-height:1.6;margin-bottom:0.75rem;">
            This paragraph demonstrates how text behaves when zoomed. With fixed pixel sizes,
            text cannot grow when users need larger text. With relative units like rem or em,
            the text scales naturally with user preferences.
          </p>
          <p style="font-size:${fontSize};line-height:1.6;">
            Content should reflow to fit the viewport rather than requiring horizontal scrolling.
            Flexible containers ensure content remains readable at any zoom level.
          </p>
        </div>
      </div>
    `;
  },
  validationRules: [
    {
      id: "relative-font-unit",
      type: "custom",
      description: "Font sizes must use relative units (rem or em), not fixed pixels",
      params: {
        controlId: "fontUnit",
        expectedValues: ["rem", "em"],
      },
    },
    {
      id: "flexible-container",
      type: "custom",
      description: "Containers must use flexible widths that allow reflow",
      params: {
        controlId: "containerUnit",
        expectedValues: ["flexible", "ch"],
      },
    },
  ],
  hints: [
    {
      text: "The 'rem' unit is relative to the root font size, making it scale with user settings.",
      scorePenalty: 10,
    },
    {
      text: "Fixed-width containers (like width: 800px) prevent content from reflowing when text grows.",
      scorePenalty: 15,
    },
    {
      text: "Use rem/em for fonts and max-width (not fixed width) for containers. Try sliding the zoom to 200% to verify.",
      scorePenalty: 25,
    },
  ],
  order: 5,
};
