import type { ChallengeDefinition } from "../types";

export const missingCaptions: ChallengeDefinition = {
  slug: "missing-captions",
  title: "Add Video Captions",
  principle: "perceivable",
  wcagRef: {
    criterion: "1.2.2",
    title: "Captions (Prerecorded)",
    level: "A",
    url: "https://www.w3.org/WAI/WCAG21/Understanding/captions-prerecorded.html",
  },
  difficulty: "beginner",
  mode: "ui-controls",
  maxScore: 100,
  description:
    "This page has a video tutorial without captions or a transcript. Deaf and hard-of-hearing users cannot access the spoken content. Enable captions and add a transcript.",
  realWorldImpact:
    "About 466 million people worldwide have disabling hearing loss. Captions also benefit users in noisy environments, those watching without sound, non-native speakers, and people with cognitive disabilities who benefit from reading along.",
  instructions:
    "Toggle on the captions for the video and enable the transcript section below it. Both are needed for full accessibility compliance.",
  controls: [
    {
      id: "captionsEnabled",
      type: "toggle",
      label: "Enable Closed Captions",
      description: "Show captions on the video player",
      initialValue: false,
    },
    {
      id: "transcriptVisible",
      type: "toggle",
      label: "Show Transcript",
      description: "Display a full text transcript below the video",
      initialValue: false,
    },
  ],
  renderPreview: (values) => `
    <div style="font-family:system-ui,sans-serif;max-width:640px;margin:0 auto;padding:1rem;">
      <h2 style="font-size:1.25rem;margin-bottom:0.5rem;">Getting Started Tutorial</h2>
      <div style="position:relative;background:#000;aspect-ratio:16/9;display:flex;align-items:center;justify-content:center;border-radius:8px;overflow:hidden;">
        <div style="color:#666;font-size:3rem;">&#9654;</div>
        ${values.captionsEnabled ? `
          <div style="position:absolute;bottom:1rem;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.8);color:#fff;padding:0.25rem 0.75rem;border-radius:4px;font-size:0.875rem;white-space:nowrap;">
            [CC] "Welcome to our getting started tutorial..."
          </div>
        ` : ""}
      </div>
      ${values.transcriptVisible ? `
        <details open style="margin-top:1rem;border:1px solid #e2e8f0;border-radius:8px;padding:1rem;">
          <summary style="font-weight:600;cursor:pointer;margin-bottom:0.5rem;">Transcript</summary>
          <p style="font-size:0.875rem;color:#475569;line-height:1.6;">
            Welcome to our getting started tutorial. In this video, we will walk you through
            the basic setup process. First, navigate to the settings page by clicking the gear
            icon in the top right corner. Then, select your preferred language and region...
          </p>
        </details>
      ` : ""}
    </div>
  `,
  validationRules: [
    {
      id: "captions-on",
      type: "custom",
      description: "Closed captions must be enabled",
      params: {
        controlId: "captionsEnabled",
        expectedValue: true,
      },
    },
    {
      id: "transcript-visible",
      type: "custom",
      description: "A text transcript must be available",
      params: {
        controlId: "transcriptVisible",
        expectedValue: true,
      },
    },
  ],
  hints: [
    {
      text: "Captions provide a text version of spoken content synchronized with the video.",
      scorePenalty: 10,
    },
    {
      text: "A transcript is a separate text document that provides all audio content. Both captions AND a transcript are best practice.",
      scorePenalty: 20,
    },
  ],
  order: 3,
};
