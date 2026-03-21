import type { ChallengeDefinition, ValidationRule } from "@/data/challenges/types";
import { validateContrastRatio } from "./validators/contrast-validator";
import {
  validateHTMLAttribute,
  validateHTMLElementExists,
} from "./validators/html-validator";

export interface ValidationRuleResult {
  ruleId: string;
  passed: boolean;
  message: string;
}

export interface ValidationResult {
  allPassed: boolean;
  results: ValidationRuleResult[];
  score: number;
}

// Validate for code-editor challenges (HTML string input)
function validateCodeRule(
  rule: ValidationRule,
  html: string
): ValidationRuleResult {
  switch (rule.type) {
    case "html-attribute": {
      const result = validateHTMLAttribute(html, rule.params as {
        selector: string;
        attribute: string;
        mustExist?: boolean;
        mustBeNonEmpty?: boolean;
        expectedValue?: string;
      });
      return { ruleId: rule.id, ...result };
    }

    case "html-element-exists": {
      const result = validateHTMLElementExists(html, rule.params as {
        selector: string;
      });
      return { ruleId: rule.id, ...result };
    }

    case "custom":
      return validateCustomCodeRule(rule, html);

    default:
      return {
        ruleId: rule.id,
        passed: false,
        message: `Unknown validation type: ${rule.type}`,
      };
  }
}

// Validate for ui-controls challenges (control values input)
function validateControlRule(
  rule: ValidationRule,
  values: Record<string, unknown>
): ValidationRuleResult {
  switch (rule.type) {
    case "contrast-ratio": {
      const params = rule.params as {
        foregroundControlId: string;
        backgroundControlId: string;
        minimumRatio: number;
      };
      const fg = values[params.foregroundControlId] as string;
      const bg = values[params.backgroundControlId] as string;
      const result = validateContrastRatio(fg, bg, params.minimumRatio);
      return { ruleId: rule.id, passed: result.passed, message: result.message };
    }

    case "custom":
      return validateCustomControlRule(rule, values);

    default:
      return {
        ruleId: rule.id,
        passed: false,
        message: `Unknown validation type: ${rule.type}`,
      };
  }
}

// Custom validators for code-editor challenges
function validateCustomCodeRule(
  rule: ValidationRule,
  html: string
): ValidationRuleResult {
  const check = rule.params.check as string;
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  switch (check) {
    case "no-div-onclick": {
      const divs = doc.querySelectorAll("div[onclick]");
      if (divs.length > 0) {
        return {
          ruleId: rule.id,
          passed: false,
          message: `Found ${divs.length} <div> element(s) with onclick handlers. Use <button> or <a> instead.`,
        };
      }
      return { ruleId: rule.id, passed: true, message: "No <div> elements with onclick handlers found." };
    }

    case "has-focus-visible": {
      const hasFocusVisible = html.includes("focus-visible") || html.includes(":focus-visible");
      if (!hasFocusVisible) {
        return {
          ruleId: rule.id,
          passed: false,
          message: "No :focus-visible styles found. Interactive elements need visible focus indicators.",
        };
      }
      return { ruleId: rule.id, passed: true, message: "Focus-visible styles are present." };
    }

    case "has-skip-link": {
      const skipLink = doc.querySelector('a[href="#main-content"]');
      if (!skipLink) {
        return {
          ruleId: rule.id,
          passed: false,
          message: 'No skip navigation link found. Add <a href="#main-content">Skip to main content</a>.',
        };
      }
      return { ruleId: rule.id, passed: true, message: "Skip navigation link is present." };
    }

    case "has-escape-handler": {
      const hasEscape = html.includes("Escape") || html.includes("escape") || html.includes("keyCode===27");
      if (!hasEscape) {
        return {
          ruleId: rule.id,
          passed: false,
          message: "No Escape key handler found. The modal must close when the user presses Escape.",
        };
      }
      return { ruleId: rule.id, passed: true, message: "Escape key handler is present." };
    }

    case "inputs-have-labels": {
      const inputs = doc.querySelectorAll("input, select, textarea");
      for (const input of inputs) {
        const id = input.getAttribute("id");
        if (!id) {
          return {
            ruleId: rule.id,
            passed: false,
            message: `A <${input.tagName.toLowerCase()}> element is missing an id attribute. Each input needs an id to link with a <label>.`,
          };
        }
        const label = doc.querySelector(`label[for="${id}"]`);
        if (!label) {
          return {
            ruleId: rule.id,
            passed: false,
            message: `No <label for="${id}"> found for the <${input.tagName.toLowerCase()}> element.`,
          };
        }
      }
      return { ruleId: rule.id, passed: true, message: "All form inputs have associated labels." };
    }

    case "has-aria-describedby-errors": {
      const invalidInputs = doc.querySelectorAll("[aria-invalid='true']");
      if (invalidInputs.length === 0) {
        return {
          ruleId: rule.id,
          passed: false,
          message: "No inputs with aria-invalid=\"true\" found. Mark error fields with aria-invalid.",
        };
      }
      for (const input of invalidInputs) {
        const describedby = input.getAttribute("aria-describedby");
        if (!describedby) {
          return {
            ruleId: rule.id,
            passed: false,
            message: `An error field is missing aria-describedby to link it to its error message.`,
          };
        }
        const errorEl = doc.getElementById(describedby);
        if (!errorEl) {
          return {
            ruleId: rule.id,
            passed: false,
            message: `aria-describedby references "${describedby}" but no element with that id exists.`,
          };
        }
      }
      return { ruleId: rule.id, passed: true, message: "All error fields are linked to their error messages." };
    }

    case "has-specific-error-messages": {
      const errorMsgs = doc.querySelectorAll(".error-msg, [role='alert'] p, [id*='error']");
      for (const msg of errorMsgs) {
        const text = (msg.textContent || "").trim().toLowerCase();
        if (text === "invalid input" || text === "required" || text === "error") {
          return {
            ruleId: rule.id,
            passed: false,
            message: `Error message "${msg.textContent?.trim()}" is too vague. Provide specific guidance on how to fix the error.`,
          };
        }
      }
      return { ruleId: rule.id, passed: true, message: "Error messages are specific and helpful." };
    }

    case "has-lang-on-foreign-text": {
      const allElements = doc.querySelectorAll("[lang='es'], [lang='fr'], [lang='de']");
      if (allElements.length === 0) {
        const body = doc.body;
        if (body) {
          const text = body.textContent || "";
          const hasSpanish = /\b(Bienvenidos|comprometidos|español|nuestra)\b/i.test(text);
          if (hasSpanish) {
            return {
              ruleId: rule.id,
              passed: false,
              message: "Spanish text found without a lang=\"es\" attribute. Wrap it in an element with lang=\"es\".",
            };
          }
        }
      }
      return { ruleId: rule.id, passed: true, message: "Foreign language text has appropriate lang attributes." };
    }

    case "no-redundant-roles": {
      const redundantChecks = [
        { selector: "a[role='link']", desc: '<a> with role="link"' },
        { selector: "button[role='button']", desc: '<button> with role="button"' },
        { selector: "nav[role='navigation']", desc: '<nav> with role="navigation"' },
        { selector: "main[role='main']", desc: '<main> with role="main"' },
      ];
      for (const check of redundantChecks) {
        const found = doc.querySelectorAll(check.selector);
        if (found.length > 0) {
          return {
            ruleId: rule.id,
            passed: false,
            message: `Found ${check.desc}. This ARIA role is redundant — the native element already has this role implicitly.`,
          };
        }
      }
      return { ruleId: rule.id, passed: true, message: "No redundant ARIA roles found." };
    }

    case "valid-labelledby-refs": {
      const labeled = doc.querySelectorAll("[aria-labelledby]");
      for (const el of labeled) {
        const refId = el.getAttribute("aria-labelledby");
        if (refId && !doc.getElementById(refId)) {
          return {
            ruleId: rule.id,
            passed: false,
            message: `aria-labelledby references "${refId}" but no element with id="${refId}" exists.`,
          };
        }
      }
      return { ruleId: rule.id, passed: true, message: "All aria-labelledby references point to valid IDs." };
    }

    case "no-div-role-button": {
      const divButtons = doc.querySelectorAll("div[role='button']");
      if (divButtons.length > 0) {
        return {
          ruleId: rule.id,
          passed: false,
          message: 'Found <div role="button">. Use a native <button> element instead.',
        };
      }
      return { ruleId: rule.id, passed: true, message: "No <div> elements used as buttons." };
    }

    case "no-invalid-aria-states": {
      const invalidUses = [
        { selector: "p[aria-expanded]", desc: '<p> with aria-expanded' },
        { selector: "span[aria-expanded]", desc: '<span> with aria-expanded (not interactive)' },
      ];
      for (const check of invalidUses) {
        const found = doc.querySelectorAll(check.selector);
        if (found.length > 0) {
          return {
            ruleId: rule.id,
            passed: false,
            message: `Found ${check.desc}. aria-expanded should only be used on interactive elements like buttons.`,
          };
        }
      }
      return { ruleId: rule.id, passed: true, message: "ARIA states are used on appropriate elements." };
    }

    case "nav-has-labels": {
      const navs = doc.querySelectorAll("nav");
      if (navs.length > 1) {
        for (const nav of navs) {
          const label = nav.getAttribute("aria-label") || nav.getAttribute("aria-labelledby");
          if (!label) {
            return {
              ruleId: rule.id,
              passed: false,
              message: "Multiple <nav> elements found but not all have aria-label. Each nav needs a unique label.",
            };
          }
        }
      }
      return { ruleId: rule.id, passed: true, message: "Navigation elements are properly labeled." };
    }

    case "has-switch-role": {
      const switches = doc.querySelectorAll("[role='switch']");
      if (switches.length === 0) {
        return {
          ruleId: rule.id,
          passed: false,
          message: 'Toggle switch needs role="switch". No element with role="switch" found.',
        };
      }
      for (const sw of switches) {
        if (!sw.hasAttribute("aria-checked")) {
          return {
            ruleId: rule.id,
            passed: false,
            message: 'Toggle switch with role="switch" is missing aria-checked attribute.',
          };
        }
        const name = sw.getAttribute("aria-label") || sw.getAttribute("aria-labelledby");
        if (!name) {
          return {
            ruleId: rule.id,
            passed: false,
            message: "Toggle switch needs an accessible name (aria-label or aria-labelledby).",
          };
        }
      }
      return { ruleId: rule.id, passed: true, message: "Toggle switch has proper role, state, and name." };
    }

    case "has-radiogroup": {
      const radiogroup = doc.querySelector("[role='radiogroup']");
      if (!radiogroup) {
        return {
          ruleId: rule.id,
          passed: false,
          message: 'Star rating container needs role="radiogroup".',
        };
      }
      const radios = radiogroup.querySelectorAll("[role='radio']");
      if (radios.length === 0) {
        return {
          ruleId: rule.id,
          passed: false,
          message: 'Star rating items need role="radio" on each star.',
        };
      }
      return { ruleId: rule.id, passed: true, message: "Star rating has radiogroup with radio children." };
    }

    case "has-aria-expanded-on-button": {
      const buttons = doc.querySelectorAll("button[aria-expanded], [role='button'][aria-expanded]");
      if (buttons.length === 0) {
        return {
          ruleId: rule.id,
          passed: false,
          message: "Accordion header needs a <button> with aria-expanded attribute.",
        };
      }
      return { ruleId: rule.id, passed: true, message: "Accordion button has aria-expanded." };
    }

    default:
      return {
        ruleId: rule.id,
        passed: false,
        message: `Unknown custom check: ${check}`,
      };
  }
}

// Custom validators for ui-controls challenges
function validateCustomControlRule(
  rule: ValidationRule,
  values: Record<string, unknown>
): ValidationRuleResult {
  const params = rule.params;

  // Simple control value check
  if (params.controlId && params.expectedValue !== undefined) {
    const actual = values[params.controlId as string];
    const expected = params.expectedValue;
    if (actual === expected) {
      return { ruleId: rule.id, passed: true, message: rule.description + " — Fixed!" };
    }
    return {
      ruleId: rule.id,
      passed: false,
      message: rule.description,
    };
  }

  // Check against expected values array
  if (params.controlId && params.expectedValues) {
    const actual = values[params.controlId as string];
    const expectedArr = params.expectedValues as unknown[];
    if (expectedArr.includes(actual)) {
      return { ruleId: rule.id, passed: true, message: rule.description + " — Fixed!" };
    }
    return {
      ruleId: rule.id,
      passed: false,
      message: rule.description,
    };
  }

  // Minimum value check
  if (params.controlId && params.minimumValue !== undefined) {
    const actual = Number(values[params.controlId as string]);
    const minimum = params.minimumValue as number;
    if (actual >= minimum) {
      return {
        ruleId: rule.id,
        passed: true,
        message: `${rule.description} — Current value: ${actual}px. Meets minimum of ${minimum}px.`,
      };
    }
    return {
      ruleId: rule.id,
      passed: false,
      message: `${rule.description} — Current value: ${actual}px. Needs at least ${minimum}px.`,
    };
  }

  // OR logic for multiple conditions
  if (params.logic === "or" && params.conditions) {
    const conditions = params.conditions as Array<{
      controlId: string;
      expectedValue: unknown;
    }>;
    const anyPassed = conditions.some(
      (cond) => values[cond.controlId] === cond.expectedValue
    );
    if (anyPassed) {
      return { ruleId: rule.id, passed: true, message: rule.description + " — Fixed!" };
    }
    return { ruleId: rule.id, passed: false, message: rule.description };
  }

  return {
    ruleId: rule.id,
    passed: false,
    message: `Could not validate rule: ${rule.id}`,
  };
}

export function validate(
  challenge: ChallengeDefinition,
  input: string | Record<string, unknown>,
  hintsUsed: number
): ValidationResult {
  const results: ValidationRuleResult[] = [];

  for (const rule of challenge.validationRules) {
    let result: ValidationRuleResult;

    if (challenge.mode === "code-editor" && typeof input === "string") {
      result = validateCodeRule(rule, input);
    } else if (challenge.mode === "ui-controls" && typeof input === "object") {
      result = validateControlRule(rule, input);
    } else {
      result = {
        ruleId: rule.id,
        passed: false,
        message: "Invalid input type for challenge mode.",
      };
    }

    results.push(result);
  }

  const allPassed = results.every((r) => r.passed);

  // Calculate score
  let score = 0;
  if (allPassed) {
    const hintPenalty = challenge.hints
      .slice(0, hintsUsed)
      .reduce((sum, h) => sum + h.scorePenalty, 0);
    score = Math.max(0, challenge.maxScore - hintPenalty);
  }

  return { allPassed, results, score };
}
