import type { ChallengeDefinition } from "../types";

export const missingAltText: ChallengeDefinition = {
  slug: "missing-alt-text",
  title: "Add Missing Alt Text",
  principle: "perceivable",
  wcagRef: {
    criterion: "1.1.1",
    title: "Non-text Content",
    level: "A",
    url: "https://www.w3.org/WAI/WCAG21/Understanding/non-text-content.html",
  },
  difficulty: "beginner",
  mode: "code-editor",
  maxScore: 100,
  description:
    "This product page has images without alt text. Screen reader users have no idea what these images show. Add descriptive alt attributes to make the content accessible.",
  realWorldImpact:
    "Screen reader users rely entirely on alt text to understand image content. Without it, they hear only 'image' or the file name, making the page confusing and unusable. Alt text also helps when images fail to load and improves SEO.",
  instructions:
    "Add descriptive `alt` attributes to each `<img>` element. Good alt text is concise and describes the content or function of the image. Decorative images should have an empty alt attribute (`alt=\"\"`).",
  initialCode: `<div class="product-page">
  <header>
    <img src="/logo.png" width="120">
    <nav>
      <a href="/">Home</a>
      <a href="/products">Products</a>
    </nav>
  </header>

  <main>
    <h1>Wireless Bluetooth Headphones</h1>
    <img src="/headphones-main.jpg" width="400">

    <p>Premium over-ear headphones with active noise cancellation
       and 30-hour battery life.</p>

    <h2>Features</h2>
    <div class="features">
      <div>
        <img src="/icon-battery.svg" width="48">
        <p>30-hour battery life</p>
      </div>
      <div>
        <img src="/icon-noise-cancel.svg" width="48">
        <p>Active noise cancellation</p>
      </div>
    </div>

    <img src="/decorative-wave.svg" width="100%">
  </main>
</div>`,
  solutionCode: `<div class="product-page">
  <header>
    <img src="/logo.png" width="120" alt="TechStore logo">
    <nav>
      <a href="/">Home</a>
      <a href="/products">Products</a>
    </nav>
  </header>

  <main>
    <h1>Wireless Bluetooth Headphones</h1>
    <img src="/headphones-main.jpg" width="400" alt="Black wireless over-ear headphones with cushioned ear pads">

    <p>Premium over-ear headphones with active noise cancellation
       and 30-hour battery life.</p>

    <h2>Features</h2>
    <div class="features">
      <div>
        <img src="/icon-battery.svg" width="48" alt="">
        <p>30-hour battery life</p>
      </div>
      <div>
        <img src="/icon-noise-cancel.svg" width="48" alt="">
        <p>Active noise cancellation</p>
      </div>
    </div>

    <img src="/decorative-wave.svg" width="100%" alt="">
  </main>
</div>`,
  validationRules: [
    {
      id: "all-imgs-have-alt",
      type: "html-attribute",
      description: "All <img> elements must have an alt attribute",
      params: {
        selector: "img",
        attribute: "alt",
        mustExist: true,
      },
    },
  ],
  hints: [
    {
      text: "Every <img> element needs an alt attribute. Even decorative images need alt=\"\" (empty alt).",
      scorePenalty: 10,
    },
    {
      text: "The product image should describe what the user would see. The logo should include the brand name.",
      scorePenalty: 15,
    },
    {
      text: "Icon images next to text labels are decorative  -  use alt=\"\" since the adjacent text provides the information.",
      scorePenalty: 25,
    },
  ],
  order: 2,
};
