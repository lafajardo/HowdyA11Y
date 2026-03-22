import type { ChallengeDefinition } from "../types";

export const touchTargetSize: ChallengeDefinition = {
  slug: "touch-target-size",
  title: "Fix Touch Target Sizes",
  principle: "operable",
  wcagRef: {
    criterion: "2.5.8",
    title: "Target Size (Minimum)",
    level: "AA",
    url: "https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html",
  },
  difficulty: "beginner",
  mode: "ui-controls",
  maxScore: 100,
  description:
    "This mobile interface has tiny buttons and links that are difficult to tap accurately. Users with motor disabilities, elderly users, and anyone on a mobile device struggle to hit the targets. Increase the sizes.",
  realWorldImpact:
    "Small touch targets cause frustration and errors for everyone on mobile, but especially for users with tremors, limited dexterity, or visual impairments. WCAG 2.2 requires a minimum 24x24 CSS pixel target size.",
  instructions:
    "Adjust the target sizes to meet WCAG AA requirements. The minimum target size should be at least 24x24 CSS pixels, but 44x44 pixels is the recommended best practice.",
  controls: [
    {
      id: "buttonSize",
      type: "slider",
      label: "Button Target Size (px)",
      description: "The minimum height and padding of buttons",
      initialValue: 16,
      min: 12,
      max: 48,
      step: 2,
    },
    {
      id: "linkSpacing",
      type: "slider",
      label: "Link Spacing (px)",
      description: "Spacing between inline links to prevent accidental taps",
      initialValue: 2,
      min: 0,
      max: 24,
      step: 2,
    },
    {
      id: "iconButtonSize",
      type: "slider",
      label: "Icon Button Size (px)",
      description: "The size of icon-only buttons (like, share, menu)",
      initialValue: 18,
      min: 12,
      max: 48,
      step: 2,
    },
  ],
  renderPreview: (values) => {
    const btnSize = Number(values.buttonSize);
    const spacing = Number(values.linkSpacing);
    const iconSize = Number(values.iconButtonSize);
    const meetsMinimum = btnSize >= 24 && iconSize >= 24;
    const meetsBest = btnSize >= 44 && iconSize >= 44;

    return `
      <div style="font-family:system-ui,sans-serif;padding:1rem;max-width:360px;">
        <div style="margin-bottom:1rem;padding:0.5rem;background:${meetsBest ? "#f0fdf4" : meetsMinimum ? "#fefce8" : "#fef2f2"};border-radius:4px;font-size:0.75rem;color:${meetsBest ? "#16a34a" : meetsMinimum ? "#ca8a04" : "#dc2626"};">
          Button: ${btnSize}px ${btnSize >= 44 ? "(Best practice)" : btnSize >= 24 ? "(Meets minimum)" : "(Too small!)"}<br>
          Icon: ${iconSize}px ${iconSize >= 44 ? "(Best practice)" : iconSize >= 24 ? "(Meets minimum)" : "(Too small!)"}
        </div>

        <div style="display:flex;gap:0.5rem;margin-bottom:1rem;">
          <button style="min-height:${btnSize}px;padding:4px ${btnSize / 2}px;background:#1a56db;color:white;border:none;border-radius:4px;font-size:0.75rem;cursor:pointer;">Save</button>
          <button style="min-height:${btnSize}px;padding:4px ${btnSize / 2}px;background:#e2e8f0;border:none;border-radius:4px;font-size:0.75rem;cursor:pointer;">Cancel</button>
        </div>

        <div style="display:flex;gap:${spacing}px;margin-bottom:1rem;flex-wrap:wrap;">
          <a href="#" onclick="return false" style="color:#1a56db;font-size:0.875rem;padding:${spacing}px;">Terms</a>
          <a href="#" onclick="return false" style="color:#1a56db;font-size:0.875rem;padding:${spacing}px;">Privacy</a>
          <a href="#" onclick="return false" style="color:#1a56db;font-size:0.875rem;padding:${spacing}px;">Help</a>
          <a href="#" onclick="return false" style="color:#1a56db;font-size:0.875rem;padding:${spacing}px;">Contact</a>
        </div>

        <div style="display:flex;gap:0.5rem;">
          <button style="width:${iconSize}px;height:${iconSize}px;border:1px solid #e2e8f0;border-radius:4px;background:white;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:${Math.max(10, iconSize * 0.5)}px;">&#9829;</button>
          <button style="width:${iconSize}px;height:${iconSize}px;border:1px solid #e2e8f0;border-radius:4px;background:white;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:${Math.max(10, iconSize * 0.5)}px;">&#8599;</button>
          <button style="width:${iconSize}px;height:${iconSize}px;border:1px solid #e2e8f0;border-radius:4px;background:white;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:${Math.max(10, iconSize * 0.5)}px;">&#8942;</button>
        </div>
      </div>
    `;
  },
  validationRules: [
    {
      id: "button-size",
      type: "custom",
      description: "Button targets must be at least 24px (WCAG minimum)",
      params: {
        controlId: "buttonSize",
        minimumValue: 24,
      },
    },
    {
      id: "icon-button-size",
      type: "custom",
      description: "Icon button targets must be at least 24px (WCAG minimum)",
      params: {
        controlId: "iconButtonSize",
        minimumValue: 24,
      },
    },
    {
      id: "link-spacing",
      type: "custom",
      description: "Inline links need adequate spacing to prevent accidental activation",
      params: {
        controlId: "linkSpacing",
        minimumValue: 8,
      },
    },
  ],
  hints: [
    {
      text: "WCAG 2.2 Level AA requires a minimum target size of 24x24 CSS pixels. The recommended best practice is 44x44 pixels.",
      scorePenalty: 10,
    },
    {
      text: "Don't forget about icon-only buttons  -  they often have the smallest targets and are hardest to tap.",
      scorePenalty: 15,
    },
    {
      text: "Set buttons and icon buttons to at least 24px. Links need spacing of at least 8px to prevent mis-taps.",
      scorePenalty: 25,
    },
  ],
  order: 5,
};
