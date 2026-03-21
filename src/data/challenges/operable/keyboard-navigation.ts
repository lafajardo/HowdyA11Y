import type { ChallengeDefinition } from "../types";

export const keyboardNavigation: ChallengeDefinition = {
  slug: "keyboard-navigation",
  title: "Fix Keyboard Navigation",
  principle: "operable",
  wcagRef: {
    criterion: "2.4.7",
    title: "Focus Visible",
    level: "AA",
    url: "https://www.w3.org/WAI/WCAG21/Understanding/focus-visible.html",
  },
  difficulty: "intermediate",
  mode: "code-editor",
  maxScore: 100,
  description:
    "This navigation menu uses <div> elements styled as buttons but they cannot be reached or activated with a keyboard. Users who cannot use a mouse are stuck. Fix the HTML to make all interactive elements keyboard accessible.",
  realWorldImpact:
    "Many users rely on keyboard navigation: people with motor disabilities, power users, screen reader users, and those with temporary injuries. If interactive elements are not keyboard accessible, these users are completely locked out.",
  instructions:
    "Replace the `<div>` click handlers with proper semantic `<button>` or `<a>` elements. Ensure all interactive elements are focusable and have visible focus indicators. Add appropriate `outline` styles for `:focus-visible`.",
  initialCode: `<style>
  .nav-menu { display: flex; gap: 0.5rem; padding: 1rem; }
  .nav-item {
    padding: 0.75rem 1.5rem;
    background: #1a56db;
    color: white;
    border-radius: 0.5rem;
    cursor: pointer;
    font-size: 1rem;
    outline: none;
  }
  .nav-item:hover { background: #1e40af; }
  .card {
    padding: 1.5rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    margin: 1rem;
  }
  .card-action {
    color: #1a56db;
    cursor: pointer;
    margin-top: 0.75rem;
    display: inline-block;
  }
</style>

<nav class="nav-menu">
  <div class="nav-item" onclick="alert('Home')">Home</div>
  <div class="nav-item" onclick="alert('Products')">Products</div>
  <div class="nav-item" onclick="alert('Contact')">Contact</div>
</nav>

<div class="card">
  <h2>Featured Product</h2>
  <p>Check out our latest wireless headphones with premium sound quality.</p>
  <div class="card-action" onclick="alert('View details')">View Details</div>
</div>`,
  solutionCode: `<style>
  .nav-menu { display: flex; gap: 0.5rem; padding: 1rem; }
  .nav-item {
    padding: 0.75rem 1.5rem;
    background: #1a56db;
    color: white;
    border-radius: 0.5rem;
    cursor: pointer;
    font-size: 1rem;
    border: none;
    font-family: inherit;
  }
  .nav-item:hover { background: #1e40af; }
  .nav-item:focus-visible {
    outline: 3px solid #1a56db;
    outline-offset: 2px;
  }
  .card {
    padding: 1.5rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    margin: 1rem;
  }
  .card-action {
    color: #1a56db;
    cursor: pointer;
    margin-top: 0.75rem;
    display: inline-block;
    background: none;
    border: none;
    font-size: inherit;
    font-family: inherit;
    padding: 0;
    text-decoration: underline;
  }
  .card-action:focus-visible {
    outline: 3px solid #1a56db;
    outline-offset: 2px;
  }
</style>

<nav class="nav-menu">
  <button class="nav-item" onclick="alert('Home')">Home</button>
  <button class="nav-item" onclick="alert('Products')">Products</button>
  <button class="nav-item" onclick="alert('Contact')">Contact</button>
</nav>

<div class="card">
  <h2>Featured Product</h2>
  <p>Check out our latest wireless headphones with premium sound quality.</p>
  <button class="card-action" onclick="alert('View details')">View Details</button>
</div>`,
  validationRules: [
    {
      id: "no-div-onclick",
      type: "custom",
      description:
        "Interactive elements must not be <div> elements with onclick handlers. Use <button> or <a> instead.",
      params: {
        check: "no-div-onclick",
      },
    },
    {
      id: "focus-visible-styles",
      type: "custom",
      description: "Interactive elements must have visible focus styles (focus-visible in CSS)",
      params: {
        check: "has-focus-visible",
      },
    },
  ],
  hints: [
    {
      text: "<div> elements are not focusable or activatable by keyboard by default. Semantic HTML elements like <button> and <a> are.",
      scorePenalty: 10,
    },
    {
      text: "Replace <div class=\"nav-item\" onclick=\"...\"> with <button class=\"nav-item\" onclick=\"...\">. The button element is keyboard accessible by default.",
      scorePenalty: 15,
    },
    {
      text: "Add :focus-visible styles with outline to make focus visible. Never use outline:none without a replacement focus indicator.",
      scorePenalty: 25,
    },
  ],
  order: 1,
};
