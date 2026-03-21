import type { ChallengeDefinition } from "../types";

export const keyboardTraps: ChallengeDefinition = {
  slug: "keyboard-traps",
  title: "Escape the Keyboard Trap",
  principle: "operable",
  wcagRef: {
    criterion: "2.1.2",
    title: "No Keyboard Trap",
    level: "A",
    url: "https://www.w3.org/WAI/WCAG21/Understanding/no-keyboard-trap.html",
  },
  difficulty: "intermediate",
  mode: "code-editor",
  maxScore: 100,
  description:
    "This modal dialog traps keyboard focus — once you Tab into it, you cannot escape. The modal also lacks proper focus management. Fix it so users can close it with Escape and navigate out properly.",
  realWorldImpact:
    "Keyboard traps are one of the most frustrating accessibility barriers. When a keyboard user gets trapped in a component, their only option is to close the browser tab entirely, losing all their work and context.",
  instructions:
    "Add an Escape key handler to close the modal. Add a visible close button. Ensure that when the modal is open, focus is trapped within it (cycling between focusable elements), but when closed, focus returns to the trigger element.",
  initialCode: `<style>
  .modal-overlay {
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.5);
    display: flex; align-items: center; justify-content: center;
  }
  .modal {
    background: white; padding: 2rem; border-radius: 0.5rem;
    max-width: 400px; width: 90%;
  }
  .modal h2 { margin-bottom: 1rem; }
  .modal input {
    width: 100%; padding: 0.5rem; margin-bottom: 0.75rem;
    border: 1px solid #e2e8f0; border-radius: 4px; box-sizing: border-box;
  }
  .modal-submit {
    background: #1a56db; color: white; padding: 0.5rem 1rem;
    border: none; border-radius: 4px; cursor: pointer;
  }
</style>

<button id="openModal" onclick="document.getElementById('modal').style.display='flex'">
  Open Settings
</button>

<div id="modal" class="modal-overlay" style="display:flex;">
  <div class="modal">
    <h2>Settings</h2>
    <label>
      Display Name
      <input type="text" value="John">
    </label>
    <label>
      Email
      <input type="email" value="john@example.com">
    </label>
    <button class="modal-submit">Save Changes</button>
  </div>
</div>`,
  solutionCode: `<style>
  .modal-overlay {
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.5);
    display: flex; align-items: center; justify-content: center;
  }
  .modal {
    background: white; padding: 2rem; border-radius: 0.5rem;
    max-width: 400px; width: 90%; position: relative;
  }
  .modal h2 { margin-bottom: 1rem; }
  .modal input {
    width: 100%; padding: 0.5rem; margin-bottom: 0.75rem;
    border: 1px solid #e2e8f0; border-radius: 4px; box-sizing: border-box;
  }
  .modal-submit {
    background: #1a56db; color: white; padding: 0.5rem 1rem;
    border: none; border-radius: 4px; cursor: pointer;
  }
  .modal-close {
    position: absolute; top: 0.5rem; right: 0.5rem;
    background: none; border: none; font-size: 1.5rem;
    cursor: pointer; padding: 0.25rem 0.5rem;
  }
  .modal-close:focus-visible {
    outline: 3px solid #1a56db; outline-offset: 2px;
  }
</style>

<button id="openModal" onclick="document.getElementById('modal').style.display='flex'">
  Open Settings
</button>

<div id="modal" class="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title" style="display:flex;" onkeydown="if(event.key==='Escape'){this.style.display='none';document.getElementById('openModal').focus();}">
  <div class="modal">
    <button class="modal-close" aria-label="Close dialog" onclick="document.getElementById('modal').style.display='none';document.getElementById('openModal').focus();">&#10005;</button>
    <h2 id="modal-title">Settings</h2>
    <label>
      Display Name
      <input type="text" value="John">
    </label>
    <label>
      Email
      <input type="email" value="john@example.com">
    </label>
    <button class="modal-submit">Save Changes</button>
  </div>
</div>`,
  validationRules: [
    {
      id: "has-close-button",
      type: "html-element-exists",
      description: "Modal must have a visible close button",
      params: {
        selector: "[aria-label='Close dialog'], .modal-close, button:has(close)",
        context: ".modal, [role='dialog']",
      },
    },
    {
      id: "has-role-dialog",
      type: "html-attribute",
      description: "Modal container must have role=\"dialog\" and aria-modal=\"true\"",
      params: {
        selector: ".modal-overlay, [role='dialog']",
        attribute: "role",
        expectedValue: "dialog",
      },
    },
    {
      id: "has-escape-handler",
      type: "custom",
      description: "Modal must handle the Escape key to close",
      params: {
        check: "has-escape-handler",
      },
    },
  ],
  hints: [
    {
      text: "Every modal must have a way to close it without a mouse. The Escape key is the standard convention.",
      scorePenalty: 10,
    },
    {
      text: "Add a close button with aria-label=\"Close dialog\" inside the modal, and an onkeydown handler that checks for event.key==='Escape'.",
      scorePenalty: 15,
    },
    {
      text: "Add role=\"dialog\" and aria-modal=\"true\" to the overlay, and aria-labelledby pointing to the modal title.",
      scorePenalty: 25,
    },
  ],
  order: 2,
};
