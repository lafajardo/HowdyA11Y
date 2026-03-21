import type { ChallengeDefinition } from "../types";

export const invalidAria: ChallengeDefinition = {
  slug: "invalid-aria",
  title: "Fix Invalid ARIA",
  principle: "robust",
  wcagRef: {
    criterion: "4.1.2",
    title: "Name, Role, Value",
    level: "A",
    url: "https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html",
  },
  difficulty: "advanced",
  mode: "code-editor",
  maxScore: 100,
  description:
    "This page has several ARIA attributes used incorrectly: invalid roles, mismatched aria-labelledby references, aria attributes on elements that don't support them, and redundant ARIA on semantic elements. Fix all the ARIA issues.",
  realWorldImpact:
    "Bad ARIA is worse than no ARIA. Invalid attributes confuse screen readers, create misleading announcements, and can make elements completely inaccessible. The first rule of ARIA is: don't use ARIA if native HTML can do the job.",
  instructions:
    "Fix or remove the incorrect ARIA attributes. Use native HTML elements where possible instead of ARIA roles. Ensure all `aria-labelledby` values reference existing element IDs. Remove redundant ARIA on elements that already have implicit roles.",
  initialCode: `<style>
  body { font-family: system-ui, sans-serif; padding: 2rem; max-width: 600px; }
  .btn { padding: 0.5rem 1rem; background: #1a56db; color: white; border: none; border-radius: 4px; cursor: pointer; }
  .card { border: 1px solid #e2e8f0; border-radius: 8px; padding: 1rem; margin-bottom: 1rem; }
</style>

<!-- Problem 1: role="link" on a real <a> is redundant -->
<a href="/home" role="link">Go to Home</a>

<!-- Problem 2: aria-labelledby references non-existent ID -->
<div class="card" aria-labelledby="card-heading">
  <h3>Product Information</h3>
  <p>Details about this product.</p>
</div>

<!-- Problem 3: role="button" on a <div> without keyboard support -->
<div role="button" class="btn" onclick="alert('clicked')">Click Me</div>

<!-- Problem 4: Invalid role value -->
<div role="contentinfo" aria-label="Search section">
  <label for="search">Search</label>
  <input type="text" id="search" role="searchbox">
</div>

<!-- Problem 5: aria-expanded on an element that doesn't support it -->
<p aria-expanded="true">This is a regular paragraph.</p>

<!-- Problem 6: Using ARIA where native HTML works -->
<div role="navigation" aria-label="Page navigation">
  <div role="list">
    <div role="listitem"><a href="/page1">Page 1</a></div>
    <div role="listitem"><a href="/page2">Page 2</a></div>
  </div>
</div>`,
  solutionCode: `<style>
  body { font-family: system-ui, sans-serif; padding: 2rem; max-width: 600px; }
  .btn { padding: 0.5rem 1rem; background: #1a56db; color: white; border: none; border-radius: 4px; cursor: pointer; }
  .card { border: 1px solid #e2e8f0; border-radius: 8px; padding: 1rem; margin-bottom: 1rem; }
</style>

<!-- Fix 1: Removed redundant role="link" -->
<a href="/home">Go to Home</a>

<!-- Fix 2: Added matching id to heading -->
<div class="card" aria-labelledby="card-heading">
  <h3 id="card-heading">Product Information</h3>
  <p>Details about this product.</p>
</div>

<!-- Fix 3: Replaced div[role=button] with actual <button> -->
<button class="btn" onclick="alert('clicked')">Click Me</button>

<!-- Fix 4: Proper search structure -->
<search aria-label="Search section">
  <label for="search">Search</label>
  <input type="search" id="search">
</search>

<!-- Fix 5: Removed invalid aria-expanded from <p> -->
<p>This is a regular paragraph.</p>

<!-- Fix 6: Replaced ARIA with native HTML -->
<nav aria-label="Page navigation">
  <ul>
    <li><a href="/page1">Page 1</a></li>
    <li><a href="/page2">Page 2</a></li>
  </ul>
</nav>`,
  validationRules: [
    {
      id: "no-redundant-roles",
      type: "custom",
      description: "Native HTML elements should not have redundant ARIA roles (e.g., <a role=\"link\">)",
      params: { check: "no-redundant-roles" },
    },
    {
      id: "valid-labelledby",
      type: "custom",
      description: "All aria-labelledby values must reference existing element IDs",
      params: { check: "valid-labelledby-refs" },
    },
    {
      id: "no-div-buttons",
      type: "custom",
      description: "Use native <button> instead of <div role=\"button\">",
      params: { check: "no-div-role-button" },
    },
    {
      id: "no-invalid-aria-on-p",
      type: "custom",
      description: "Remove aria-expanded from elements that don't support it",
      params: { check: "no-invalid-aria-states" },
    },
  ],
  hints: [
    {
      text: "The first rule of ARIA: don't use ARIA if a native HTML element can do the job.",
      scorePenalty: 10,
    },
    {
      text: "Check that every aria-labelledby value matches an actual id in the document. The heading inside the card needs id=\"card-heading\".",
      scorePenalty: 15,
    },
    {
      text: "Replace <div role=\"button\"> with <button>. Replace <div role=\"navigation\"> with <nav>. Replace <div role=\"list\"> with <ul> and role=\"listitem\" with <li>. Remove role=\"link\" from <a>.",
      scorePenalty: 25,
    },
  ],
  order: 2,
};
