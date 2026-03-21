import type { ChallengeDefinition } from "../types";

export const keyboardOnly: ChallengeDefinition = {
  slug: "keyboard-only-experience",
  title: "No Horse, Just Boots",
  principle: "experience",
  wcagRef: {
    criterion: "2.1.1",
    title: "Keyboard",
    level: "A",
    url: "https://www.w3.org/WAI/WCAG21/Understanding/keyboard.html",
  },
  difficulty: "intermediate",
  mode: "experience",
  maxScore: 100,
  description:
    "Your mouse just broke on the trail. Navigate a poorly-built form using only your keyboard and discover how frustrating inaccessible interfaces can be.",
  realWorldImpact:
    "Many users cannot use a mouse: people with motor disabilities, tremors, paralysis, or temporary injuries. Power users and screen reader users also rely on keyboard navigation. If interactive elements are not keyboard accessible, these users are locked out.",
  instructions:
    "Your mouse is disabled. Use Tab to move between elements, Enter/Space to activate buttons, and try to fill out and submit the form. You will discover how div-based buttons, missing focus indicators, and poor tab order create barriers.",
  disclaimer:
    "This simulation disables mouse interaction to approximate the experience of keyboard-only navigation. Many users navigate the web this way every day — not by choice, but by necessity.",
  experienceType: "motor",
  phases: [
    {
      id: "phase-broken",
      title: "Keyboard Only: The Broken Form",
      description:
        "Your mouse is disabled. Try to navigate this form using only your keyboard (Tab, Shift+Tab, Enter, Space). Notice what is broken.",
      simulation: {
        type: "motor",
        effect: "no-mouse",
        targetHTML: `<div style="padding:2rem;font-family:system-ui,sans-serif;max-width:400px;">
          <h2 style="font-size:1.25rem;font-weight:bold;margin-bottom:1rem;">Trail Registration</h2>
          <form onsubmit="return false;">
            <div style="margin-bottom:1rem;">
              <div style="font-size:0.875rem;color:#666;margin-bottom:0.25rem;">Your Name</div>
              <input type="text" style="width:100%;padding:0.5rem;border:1px solid #ddd;border-radius:4px;outline:none;box-sizing:border-box;" placeholder="Enter name">
            </div>
            <div style="margin-bottom:1rem;">
              <div style="font-size:0.875rem;color:#666;margin-bottom:0.25rem;">Email</div>
              <input type="email" style="width:100%;padding:0.5rem;border:1px solid #ddd;border-radius:4px;outline:none;box-sizing:border-box;" placeholder="Enter email">
            </div>
            <div style="margin-bottom:1rem;">
              <div style="font-size:0.875rem;color:#666;margin-bottom:0.25rem;">Trail Difficulty</div>
              <div style="display:flex;gap:0.5rem;">
                <div onclick="this.style.background='#92400e';this.style.color='white'" style="padding:0.5rem 1rem;border:1px solid #ddd;border-radius:4px;cursor:pointer;font-size:0.875rem;">Easy</div>
                <div onclick="this.style.background='#92400e';this.style.color='white'" style="padding:0.5rem 1rem;border:1px solid #ddd;border-radius:4px;cursor:pointer;font-size:0.875rem;">Medium</div>
                <div onclick="this.style.background='#92400e';this.style.color='white'" style="padding:0.5rem 1rem;border:1px solid #ddd;border-radius:4px;cursor:pointer;font-size:0.875rem;">Hard</div>
              </div>
            </div>
            <div style="margin-bottom:1rem;">
              <label style="display:flex;align-items:center;gap:0.5rem;font-size:0.875rem;cursor:pointer;">
                <input type="checkbox"> I agree to the trail rules
              </label>
            </div>
            <div onclick="alert('Form submitted!')" style="background:#92400e;color:white;padding:0.75rem;text-align:center;border-radius:4px;cursor:pointer;font-weight:600;">Submit Registration</div>
          </form>
        </div>`,
      },
      tasks: [
        {
          id: "notice-no-focus",
          instruction:
            "Try tabbing through the form. Did you notice that focus indicators are invisible (outline:none)?",
          type: "confirmation",
          params: {},
        },
        {
          id: "notice-div-buttons",
          instruction:
            "Try to select a trail difficulty (Easy/Medium/Hard) using only keyboard. Could you activate them?",
          type: "quiz",
          params: {
            options: [
              "Yes, they worked with Enter/Space",
              "No, I could not focus or activate them",
              "I could focus them but not activate",
            ],
            correctAnswer: "No, I could not focus or activate them",
          },
        },
        {
          id: "notice-submit",
          instruction:
            "Try to submit the form using keyboard. The Submit button is a <div>, not a <button>. Could you activate it?",
          type: "quiz",
          params: {
            options: [
              "Yes, it worked fine",
              "No, Tab skipped right over it",
              "I could see it but not click it",
            ],
            correctAnswer: "No, Tab skipped right over it",
          },
        },
      ],
      revealAfterComplete:
        "Three major keyboard barriers in this form: (1) outline:none removes all focus indicators — you cannot tell where you are. (2) The difficulty options are <div> elements with onclick — they are not focusable or keyboard-activatable. (3) The submit button is also a <div> — Tab skips it entirely. Use <button> elements, keep visible focus styles, and never use outline:none without a replacement.",
    },
  ],
  validationRules: [
    {
      id: "all-tasks-complete",
      type: "task-completion",
      description: "Complete all keyboard navigation experience tasks",
      params: {
        requiredTasks: [
          "notice-no-focus",
          "notice-div-buttons",
          "notice-submit",
        ],
      },
    },
  ],
  hints: [
    {
      text: "Press Tab repeatedly to move through the form elements. Notice where focus goes and where it does not.",
      scorePenalty: 10,
    },
    {
      text: "The difficulty options and submit button are <div> elements, not <button> elements. Divs are not part of the tab order and cannot be activated with keyboard.",
      scorePenalty: 20,
    },
  ],
  order: 3,
};
