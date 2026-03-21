import type { ChallengeDefinition } from "../types";

export const ariaLandmarks: ChallengeDefinition = {
  slug: "aria-landmarks",
  title: "Add ARIA Landmarks",
  principle: "robust",
  wcagRef: {
    criterion: "4.1.2",
    title: "Name, Role, Value",
    level: "A",
    url: "https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html",
  },
  difficulty: "intermediate",
  mode: "code-editor",
  maxScore: 100,
  description:
    "This page uses only <div> elements for its structure. Screen reader users cannot quickly navigate between sections because there are no landmark regions. Add semantic HTML elements and ARIA landmarks.",
  realWorldImpact:
    "Screen reader users navigate pages using landmarks (banner, navigation, main, contentinfo). Without them, they must read through every element linearly. Landmarks act like a table of contents for the page structure.",
  instructions:
    "Replace generic `<div>` elements with semantic HTML (`<header>`, `<nav>`, `<main>`, `<footer>`). Add `aria-label` attributes to navigation elements when there are multiple `<nav>` elements to distinguish them.",
  initialCode: `<style>
  body { margin: 0; font-family: system-ui, sans-serif; }
  .site-header { background: #1e293b; color: white; padding: 1rem 2rem; }
  .site-nav a { color: #93c5fd; text-decoration: none; margin-right: 1rem; }
  .content { padding: 2rem; }
  .sidebar { padding: 1rem 2rem; background: #f8fafc; }
  .sidebar-nav a { display: block; color: #1a56db; margin-bottom: 0.5rem; }
  .site-footer { background: #1e293b; color: #94a3b8; padding: 1rem 2rem; text-align: center; }
</style>

<div class="site-header">
  <div style="font-size:1.25rem;font-weight:bold;">My Website</div>
  <div class="site-nav">
    <a href="/">Home</a>
    <a href="/about">About</a>
    <a href="/blog">Blog</a>
    <a href="/contact">Contact</a>
  </div>
</div>

<div style="display:flex;">
  <div class="sidebar">
    <div style="font-weight:bold;margin-bottom:0.5rem;">Blog Categories</div>
    <div class="sidebar-nav">
      <a href="/tech">Technology</a>
      <a href="/design">Design</a>
      <a href="/a11y">Accessibility</a>
    </div>
  </div>
  <div class="content">
    <div style="font-size:1.5rem;font-weight:bold;margin-bottom:1rem;">Latest Blog Posts</div>
    <div>
      <div style="font-size:1.25rem;font-weight:600;">Understanding WCAG</div>
      <div>A comprehensive guide to web accessibility standards...</div>
    </div>
  </div>
</div>

<div class="site-footer">
  <div>&copy; 2024 My Website. All rights reserved.</div>
</div>`,
  solutionCode: `<style>
  body { margin: 0; font-family: system-ui, sans-serif; }
  .site-header { background: #1e293b; color: white; padding: 1rem 2rem; }
  .site-nav a { color: #93c5fd; text-decoration: none; margin-right: 1rem; }
  .content { padding: 2rem; }
  .sidebar { padding: 1rem 2rem; background: #f8fafc; }
  .sidebar-nav a { display: block; color: #1a56db; margin-bottom: 0.5rem; }
  .site-footer { background: #1e293b; color: #94a3b8; padding: 1rem 2rem; text-align: center; }
</style>

<header class="site-header">
  <div style="font-size:1.25rem;font-weight:bold;">My Website</div>
  <nav class="site-nav" aria-label="Main navigation">
    <a href="/">Home</a>
    <a href="/about">About</a>
    <a href="/blog">Blog</a>
    <a href="/contact">Contact</a>
  </nav>
</header>

<div style="display:flex;">
  <aside class="sidebar">
    <div style="font-weight:bold;margin-bottom:0.5rem;">Blog Categories</div>
    <nav class="sidebar-nav" aria-label="Blog categories">
      <a href="/tech">Technology</a>
      <a href="/design">Design</a>
      <a href="/a11y">Accessibility</a>
    </nav>
  </aside>
  <main class="content">
    <h1>Latest Blog Posts</h1>
    <article>
      <h2>Understanding WCAG</h2>
      <p>A comprehensive guide to web accessibility standards...</p>
    </article>
  </main>
</div>

<footer class="site-footer">
  <p>&copy; 2024 My Website. All rights reserved.</p>
</footer>`,
  validationRules: [
    {
      id: "has-header",
      type: "html-element-exists",
      description: "Page must use a <header> element",
      params: { selector: "header" },
    },
    {
      id: "has-nav",
      type: "html-element-exists",
      description: "Page must use <nav> elements for navigation",
      params: { selector: "nav" },
    },
    {
      id: "has-main",
      type: "html-element-exists",
      description: "Page must use a <main> element for primary content",
      params: { selector: "main" },
    },
    {
      id: "has-footer",
      type: "html-element-exists",
      description: "Page must use a <footer> element",
      params: { selector: "footer" },
    },
    {
      id: "nav-has-label",
      type: "custom",
      description: "When multiple <nav> elements exist, each must have an aria-label",
      params: { check: "nav-has-labels" },
    },
  ],
  hints: [
    {
      text: "HTML5 semantic elements (<header>, <nav>, <main>, <aside>, <footer>) automatically create landmark regions.",
      scorePenalty: 10,
    },
    {
      text: "Replace the outer <div> containers with <header>, <nav>, <main>, and <footer> elements.",
      scorePenalty: 15,
    },
    {
      text: "When you have multiple <nav> elements, give each one an aria-label (e.g., aria-label=\"Main navigation\" and aria-label=\"Blog categories\").",
      scorePenalty: 25,
    },
  ],
  order: 1,
};
