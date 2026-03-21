import type { ChallengeDefinition } from "../types";

export const nameRoleValue: ChallengeDefinition = {
  slug: "name-role-value",
  title: "Fix Custom Widget Accessibility",
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
    "This page has custom-built interactive widgets (a toggle switch, a star rating, and an accordion) that look correct visually but are completely invisible to screen readers. They have no accessible names, roles, or values.",
  realWorldImpact:
    "Custom widgets that lack proper ARIA attributes are invisible to screen readers. A sighted user sees a toggle switch, but a screen reader user encounters nothing meaningful. Every custom interactive component must expose its name, role, and current value to assistive technologies.",
  instructions:
    "Add appropriate ARIA roles, labels, and state attributes to each custom widget. The toggle needs `role=\"switch\"`, `aria-checked`, and `aria-label`. The star rating needs `role=\"radiogroup\"` with `role=\"radio\"` children. The accordion needs proper `aria-expanded` and `aria-controls`.",
  initialCode: `<style>
  body { font-family: system-ui, sans-serif; padding: 2rem; max-width: 500px; }
  .toggle-track {
    width: 48px; height: 24px; background: #e2e8f0; border-radius: 12px;
    position: relative; cursor: pointer; display: inline-block;
  }
  .toggle-thumb {
    width: 20px; height: 20px; background: white; border-radius: 50%;
    position: absolute; top: 2px; left: 2px; transition: left 0.2s;
    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
  }
  .stars { display: flex; gap: 0.25rem; cursor: pointer; }
  .star { font-size: 1.5rem; color: #e2e8f0; }
  .star.filled { color: #f59e0b; }
  .accordion-header {
    padding: 0.75rem 1rem; background: #f8fafc; border: 1px solid #e2e8f0;
    cursor: pointer; font-weight: 600;
  }
  .accordion-content {
    padding: 1rem; border: 1px solid #e2e8f0; border-top: none;
  }
</style>

<h2>Settings</h2>

<!-- Custom toggle switch -->
<div style="margin-bottom:1.5rem;">
  <span>Enable notifications</span>
  <div class="toggle-track" onclick="this.classList.toggle('active')">
    <div class="toggle-thumb"></div>
  </div>
</div>

<!-- Custom star rating -->
<div style="margin-bottom:1.5rem;">
  <span>Rate this product:</span>
  <div class="stars">
    <span class="star filled" onclick="rate(1)">&#9733;</span>
    <span class="star filled" onclick="rate(2)">&#9733;</span>
    <span class="star filled" onclick="rate(3)">&#9733;</span>
    <span class="star" onclick="rate(4)">&#9733;</span>
    <span class="star" onclick="rate(5)">&#9733;</span>
  </div>
</div>

<!-- Custom accordion -->
<div style="margin-bottom:1.5rem;">
  <div class="accordion-header" onclick="this.nextElementSibling.style.display=this.nextElementSibling.style.display==='none'?'block':'none'">
    Frequently Asked Questions
  </div>
  <div class="accordion-content">
    <p>Here are the answers to common questions about our service.</p>
  </div>
</div>`,
  solutionCode: `<style>
  body { font-family: system-ui, sans-serif; padding: 2rem; max-width: 500px; }
  .toggle-track {
    width: 48px; height: 24px; background: #e2e8f0; border-radius: 12px;
    position: relative; cursor: pointer; display: inline-block;
    border: none;
  }
  .toggle-track:focus-visible { outline: 3px solid #1a56db; outline-offset: 2px; }
  .toggle-thumb {
    width: 20px; height: 20px; background: white; border-radius: 50%;
    position: absolute; top: 2px; left: 2px; transition: left 0.2s;
    box-shadow: 0 1px 3px rgba(0,0,0,0.2); pointer-events: none;
  }
  .stars { display: flex; gap: 0.25rem; }
  .star {
    font-size: 1.5rem; color: #e2e8f0; background: none;
    border: none; cursor: pointer; padding: 0.25rem;
  }
  .star:focus-visible { outline: 3px solid #1a56db; outline-offset: 2px; }
  .star.filled { color: #f59e0b; }
  .accordion-header {
    padding: 0.75rem 1rem; background: #f8fafc; border: 1px solid #e2e8f0;
    cursor: pointer; font-weight: 600; width: 100%; text-align: left;
    font-size: inherit; font-family: inherit;
  }
  .accordion-header:focus-visible { outline: 3px solid #1a56db; outline-offset: -2px; }
  .accordion-content {
    padding: 1rem; border: 1px solid #e2e8f0; border-top: none;
  }
</style>

<h2>Settings</h2>

<!-- Accessible toggle switch -->
<div style="margin-bottom:1.5rem;">
  <span id="notif-label">Enable notifications</span>
  <button class="toggle-track" role="switch" aria-checked="false" aria-labelledby="notif-label" onclick="var c=this.getAttribute('aria-checked')==='true';this.setAttribute('aria-checked',!c);">
    <div class="toggle-thumb"></div>
  </button>
</div>

<!-- Accessible star rating -->
<div style="margin-bottom:1.5rem;">
  <div id="rating-label">Rate this product:</div>
  <div class="stars" role="radiogroup" aria-labelledby="rating-label">
    <button class="star filled" role="radio" aria-checked="true" aria-label="1 star" onclick="rate(1)">&#9733;</button>
    <button class="star filled" role="radio" aria-checked="false" aria-label="2 stars" onclick="rate(2)">&#9733;</button>
    <button class="star filled" role="radio" aria-checked="false" aria-label="3 stars" onclick="rate(3)">&#9733;</button>
    <button class="star" role="radio" aria-checked="false" aria-label="4 stars" onclick="rate(4)">&#9733;</button>
    <button class="star" role="radio" aria-checked="false" aria-label="5 stars" onclick="rate(5)">&#9733;</button>
  </div>
</div>

<!-- Accessible accordion -->
<div style="margin-bottom:1.5rem;">
  <h3>
    <button class="accordion-header" aria-expanded="true" aria-controls="faq-content" onclick="var e=this.getAttribute('aria-expanded')==='true';this.setAttribute('aria-expanded',!e);document.getElementById('faq-content').style.display=e?'none':'block';">
      Frequently Asked Questions
    </button>
  </h3>
  <div class="accordion-content" id="faq-content" role="region" aria-labelledby="faq-header">
    <p>Here are the answers to common questions about our service.</p>
  </div>
</div>`,
  validationRules: [
    {
      id: "toggle-has-switch-role",
      type: "custom",
      description: "Toggle must have role=\"switch\" with aria-checked and an accessible name",
      params: { check: "has-switch-role" },
    },
    {
      id: "rating-has-radiogroup",
      type: "custom",
      description: "Star rating must use role=\"radiogroup\" with role=\"radio\" children",
      params: { check: "has-radiogroup" },
    },
    {
      id: "accordion-has-expanded",
      type: "custom",
      description: "Accordion header must have aria-expanded attribute",
      params: { check: "has-aria-expanded-on-button" },
    },
  ],
  hints: [
    {
      text: "Custom widgets need three things: a name (what is it?), a role (what type of control is it?), and a value/state (what is its current state?).",
      scorePenalty: 10,
    },
    {
      text: "For the toggle: use role=\"switch\" and aria-checked=\"true/false\". For the rating: use role=\"radiogroup\" on the container and role=\"radio\" on each star.",
      scorePenalty: 15,
    },
    {
      text: "Replace <div> and <span> interactive elements with <button> elements. Add role=\"switch\" + aria-checked to the toggle, role=\"radiogroup\" + role=\"radio\" to the rating, and aria-expanded + aria-controls to the accordion.",
      scorePenalty: 25,
    },
  ],
  order: 3,
};
