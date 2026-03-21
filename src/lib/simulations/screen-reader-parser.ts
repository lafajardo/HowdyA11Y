export interface ScreenReaderNode {
  type:
    | "heading"
    | "text"
    | "image"
    | "link"
    | "button"
    | "input"
    | "landmark"
    | "list"
    | "separator";
  announcement: string;
  issues: string[];
}

function getAssociatedLabel(
  el: Element,
  doc: Document
): string | null {
  const id = el.getAttribute("id");
  if (id) {
    const label = doc.querySelector(`label[for="${id}"]`);
    if (label) return label.textContent?.trim() || null;
  }
  // Check wrapping label
  const parent = el.closest("label");
  if (parent) {
    const clone = parent.cloneNode(true) as HTMLElement;
    // Remove the input itself to get just the label text
    const inputs = clone.querySelectorAll("input, select, textarea");
    inputs.forEach((i) => i.remove());
    return clone.textContent?.trim() || null;
  }
  // Check aria-label
  const ariaLabel = el.getAttribute("aria-label");
  if (ariaLabel) return ariaLabel;

  return null;
}

export function linearizeHTML(html: string): ScreenReaderNode[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const nodes: ScreenReaderNode[] = [];

  function walk(el: Element) {
    // Skip hidden elements
    if (
      el.getAttribute("aria-hidden") === "true" ||
      (el as HTMLElement).hidden
    ) {
      return;
    }

    const tagName = el.tagName;
    const role = el.getAttribute("role");

    // Landmarks
    if (
      tagName === "HEADER" ||
      role === "banner"
    ) {
      nodes.push({
        type: "landmark",
        announcement: `Banner${el.getAttribute("aria-label") ? ": " + el.getAttribute("aria-label") : ""}`,
        issues: [],
      });
    } else if (tagName === "NAV" || role === "navigation") {
      const label = el.getAttribute("aria-label");
      nodes.push({
        type: "landmark",
        announcement: `Navigation${label ? ": " + label : ""}`,
        issues: label ? [] : ["Navigation without aria-label"],
      });
    } else if (tagName === "MAIN" || role === "main") {
      nodes.push({
        type: "landmark",
        announcement: "Main content",
        issues: [],
      });
    } else if (tagName === "FOOTER" || role === "contentinfo") {
      nodes.push({
        type: "landmark",
        announcement: "Footer",
        issues: [],
      });
    }

    // Headings
    if (/^H[1-6]$/.test(tagName)) {
      const level = tagName[1];
      nodes.push({
        type: "heading",
        announcement: `Heading level ${level}: ${el.textContent?.trim()}`,
        issues: [],
      });
      return;
    }

    // Images
    if (tagName === "IMG") {
      const alt = el.getAttribute("alt");
      if (alt === null) {
        nodes.push({
          type: "image",
          announcement: "[image - no description]",
          issues: ["Missing alt text"],
        });
      } else if (alt === "") {
        // Decorative image, skip
        return;
      } else {
        nodes.push({
          type: "image",
          announcement: `Image: ${alt}`,
          issues: [],
        });
      }
      return;
    }

    // Buttons
    if (tagName === "BUTTON" || role === "button") {
      const label =
        el.getAttribute("aria-label") || el.textContent?.trim() || "";
      if (!label) {
        nodes.push({
          type: "button",
          announcement: "Button (no label)",
          issues: ["Unlabeled button"],
        });
      } else {
        nodes.push({
          type: "button",
          announcement: `Button: ${label}`,
          issues: [],
        });
      }
      return;
    }

    // Links
    if (tagName === "A" && el.getAttribute("href")) {
      const text = el.textContent?.trim() || "";
      const issues: string[] = [];
      if (!text) {
        issues.push("Empty link text");
      } else if (
        ["click here", "read more", "here", "link"].includes(
          text.toLowerCase()
        )
      ) {
        issues.push("Non-descriptive link text");
      }
      nodes.push({
        type: "link",
        announcement: `Link: ${text || "[empty]"}`,
        issues,
      });
      return;
    }

    // Form inputs
    if (
      tagName === "INPUT" ||
      tagName === "SELECT" ||
      tagName === "TEXTAREA"
    ) {
      const inputType = el.getAttribute("type") || "text";
      const label = getAssociatedLabel(el, doc);
      if (!label) {
        nodes.push({
          type: "input",
          announcement: `${inputType} input (no label)`,
          issues: ["Missing form label"],
        });
      } else {
        nodes.push({
          type: "input",
          announcement: `${label}: ${inputType} input`,
          issues: [],
        });
      }
      return;
    }

    // Lists
    if (tagName === "UL" || tagName === "OL") {
      const items = el.querySelectorAll(":scope > li");
      nodes.push({
        type: "list",
        announcement: `List with ${items.length} items`,
        issues: [],
      });
    }

    // Divs with onclick (bad pattern)
    if (
      tagName === "DIV" &&
      el.getAttribute("onclick") &&
      !role
    ) {
      nodes.push({
        type: "text",
        announcement: el.textContent?.trim() || "[empty div]",
        issues: ["Interactive div without role - not accessible"],
      });
      return;
    }

    // Recurse into children
    for (const child of el.children) {
      walk(child);
    }

    // Text nodes at this level (only if no children were processed)
    if (el.children.length === 0) {
      const text = el.textContent?.trim();
      if (text && !["SCRIPT", "STYLE"].includes(tagName)) {
        // Only add if not already captured by a specific handler above
        const alreadyCaptured = ["IMG", "BUTTON", "A", "INPUT", "SELECT", "TEXTAREA"].includes(tagName) || /^H[1-6]$/.test(tagName);
        if (!alreadyCaptured) {
          nodes.push({
            type: "text",
            announcement: text,
            issues: [],
          });
        }
      }
    }
  }

  walk(doc.body);
  return nodes;
}
