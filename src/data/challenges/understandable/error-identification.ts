import type { ChallengeDefinition } from "../types";

export const errorIdentification: ChallengeDefinition = {
  slug: "error-identification",
  title: "Improve Error Messages",
  principle: "understandable",
  wcagRef: {
    criterion: "3.3.1",
    title: "Error Identification",
    level: "A",
    url: "https://www.w3.org/WAI/WCAG21/Understanding/error-identification.html",
  },
  difficulty: "intermediate",
  mode: "code-editor",
  maxScore: 100,
  description:
    "This form shows vague error messages and doesn't clearly identify which fields have errors. Screen readers aren't notified of errors. Fix the error handling to be accessible and helpful.",
  realWorldImpact:
    "Vague errors like 'Invalid input' leave all users frustrated. Screen reader users may not even know errors occurred if they aren't programmatically associated with fields. Clear, specific errors reduce form abandonment for everyone.",
  instructions:
    "Add `aria-describedby` to connect error messages to their fields. Use `aria-invalid=\"true\"` on fields with errors. Make error messages specific and helpful. Add `role=\"alert\"` or `aria-live=\"polite\"` to the error container so screen readers announce errors.",
  initialCode: `<style>
  .form { max-width: 400px; padding: 1.5rem; font-family: system-ui, sans-serif; }
  .form label { display: block; font-weight: 600; margin-bottom: 0.25rem; font-size: 0.875rem; }
  .form input {
    width: 100%; padding: 0.5rem; margin-bottom: 0.25rem;
    border: 1px solid #e2e8f0; border-radius: 4px; box-sizing: border-box;
  }
  .form .error-input { border-color: #dc2626; }
  .form .error-msg { color: #dc2626; font-size: 0.75rem; margin-bottom: 1rem; }
  .form button {
    padding: 0.5rem 1.5rem; background: #1a56db; color: white;
    border: none; border-radius: 4px; cursor: pointer;
  }
</style>

<div class="form">
  <h2>Payment Details</h2>
  <div>
    <label>Card Number</label>
    <input type="text" class="error-input" value="1234">
    <div class="error-msg">Invalid input</div>
  </div>
  <div>
    <label>Expiry Date</label>
    <input type="text" class="error-input" value="13/20">
    <div class="error-msg">Invalid input</div>
  </div>
  <div>
    <label>CVV</label>
    <input type="text" value="">
    <div class="error-msg">Required</div>
  </div>
  <button type="submit">Pay Now</button>
</div>`,
  solutionCode: `<style>
  .form { max-width: 400px; padding: 1.5rem; font-family: system-ui, sans-serif; }
  .form label { display: block; font-weight: 600; margin-bottom: 0.25rem; font-size: 0.875rem; }
  .form input {
    width: 100%; padding: 0.5rem; margin-bottom: 0.25rem;
    border: 1px solid #e2e8f0; border-radius: 4px; box-sizing: border-box;
  }
  .form .error-input { border-color: #dc2626; }
  .form .error-msg { color: #dc2626; font-size: 0.75rem; margin-bottom: 1rem; }
  .form button {
    padding: 0.5rem 1.5rem; background: #1a56db; color: white;
    border: none; border-radius: 4px; cursor: pointer;
  }
</style>

<div class="form">
  <h2>Payment Details</h2>
  <div role="alert" aria-live="polite">
    <div>
      <label for="card-number">Card Number</label>
      <input type="text" id="card-number" class="error-input" value="1234" aria-invalid="true" aria-describedby="card-error">
      <div class="error-msg" id="card-error">Card number must be 16 digits. You entered 4 digits.</div>
    </div>
    <div>
      <label for="expiry">Expiry Date</label>
      <input type="text" id="expiry" class="error-input" value="13/20" aria-invalid="true" aria-describedby="expiry-error">
      <div class="error-msg" id="expiry-error">Month must be between 01 and 12. Use format MM/YY.</div>
    </div>
    <div>
      <label for="cvv">CVV</label>
      <input type="text" id="cvv" value="" aria-invalid="true" aria-describedby="cvv-error">
      <div class="error-msg" id="cvv-error">CVV is required. Enter the 3 or 4 digit code on your card.</div>
    </div>
  </div>
  <button type="submit">Pay Now</button>
</div>`,
  validationRules: [
    {
      id: "has-aria-invalid",
      type: "html-attribute",
      description: "Error fields must have aria-invalid=\"true\"",
      params: {
        selector: ".error-input, [aria-invalid]",
        attribute: "aria-invalid",
        expectedValue: "true",
      },
    },
    {
      id: "has-aria-describedby",
      type: "custom",
      description: "Error messages must be linked to fields via aria-describedby",
      params: {
        check: "has-aria-describedby-errors",
      },
    },
    {
      id: "has-specific-messages",
      type: "custom",
      description: "Error messages must be specific (not just 'Invalid input' or 'Required')",
      params: {
        check: "has-specific-error-messages",
      },
    },
  ],
  hints: [
    {
      text: "aria-invalid=\"true\" tells assistive technologies that a field has an error. aria-describedby links the field to its error message.",
      scorePenalty: 10,
    },
    {
      text: "Give each error message a unique id, then reference it: <input aria-describedby=\"card-error\"> ... <div id=\"card-error\">...</div>",
      scorePenalty: 15,
    },
    {
      text: "Replace 'Invalid input' with specific messages like 'Card number must be 16 digits'. Add role=\"alert\" to announce errors to screen readers.",
      scorePenalty: 25,
    },
  ],
  order: 2,
};
