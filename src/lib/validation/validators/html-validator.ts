export function validateHTMLAttribute(
  html: string,
  params: {
    selector: string;
    attribute: string;
    mustExist?: boolean;
    mustBeNonEmpty?: boolean;
    expectedValue?: string;
  }
): { passed: boolean; message: string } {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const elements = doc.querySelectorAll(params.selector);

  if (elements.length === 0) {
    return {
      passed: false,
      message: `No elements matching "${params.selector}" found in the document.`,
    };
  }

  for (const el of elements) {
    const value = el.getAttribute(params.attribute);

    if (params.mustExist && value === null) {
      return {
        passed: false,
        message: `<${el.tagName.toLowerCase()}> is missing the "${params.attribute}" attribute.`,
      };
    }

    if (params.mustBeNonEmpty && (value === null || value.trim() === "")) {
      return {
        passed: false,
        message: `<${el.tagName.toLowerCase()}> has an empty "${params.attribute}" attribute.`,
      };
    }

    if (params.expectedValue !== undefined && value !== params.expectedValue) {
      return {
        passed: false,
        message: `<${el.tagName.toLowerCase()}> has ${params.attribute}="${value}" but expected "${params.expectedValue}".`,
      };
    }
  }

  return {
    passed: true,
    message: `All ${params.selector} elements have the correct "${params.attribute}" attribute.`,
  };
}

export function validateHTMLElementExists(
  html: string,
  params: { selector: string }
): { passed: boolean; message: string } {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const elements = doc.querySelectorAll(params.selector);

  if (elements.length === 0) {
    return {
      passed: false,
      message: `No <${params.selector}> element found. Add one to the document.`,
    };
  }

  return {
    passed: true,
    message: `Found ${elements.length} <${params.selector}> element(s).`,
  };
}
