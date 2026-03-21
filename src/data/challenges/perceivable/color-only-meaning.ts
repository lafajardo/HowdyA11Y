import type { ChallengeDefinition } from "../types";

export const colorOnlyMeaning: ChallengeDefinition = {
  slug: "color-only-meaning",
  title: "Don't Rely on Color Alone",
  principle: "perceivable",
  wcagRef: {
    criterion: "1.4.1",
    title: "Use of Color",
    level: "A",
    url: "https://www.w3.org/WAI/WCAG21/Understanding/use-of-color.html",
  },
  difficulty: "intermediate",
  mode: "ui-controls",
  maxScore: 100,
  description:
    "This form uses only color to indicate required fields (red labels) and error states (red borders). Users with color blindness cannot distinguish which fields are required or have errors.",
  realWorldImpact:
    "About 8% of men and 0.5% of women have color vision deficiency. Relying solely on color means these users miss critical information. The same issue affects users with monochrome displays or those printing in black and white.",
  instructions:
    "Enable additional visual indicators beyond color to communicate required fields and error states. Add symbols, text labels, or patterns so the meaning is clear without color.",
  controls: [
    {
      id: "showAsterisks",
      type: "toggle",
      label: "Show asterisk (*) on required fields",
      description: "Add a visible asterisk symbol next to required field labels",
      initialValue: false,
    },
    {
      id: "showErrorIcons",
      type: "toggle",
      label: "Show error icons and text",
      description: "Add error icons and descriptive text messages to invalid fields",
      initialValue: false,
    },
    {
      id: "showRequiredText",
      type: "toggle",
      label: "Show 'Required' text label",
      description: "Add the word 'Required' next to required field labels",
      initialValue: false,
    },
  ],
  renderPreview: (values) => `
    <div style="font-family:system-ui,sans-serif;padding:1.5rem;max-width:400px;">
      <h2 style="font-size:1.25rem;margin-bottom:1rem;">Contact Form</h2>
      <form onsubmit="return false">
        <div style="margin-bottom:1rem;">
          <label style="display:block;font-size:0.875rem;font-weight:600;color:#dc2626;margin-bottom:0.25rem;">
            Full Name ${values.showAsterisks ? '<span aria-hidden="true">*</span>' : ""}
            ${values.showRequiredText ? '<span style="font-size:0.75rem;font-weight:normal;color:#dc2626;"> (Required)</span>' : ""}
          </label>
          <input type="text" style="width:100%;padding:0.5rem;border:2px solid #dc2626;border-radius:4px;box-sizing:border-box;" value="">
          ${values.showErrorIcons ? '<p style="color:#dc2626;font-size:0.75rem;margin-top:0.25rem;display:flex;align-items:center;gap:0.25rem;"><span>&#9888;</span> Please enter your full name</p>' : ""}
        </div>
        <div style="margin-bottom:1rem;">
          <label style="display:block;font-size:0.875rem;font-weight:600;color:#dc2626;margin-bottom:0.25rem;">
            Email ${values.showAsterisks ? '<span aria-hidden="true">*</span>' : ""}
            ${values.showRequiredText ? '<span style="font-size:0.75rem;font-weight:normal;color:#dc2626;"> (Required)</span>' : ""}
          </label>
          <input type="email" style="width:100%;padding:0.5rem;border:2px solid #dc2626;border-radius:4px;box-sizing:border-box;" value="not-an-email">
          ${values.showErrorIcons ? '<p style="color:#dc2626;font-size:0.75rem;margin-top:0.25rem;display:flex;align-items:center;gap:0.25rem;"><span>&#9888;</span> Please enter a valid email address</p>' : ""}
        </div>
        <div style="margin-bottom:1rem;">
          <label style="display:block;font-size:0.875rem;font-weight:600;color:#475569;margin-bottom:0.25rem;">
            Message
          </label>
          <textarea style="width:100%;padding:0.5rem;border:2px solid #e2e8f0;border-radius:4px;box-sizing:border-box;" rows="3"></textarea>
        </div>
      </form>
    </div>
  `,
  validationRules: [
    {
      id: "has-non-color-indicator",
      type: "custom",
      description: "Required fields must have a non-color indicator (asterisk or text label)",
      params: {
        logic: "or",
        conditions: [
          { controlId: "showAsterisks", expectedValue: true },
          { controlId: "showRequiredText", expectedValue: true },
        ],
      },
    },
    {
      id: "has-error-text",
      type: "custom",
      description: "Error states must include text descriptions, not just color",
      params: {
        controlId: "showErrorIcons",
        expectedValue: true,
      },
    },
  ],
  hints: [
    {
      text: "Color is fine as an enhancement, but there must also be a non-color way to get the same information.",
      scorePenalty: 10,
    },
    {
      text: "Common non-color indicators for required fields include asterisks (*), bold text, or explicit '(Required)' labels.",
      scorePenalty: 15,
    },
    {
      text: "Error messages should include descriptive text explaining what went wrong, not just a red border.",
      scorePenalty: 25,
    },
  ],
  order: 4,
};
