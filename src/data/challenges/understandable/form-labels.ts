import type { ChallengeDefinition } from "../types";

export const formLabels: ChallengeDefinition = {
  slug: "form-labels",
  title: "Add Form Labels",
  principle: "understandable",
  wcagRef: {
    criterion: "3.3.2",
    title: "Labels or Instructions",
    level: "A",
    url: "https://www.w3.org/WAI/WCAG21/Understanding/labels-or-instructions.html",
  },
  difficulty: "beginner",
  mode: "code-editor",
  maxScore: 100,
  description:
    "This registration form uses placeholder text as the only label for inputs. When users start typing, the placeholder disappears and they forget what field they are filling in. Screen readers may not announce what each field is for.",
  realWorldImpact:
    "Placeholders disappear when users begin typing, leaving them without context. Screen readers may not announce placeholder text as labels. Users with cognitive disabilities or short-term memory issues are especially affected.",
  instructions:
    "Add proper `<label>` elements associated with each input using the `for` attribute. Labels must be visible and persistent  -  not just placeholder text.",
  initialCode: `<style>
  .form-container { max-width: 400px; padding: 1.5rem; font-family: system-ui, sans-serif; }
  .form-container h2 { margin-bottom: 1rem; }
  .form-container input, .form-container select {
    width: 100%; padding: 0.75rem; margin-bottom: 1rem;
    border: 1px solid #e2e8f0; border-radius: 4px; font-size: 1rem;
    box-sizing: border-box;
  }
  .form-container button {
    width: 100%; padding: 0.75rem; background: #1a56db;
    color: white; border: none; border-radius: 4px;
    font-size: 1rem; cursor: pointer;
  }
</style>

<div class="form-container">
  <h2>Create Account</h2>
  <form>
    <input type="text" placeholder="Full Name">
    <input type="email" placeholder="Email Address">
    <input type="password" placeholder="Password">
    <input type="password" placeholder="Confirm Password">
    <select>
      <option value="" disabled selected>Select your country</option>
      <option value="us">United States</option>
      <option value="uk">United Kingdom</option>
      <option value="ca">Canada</option>
    </select>
    <button type="submit">Create Account</button>
  </form>
</div>`,
  solutionCode: `<style>
  .form-container { max-width: 400px; padding: 1.5rem; font-family: system-ui, sans-serif; }
  .form-container h2 { margin-bottom: 1rem; }
  .form-container label {
    display: block; font-size: 0.875rem; font-weight: 600;
    margin-bottom: 0.25rem; color: #334155;
  }
  .form-container input, .form-container select {
    width: 100%; padding: 0.75rem; margin-bottom: 1rem;
    border: 1px solid #e2e8f0; border-radius: 4px; font-size: 1rem;
    box-sizing: border-box;
  }
  .form-container button {
    width: 100%; padding: 0.75rem; background: #1a56db;
    color: white; border: none; border-radius: 4px;
    font-size: 1rem; cursor: pointer;
  }
</style>

<div class="form-container">
  <h2>Create Account</h2>
  <form>
    <label for="fullname">Full Name</label>
    <input type="text" id="fullname" placeholder="Full Name">
    <label for="email">Email Address</label>
    <input type="email" id="email" placeholder="Email Address">
    <label for="password">Password</label>
    <input type="password" id="password" placeholder="Password">
    <label for="confirm-password">Confirm Password</label>
    <input type="password" id="confirm-password" placeholder="Confirm Password">
    <label for="country">Country</label>
    <select id="country">
      <option value="" disabled selected>Select your country</option>
      <option value="us">United States</option>
      <option value="uk">United Kingdom</option>
      <option value="ca">Canada</option>
    </select>
    <button type="submit">Create Account</button>
  </form>
</div>`,
  validationRules: [
    {
      id: "inputs-have-labels",
      type: "custom",
      description: "All form inputs must have associated <label> elements with matching for/id attributes",
      params: {
        check: "inputs-have-labels",
      },
    },
  ],
  hints: [
    {
      text: "Each <input> and <select> needs a <label> element. The label's 'for' attribute must match the input's 'id' attribute.",
      scorePenalty: 10,
    },
    {
      text: "Add id attributes to each input (e.g., id=\"fullname\") and a corresponding <label for=\"fullname\">Full Name</label> before it.",
      scorePenalty: 15,
    },
    {
      text: "Placeholders should supplement labels, not replace them. Keep the placeholders but add visible <label> elements above each input.",
      scorePenalty: 25,
    },
  ],
  order: 1,
};
