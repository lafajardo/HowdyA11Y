import type { ChallengeDefinition } from "../types";

export const screenReaderView: ChallengeDefinition = {
  slug: "screen-reader-experience",
  title: "The Blind Scout",
  principle: "experience",
  wcagRef: {
    criterion: "1.1.1",
    title: "Non-text Content",
    level: "A",
    url: "https://www.w3.org/WAI/WCAG21/Understanding/non-text-content.html",
  },
  difficulty: "intermediate",
  mode: "experience",
  maxScore: 100,
  description:
    "See and hear what a screen reader encounters on a poorly-built web page. Side-by-side, compare what sighted users see versus what screen reader users hear — and discover how much information gets lost.",
  realWorldImpact:
    "Screen readers convert web content into speech or braille. When images lack alt text, buttons have no labels, and landmarks are missing, screen reader users encounter a confusing jumble of 'image, image, button, button' with no context.",
  instructions:
    "View the page side-by-side: the visual layout on the left, the screen reader output on the right. Click 'Read Aloud' to hear what a screen reader would announce. Then answer the quiz questions about what information is lost.",
  disclaimer:
    "This is a simplified simulation of screen reader output. Real screen readers (JAWS, NVDA, VoiceOver) have more sophisticated behavior and different announcement patterns. This approximation highlights common accessibility gaps.",
  experienceType: "screen-reader",
  phases: [
    {
      id: "phase-sr-broken",
      title: "What the Screen Reader Hears",
      description:
        "The left side shows a product page as sighted users see it. The right side shows what a screen reader would announce. Click 'Read Aloud' to hear it. Notice what information is missing.",
      simulation: {
        type: "screen-reader",
        effect: "screen-reader-view",
        targetHTML: `<div style="font-family:system-ui,sans-serif;padding:1.5rem;max-width:500px;">
  <div style="display:flex;justify-content:space-between;padding:0.5rem 0;border-bottom:1px solid #eee;margin-bottom:1rem;">
    <div style="font-weight:bold;font-size:1.1rem;">TrailGear Co.</div>
    <div>
      <a href="/home">Home</a> |
      <a href="/products">Products</a> |
      <a href="/cart">Cart (3)</a>
    </div>
  </div>

  <img src="/boots-hero.jpg" width="100%" style="border-radius:8px;background:#ddd;height:200px;">

  <h1 style="margin-top:1rem;">Premium Trail Boots</h1>
  <p style="color:#666;">Handcrafted leather boots built for the toughest frontier trails. Waterproof, durable, comfortable.</p>

  <div style="font-size:1.5rem;font-weight:bold;color:#92400e;margin:0.75rem 0;">$149.99</div>

  <div style="display:flex;gap:0.5rem;margin-bottom:1rem;">
    <div onclick="alert('Added to cart')" style="background:#92400e;color:white;padding:0.75rem 1.5rem;border-radius:4px;cursor:pointer;font-weight:600;">Add to Cart</div>
    <div onclick="alert('Added to wishlist')" style="background:#eee;padding:0.75rem 1.5rem;border-radius:4px;cursor:pointer;">&#9829;</div>
  </div>

  <img src="/size-chart.png" width="100%" style="background:#f5f5f5;height:100px;border-radius:4px;">

  <div style="margin-top:1rem;">
    <div style="font-weight:bold;margin-bottom:0.5rem;">Customer Reviews</div>
    <div style="color:#f59e0b;">&#9733;&#9733;&#9733;&#9733;&#9734;</div>
    <p style="font-size:0.875rem;color:#666;">"Best boots I have ever owned. Worth every penny." - Jane D.</p>
  </div>
</div>`,
      },
      tasks: [
        {
          id: "sr-missing-alt",
          instruction:
            "How many images on this page are missing alt text (shown as '[image - no description]' in the screen reader output)?",
          type: "text-match",
          params: { answer: "2" },
        },
        {
          id: "sr-div-buttons",
          instruction:
            "The 'Add to Cart' and wishlist heart are <div> elements. What does the screen reader announce for the heart button?",
          type: "quiz",
          params: {
            options: [
              "Button: Add to wishlist",
              "Heart icon",
              "It is not announced at all because it is a div",
              "Link: wishlist",
            ],
            correctAnswer:
              "It is not announced at all because it is a div",
          },
        },
        {
          id: "sr-no-landmarks",
          instruction:
            "Does the screen reader output show any navigation landmarks?",
          type: "quiz",
          params: {
            options: [
              "Yes, there is a Navigation landmark",
              "No, there are no landmarks because the page uses divs instead of semantic HTML",
              "Yes, there is a Main landmark",
            ],
            correctAnswer:
              "No, there are no landmarks because the page uses divs instead of semantic HTML",
          },
        },
      ],
      revealAfterComplete:
        "Key issues found: (1) Two images have no alt text — screen readers say '[image - no description]' giving zero context about the product photo or size chart. (2) Interactive divs with onclick are invisible to screen readers — the heart/wishlist button is completely lost. (3) No semantic landmarks (<nav>, <main>) means screen reader users cannot quickly jump to sections. The fix: add alt text to images, use <button> for interactive elements, and use semantic HTML for page structure.",
    },
  ],
  validationRules: [
    {
      id: "all-tasks-complete",
      type: "task-completion",
      description: "Complete all screen reader experience tasks",
      params: {
        requiredTasks: ["sr-missing-alt", "sr-div-buttons", "sr-no-landmarks"],
      },
    },
  ],
  hints: [
    {
      text: "Look at the right panel (screen reader output) for entries highlighted in red — those indicate accessibility issues.",
      scorePenalty: 10,
    },
    {
      text: "Count the entries that say '[image - no description]' in the screen reader output. There is one for the hero product image and one for the size chart.",
      scorePenalty: 15,
    },
  ],
  order: 4,
};
