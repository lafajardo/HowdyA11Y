import type { ChallengeDefinition } from "../types";

export const inconsistentNavigation: ChallengeDefinition = {
  slug: "inconsistent-navigation",
  title: "Fix Inconsistent Navigation",
  principle: "understandable",
  wcagRef: {
    criterion: "3.2.3",
    title: "Consistent Navigation",
    level: "AA",
    url: "https://www.w3.org/WAI/WCAG21/Understanding/consistent-navigation.html",
  },
  difficulty: "intermediate",
  mode: "ui-controls",
  maxScore: 100,
  description:
    "This website has navigation that changes order and labels on different pages. Users who rely on consistent patterns become disoriented. Fix the navigation to be consistent across all pages.",
  realWorldImpact:
    "Users with cognitive disabilities build mental models of a site's navigation. When nav items change order or wording between pages, they must re-learn the interface each time, causing confusion and frustration.",
  instructions:
    "Ensure navigation items appear in the same order on every page, use consistent labels, and maintain the same structure. Fix the issues shown in the preview.",
  controls: [
    {
      id: "consistentOrder",
      type: "toggle",
      label: "Use consistent item order across pages",
      description: "Keep navigation links in the same order on every page",
      initialValue: false,
    },
    {
      id: "consistentLabels",
      type: "toggle",
      label: "Use consistent labels",
      description: 'Don\'t rename "Products" to "Shop" or "About" to "About Us" on different pages',
      initialValue: false,
    },
    {
      id: "consistentPosition",
      type: "toggle",
      label: "Keep navigation in consistent position",
      description: "Navigation should appear in the same location on every page",
      initialValue: false,
    },
  ],
  renderPreview: (values) => {
    const order1 = values.consistentOrder
      ? ["Home", "Products", "About", "Contact"]
      : ["Home", "Products", "About", "Contact"];
    const order2 = values.consistentOrder
      ? ["Home", "Products", "About", "Contact"]
      : ["Home", "About", "Contact", "Products"];
    const labels2 = values.consistentLabels
      ? { Products: "Products", About: "About" }
      : { Products: "Shop", About: "About Us" };
    const pos = values.consistentPosition ? "left" : "right";

    return `
      <div style="font-family:system-ui,sans-serif;font-size:0.8rem;">
        <div style="border:1px solid #e2e8f0;border-radius:8px;padding:0.75rem;margin-bottom:0.75rem;">
          <div style="font-size:0.7rem;color:#64748b;margin-bottom:0.5rem;font-weight:600;">PAGE 1: Home</div>
          <nav style="display:flex;gap:0.5rem;background:#1e293b;padding:0.5rem;border-radius:4px;">
            ${order1.map((item) => `<span style="color:#93c5fd;padding:0.25rem 0.5rem;font-size:0.75rem;">${item}</span>`).join("")}
          </nav>
          <div style="padding:0.5rem;color:#64748b;font-size:0.75rem;">Page content...</div>
        </div>

        <div style="border:1px solid #e2e8f0;border-radius:8px;padding:0.75rem;margin-bottom:0.75rem;">
          <div style="font-size:0.7rem;color:#64748b;margin-bottom:0.5rem;font-weight:600;">PAGE 2: Products</div>
          <nav style="display:flex;gap:0.5rem;background:#1e293b;padding:0.5rem;border-radius:4px;justify-content:${values.consistentPosition ? "flex-start" : "flex-end"};">
            ${order2.map((item) => {
              const label = item === "Products" ? (labels2.Products) : item === "About" ? (labels2.About) : item;
              return `<span style="color:#93c5fd;padding:0.25rem 0.5rem;font-size:0.75rem;">${label}</span>`;
            }).join("")}
          </nav>
          <div style="padding:0.5rem;color:#64748b;font-size:0.75rem;">Page content...</div>
        </div>

        <div style="border:1px solid ${values.consistentOrder && values.consistentLabels && values.consistentPosition ? "#16a34a" : "#dc2626"};border-radius:8px;padding:0.75rem;background:${values.consistentOrder && values.consistentLabels && values.consistentPosition ? "#f0fdf4" : "#fef2f2"};">
          <div style="font-size:0.75rem;color:${values.consistentOrder && values.consistentLabels && values.consistentPosition ? "#16a34a" : "#dc2626"};font-weight:600;">
            ${values.consistentOrder && values.consistentLabels && values.consistentPosition ? "Navigation is consistent across pages" : "Inconsistencies detected between pages"}
          </div>
        </div>
      </div>
    `;
  },
  validationRules: [
    {
      id: "consistent-order",
      type: "custom",
      description: "Navigation items must appear in the same order on every page",
      params: { controlId: "consistentOrder", expectedValue: true },
    },
    {
      id: "consistent-labels",
      type: "custom",
      description: "Navigation items must use the same labels on every page",
      params: { controlId: "consistentLabels", expectedValue: true },
    },
    {
      id: "consistent-position",
      type: "custom",
      description: "Navigation must appear in the same position on every page",
      params: { controlId: "consistentPosition", expectedValue: true },
    },
  ],
  hints: [
    {
      text: "Consistent navigation means the same items, in the same order, in the same location on every page.",
      scorePenalty: 10,
    },
    {
      text: "Labels like 'Products' should not change to 'Shop' on other pages. Pick one name and use it everywhere.",
      scorePenalty: 15,
    },
    {
      text: "Enable all three toggles: consistent order, consistent labels, and consistent position.",
      scorePenalty: 25,
    },
  ],
  order: 4,
};
