import type { ChallengeDefinition } from "../types";

export const skipNavigation: ChallengeDefinition = {
  slug: "skip-navigation",
  title: "Add Skip Navigation",
  principle: "operable",
  wcagRef: {
    criterion: "2.4.1",
    title: "Bypass Blocks",
    level: "A",
    url: "https://www.w3.org/WAI/WCAG21/Understanding/bypass-blocks.html",
  },
  difficulty: "beginner",
  mode: "code-editor",
  maxScore: 100,
  description:
    "This page has a large navigation menu with many links. Keyboard users must Tab through every navigation link before reaching the main content. Add a skip navigation link to let users jump directly to the content.",
  realWorldImpact:
    "Imagine pressing Tab 30+ times on every page just to reach the main content. For keyboard-only users, this is exhausting and time-wasting. Skip navigation links solve this by providing a shortcut to the main content area.",
  instructions:
    "Add a 'Skip to main content' link as the very first element inside `<body>`. It should link to `#main-content`. The link should be visually hidden by default but become visible when focused. Also add `id=\"main-content\"` to the `<main>` element.",
  initialCode: `<style>
  body { margin: 0; font-family: system-ui, sans-serif; }
  .header {
    background: #1e293b; color: white; padding: 1rem 2rem;
  }
  .nav-links { display: flex; gap: 1rem; flex-wrap: wrap; }
  .nav-links a {
    color: #93c5fd; text-decoration: none; padding: 0.25rem;
  }
  .main-content { padding: 2rem; }
</style>

<header class="header">
  <div style="font-size:1.25rem;font-weight:bold;margin-bottom:0.5rem;">MegaCorp Inc.</div>
  <nav class="nav-links">
    <a href="/home">Home</a>
    <a href="/about">About</a>
    <a href="/products">Products</a>
    <a href="/services">Services</a>
    <a href="/portfolio">Portfolio</a>
    <a href="/team">Our Team</a>
    <a href="/careers">Careers</a>
    <a href="/blog">Blog</a>
    <a href="/faq">FAQ</a>
    <a href="/support">Support</a>
    <a href="/contact">Contact</a>
    <a href="/login">Login</a>
  </nav>
</header>

<main class="main-content">
  <h1>Welcome to MegaCorp</h1>
  <p>This is the main content of the page that keyboard users
     must Tab through 12+ navigation links to reach.</p>
</main>`,
  solutionCode: `<style>
  body { margin: 0; font-family: system-ui, sans-serif; }
  .skip-link {
    position: absolute; left: -9999px; top: auto;
    width: 1px; height: 1px; overflow: hidden;
    z-index: 100;
  }
  .skip-link:focus {
    position: fixed; top: 0; left: 0;
    width: auto; height: auto;
    padding: 1rem 1.5rem;
    background: #1a56db; color: white;
    font-weight: 600; font-size: 1rem;
    z-index: 100;
  }
  .header {
    background: #1e293b; color: white; padding: 1rem 2rem;
  }
  .nav-links { display: flex; gap: 1rem; flex-wrap: wrap; }
  .nav-links a {
    color: #93c5fd; text-decoration: none; padding: 0.25rem;
  }
  .main-content { padding: 2rem; }
</style>

<a href="#main-content" class="skip-link">Skip to main content</a>

<header class="header">
  <div style="font-size:1.25rem;font-weight:bold;margin-bottom:0.5rem;">MegaCorp Inc.</div>
  <nav class="nav-links">
    <a href="/home">Home</a>
    <a href="/about">About</a>
    <a href="/products">Products</a>
    <a href="/services">Services</a>
    <a href="/portfolio">Portfolio</a>
    <a href="/team">Our Team</a>
    <a href="/careers">Careers</a>
    <a href="/blog">Blog</a>
    <a href="/faq">FAQ</a>
    <a href="/support">Support</a>
    <a href="/contact">Contact</a>
    <a href="/login">Login</a>
  </nav>
</header>

<main id="main-content" class="main-content">
  <h1>Welcome to MegaCorp</h1>
  <p>This is the main content of the page that keyboard users
     must Tab through 12+ navigation links to reach.</p>
</main>`,
  validationRules: [
    {
      id: "has-skip-link",
      type: "custom",
      description: "Page must have a skip navigation link targeting #main-content",
      params: {
        check: "has-skip-link",
      },
    },
    {
      id: "main-has-id",
      type: "html-attribute",
      description: "The <main> element must have id=\"main-content\"",
      params: {
        selector: "main",
        attribute: "id",
        expectedValue: "main-content",
      },
    },
  ],
  hints: [
    {
      text: "A skip link is a regular <a> element that appears before any other content and links to #main-content.",
      scorePenalty: 10,
    },
    {
      text: "The skip link should be visually hidden by default (position:absolute, left:-9999px) but visible when focused.",
      scorePenalty: 15,
    },
    {
      text: "Add <a href=\"#main-content\" class=\"skip-link\">Skip to main content</a> as the first child, and id=\"main-content\" to <main>.",
      scorePenalty: 25,
    },
  ],
  order: 3,
};
