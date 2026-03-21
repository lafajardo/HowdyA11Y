import type { ChallengeDefinition } from "../types";

export const languageAttribute: ChallengeDefinition = {
  slug: "language-attribute",
  title: "Set the Page Language",
  principle: "understandable",
  wcagRef: {
    criterion: "3.1.1",
    title: "Language of Page",
    level: "A",
    url: "https://www.w3.org/WAI/WCAG21/Understanding/language-of-page.html",
  },
  difficulty: "beginner",
  mode: "code-editor",
  maxScore: 100,
  description:
    "This page is missing the lang attribute on the <html> element, and has a paragraph in Spanish without a lang attribute. Screen readers will try to read everything in their default language, mangling the pronunciation.",
  realWorldImpact:
    "Screen readers use the lang attribute to switch pronunciation engines. Without it, a screen reader set to English will attempt to read Spanish text with English pronunciation rules, making it completely unintelligible.",
  instructions:
    "Add `lang=\"en\"` to the `<html>` element for the page's primary language. Add `lang=\"es\"` to the Spanish paragraph so screen readers switch pronunciation for that section.",
  initialCode: `<html>
<head>
  <title>Global Welcome Page</title>
</head>
<body style="font-family:system-ui,sans-serif;padding:2rem;max-width:600px;">
  <h1>Welcome to Our Global Platform</h1>

  <p>We serve customers around the world and are committed to providing
     the best experience in your language.</p>

  <h2>Message from our Spanish-speaking team:</h2>
  <p>Bienvenidos a nuestra plataforma. Estamos comprometidos a brindarle
     la mejor experiencia posible. No dude en contactarnos si necesita
     ayuda en español.</p>

  <h2>Contact Us</h2>
  <p>Reach out to our support team at support@example.com</p>
</body>
</html>`,
  solutionCode: `<html lang="en">
<head>
  <title>Global Welcome Page</title>
</head>
<body style="font-family:system-ui,sans-serif;padding:2rem;max-width:600px;">
  <h1>Welcome to Our Global Platform</h1>

  <p>We serve customers around the world and are committed to providing
     the best experience in your language.</p>

  <h2>Message from our Spanish-speaking team:</h2>
  <p lang="es">Bienvenidos a nuestra plataforma. Estamos comprometidos a brindarle
     la mejor experiencia posible. No dude en contactarnos si necesita
     ayuda en español.</p>

  <h2>Contact Us</h2>
  <p>Reach out to our support team at support@example.com</p>
</body>
</html>`,
  validationRules: [
    {
      id: "html-has-lang",
      type: "html-attribute",
      description: "The <html> element must have a lang attribute",
      params: {
        selector: "html",
        attribute: "lang",
        mustBeNonEmpty: true,
      },
    },
    {
      id: "spanish-has-lang",
      type: "custom",
      description: "The Spanish paragraph must have lang=\"es\"",
      params: {
        check: "has-lang-on-foreign-text",
      },
    },
  ],
  hints: [
    {
      text: "The lang attribute goes on the <html> element to declare the page's primary language. Use ISO 639-1 codes like 'en', 'es', 'fr'.",
      scorePenalty: 10,
    },
    {
      text: "When content in a different language appears within the page, wrap it in an element with the appropriate lang attribute.",
      scorePenalty: 15,
    },
    {
      text: "Add lang=\"en\" to <html> and lang=\"es\" to the paragraph containing Spanish text.",
      scorePenalty: 25,
    },
  ],
  order: 3,
};
