import type { ChallengeDefinition } from "../types";

export const timingAutoplay: ChallengeDefinition = {
  slug: "timing-autoplay",
  title: "Control Timing and Autoplay",
  principle: "operable",
  wcagRef: {
    criterion: "2.2.2",
    title: "Pause, Stop, Hide",
    level: "A",
    url: "https://www.w3.org/WAI/WCAG21/Understanding/pause-stop-hide.html",
  },
  difficulty: "beginner",
  mode: "ui-controls",
  maxScore: 100,
  description:
    "This page has an auto-rotating carousel and auto-playing background video. Users with cognitive disabilities or motion sensitivities cannot control or stop the movement. Add user controls.",
  realWorldImpact:
    "Auto-moving content is distracting for users with attention disabilities (ADHD). Auto-playing video can trigger vestibular disorders or seizures. Users with motor disabilities may not have enough time to interact with moving content before it changes.",
  instructions:
    "Add controls to pause the carousel rotation, stop the background video, and remove the auto-advance timer. Users must be able to control all moving content.",
  controls: [
    {
      id: "carouselPaused",
      type: "toggle",
      label: "Add Pause Button to Carousel",
      description: "Allow users to stop the carousel from auto-rotating",
      initialValue: false,
    },
    {
      id: "videoPaused",
      type: "toggle",
      label: "Add Stop Button for Video",
      description: "Allow users to pause/stop the auto-playing background video",
      initialValue: false,
    },
    {
      id: "respectsReducedMotion",
      type: "toggle",
      label: "Respect prefers-reduced-motion",
      description: "Stop all animations when user has requested reduced motion in OS settings",
      initialValue: false,
    },
  ],
  renderPreview: (values) => `
    <div style="font-family:system-ui,sans-serif;padding:1rem;">
      <div style="background:#f1f5f9;border-radius:8px;padding:1rem;margin-bottom:1rem;position:relative;overflow:hidden;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.5rem;">
          <h3 style="margin:0;font-size:1rem;">Featured Stories</h3>
          ${values.carouselPaused ? '<button style="background:#1a56db;color:white;border:none;padding:0.25rem 0.75rem;border-radius:4px;font-size:0.75rem;cursor:pointer;">Pause</button>' : '<span style="font-size:0.75rem;color:#dc2626;">Auto-rotating (no pause control)</span>'}
        </div>
        <div style="background:white;padding:1rem;border-radius:4px;">
          <p style="margin:0;font-size:0.875rem;">Slide 1 of 5  -  "New Product Launch Announcement"</p>
          ${!values.carouselPaused ? '<div style="font-size:0.75rem;color:#64748b;margin-top:0.25rem;">Next slide in 3 seconds...</div>' : '<div style="font-size:0.75rem;color:#16a34a;margin-top:0.25rem;">Paused  -  user controls enabled</div>'}
        </div>
      </div>
      <div style="background:#000;color:white;border-radius:8px;padding:1.5rem;position:relative;">
        <div style="font-size:0.75rem;margin-bottom:0.5rem;color:#94a3b8;">Background Video Section</div>
        <p style="margin:0 0 0.5rem;font-size:0.875rem;">Hero content with auto-playing background video</p>
        ${values.videoPaused ? '<button style="background:white;color:black;border:none;padding:0.25rem 0.75rem;border-radius:4px;font-size:0.75rem;cursor:pointer;">Pause Video</button>' : '<span style="font-size:0.75rem;color:#fca5a5;">Video auto-playing (no stop control)</span>'}
      </div>
      ${values.respectsReducedMotion ? '<div style="margin-top:0.75rem;padding:0.5rem;background:#f0fdf4;border-radius:4px;font-size:0.75rem;color:#16a34a;border:1px solid #bbf7d0;">@media (prefers-reduced-motion: reduce)  -  All animations disabled</div>' : ""}
    </div>
  `,
  validationRules: [
    {
      id: "carousel-pausable",
      type: "custom",
      description: "The carousel must have a pause control",
      params: { controlId: "carouselPaused", expectedValue: true },
    },
    {
      id: "video-stoppable",
      type: "custom",
      description: "The auto-playing video must have a stop/pause control",
      params: { controlId: "videoPaused", expectedValue: true },
    },
    {
      id: "reduced-motion",
      type: "custom",
      description: "Animations should respect prefers-reduced-motion",
      params: { controlId: "respectsReducedMotion", expectedValue: true },
    },
  ],
  hints: [
    {
      text: "Any content that moves, blinks, or auto-updates must have a mechanism to pause, stop, or hide it.",
      scorePenalty: 10,
    },
    {
      text: "The CSS media query prefers-reduced-motion lets you detect if a user has requested less motion in their OS settings.",
      scorePenalty: 15,
    },
    {
      text: "Enable all three controls. Every auto-playing element needs an individual pause control, and respect prefers-reduced-motion globally.",
      scorePenalty: 25,
    },
  ],
  order: 4,
};
