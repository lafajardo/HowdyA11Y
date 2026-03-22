# Howdy, A11y 🤠

> **Wrangle the web into shape.** An interactive, gamified platform for learning WCAG accessibility standards through hands-on challenges and empathy simulations.

![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.2-38BDF8?logo=tailwindcss)
![Anthropic](https://img.shields.io/badge/Claude_AI-Mentor-D97706?logo=anthropic)

---

## Overview

**Howdy A11y** is an educational web application that teaches [WCAG 2.1](https://www.w3.org/TR/WCAG21/) (Web Content Accessibility Guidelines) through a gamified "Western frontier" adventure. Instead of reading dry documentation, developers become accessibility bounty hunters - tracking down and fixing accessibility issues across 21 interactive challenges.

The four WCAG principles (Perceivable, Operable, Understandable, Robust) are reimagined as bounties, each with escalating difficulty and an AI-powered "Trail Guide" mentor available throughout.

### Why this approach?

Traditional accessibility education is often passive. This platform builds real skills through:

- **Empathy simulations** - Experience the web as users with visual, motor, and cognitive disabilities
- **Code challenges** - Fix real accessibility bugs in a live code editor
- **Immediate feedback** - Validation engine gives instant pass/fail results with explanations
- **Unlock progression** - Empathy-first design ensures developers understand _why_ before fixing _how_
- **AI mentorship** - Ask Claude anything about WCAG concepts, get contextual hints, or request explanations

---

## Features

- **4 Bounties, 21 Challenges** covering all WCAG POUR principles
- **3 Challenge Modes**: Code Editor, UI Controls, Empathy Simulation
- **Progression Lock**: Complete the empathy challenge to unlock side quests; complete side quests to unlock the boss challenge
- **Scoring System**: 0 - 100 points per challenge, with penalties for hints used
- **AI Trail Guide**: Powered by Anthropic Claude - answers WCAG questions, provides hints, and explains concepts
- **Progress Tracking**: Saved to localStorage with cross-tab sync
- **Accessibility-First Design**: The app itself is WCAG-compliant (skip nav, ARIA, focus management, reduced motion support)

---

## Screenshots

> _Add screenshots here once deployed (home page, a challenge page, the empathy simulation, the AI chat)_

---

## Tech Stack

| Layer       | Technology              | Version     |
| ----------- | ----------------------- | ----------- |
| Framework   | Next.js (App Router)    | 16.1.6      |
| UI Library  | React                   | 19.2.4      |
| Language    | TypeScript              | 5.9.3       |
| Styling     | Tailwind CSS (PostCSS)  | 4.2.1       |
| Code Editor | CodeMirror 6            | 6.x         |
| AI          | Anthropic Claude API    | SDK ^0.78.0 |
| Markdown    | react-markdown          | ^10.1.0     |
| Build       | Turbopack (via Next.js) | -           |

---

## WCAG Structure

The app maps all four WCAG principles (POUR) to themed bounties:

### Bounty 1 - Perceivable Posse (P)

> Can all users perceive your content?

| Challenge                 | Type       | Slug                     |
| ------------------------- | ---------- | ------------------------ |
| Blurred Vision Simulation | Empathy    | `blur-vision-experience` |
| Color Contrast            | Side Quest | `color-contrast`         |
| Missing Alt Text          | Side Quest | `missing-alt-text`       |
| Missing Captions          | Side Quest | `missing-captions`       |
| Color as Only Meaning     | Side Quest | `color-only-meaning`     |
| Text Resize & Reflow      | **Boss**   | `text-resize-reflow`     |

### Bounty 2 - Operable Outlaws (O)

> Can all users operate your interface?

| Challenge                | Type       | Slug                       |
| ------------------------ | ---------- | -------------------------- |
| Keyboard-Only Experience | Empathy    | `keyboard-only-experience` |
| Keyboard Navigation      | Side Quest | `keyboard-navigation`      |
| Skip Navigation          | Side Quest | `skip-navigation`          |
| Timing & Autoplay        | Side Quest | `timing-autoplay`          |
| Touch Target Size        | Side Quest | `touch-target-size`        |
| Keyboard Traps           | **Boss**   | `keyboard-traps`           |

### Bounty 3 - Understandable Union (U)

> Can all users understand your content and UI?

| Challenge                  | Type       | Slug                         |
| -------------------------- | ---------- | ---------------------------- |
| Color Blindness Experience | Empathy    | `color-blindness-experience` |
| Form Labels                | Side Quest | `form-labels`                |
| Language Attribute         | Side Quest | `language-attribute`         |
| Inconsistent Navigation    | Side Quest | `inconsistent-navigation`    |
| Error Identification       | **Boss**   | `error-identification`       |

### Bounty 4 - Robust Rangers (R)

> Is your content robust enough for assistive technologies?

| Challenge                | Type       | Slug                       |
| ------------------------ | ---------- | -------------------------- |
| Screen Reader Experience | Empathy    | `screen-reader-experience` |
| ARIA Landmarks           | Side Quest | `aria-landmarks`           |
| Invalid ARIA             | Side Quest | `invalid-aria`             |
| Name, Role, Value        | **Boss**   | `name-role-value`          |

---

## Challenge Types

### Code Editor Mode

Developers fix broken HTML in a live [CodeMirror 6](https://codemirror.net/) editor. The validation engine checks the code against accessibility rules and gives real-time pass/fail feedback.

Used for: keyboard navigation, skip links, form labels, ARIA landmarks, language attributes, alt text, and more.

### UI Controls Mode

Interactive controls (color pickers, sliders, dropdowns) let developers adjust page properties and see the result in a live preview. The validation engine checks contrast ratios and CSS properties.

Used for: color contrast fixes, touch target sizing, and similar visual/layout adjustments.

### Experience / Empathy Mode

Multi-phase simulations that apply real accessibility barriers to the interface:

- **Blur effect** - Simulates reduced visual acuity (CSS `filter: blur()`)
- **Color blindness filters** - Protanopia and Deuteranopia via SVG `feColorMatrix`
- **Keyboard-only mode** - Mouse is disabled; navigate with Tab/Enter/Space
- **Screen reader view** - Text-only rendering of page content

Each simulation walks through three phases: experience the barrier → understand the impact → see the accessible solution.

---

## Getting Started

### Prerequisites

- Node.js 18+
- An [Anthropic API key](https://console.anthropic.com/) (required for the AI Trail Guide)

### Installation

```bash
git clone <repo-url>
cd WCAG
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

The AI mentor (Trail Guide) will not function without this key. All other features work without it.

### Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The app uses Next.js Turbopack for fast development builds.

### Other Scripts

```bash
npm run build    # Production build
npm start        # Start production server
npm run lint     # ESLint
```

---

## Project Structure

```
src/
├── app/                        # Next.js App Router
│   ├── api/ai/                 # AI API routes
│   │   ├── chat/route.ts       # Mentor Chat endpoint
│   │   ├── explain/route.ts    # Concept explanation endpoint
│   │   └── hint/route.ts       # Challenge hint endpoint
│   ├── bounty/[id]/            # Bounty overview pages (4 bounties)
│   ├── challenges/[slug]/      # Individual challenge pages (21 challenges)
│   ├── progress/               # Trail Map  -  overall progress dashboard
│   ├── about/                  # Campfire  -  WCAG educational content
│   ├── layout.tsx              # Root layout with context providers
│   ├── page.tsx                # Home page (bounty selection)
│   └── globals.css             # Theme variables and global styles
│
├── components/
│   ├── ai/                     # MentorChat, ExplainButton, AIHintButton
│   ├── challenge/              # ChallengeShell and challenge-specific UIs
│   ├── editor/                 # CodeMirror integration (CodeEditor.tsx)
│   ├── layout/                 # Header, Footer, SkipNav
│   └── ui/                     # PrincipleIcon and shared UI utilities
│
├── context/
│   ├── ProgressContext.tsx     # User progress state (localStorage)
│   └── ChallengeContext.tsx    # Current challenge state for AI context
│
├── data/
│   ├── bounties.ts             # Bounty metadata (id, title, icon, color)
│   ├── principles.ts           # WCAG principles information
│   └── challenges/
│       ├── types.ts            # TypeScript interfaces for all challenge types
│       ├── index.ts            # Challenge registry and lookup functions
│       ├── perceivable/        # 6 challenge definitions
│       ├── operable/           # 6 challenge definitions
│       ├── understandable/     # 5 challenge definitions
│       └── robust/             # 4 challenge definitions
│
└── lib/
    ├── ai/
    │   ├── anthropic-client.ts # Claude API wrapper
    │   ├── prompts.ts          # System prompts for each AI endpoint
    │   └── rate-limit.ts       # IP-based rate limiting
    ├── simulations/
    │   ├── colorblind-filters.ts  # SVG feColorMatrix filters
    │   └── blur-effects.ts        # CSS blur simulation
    └── validation/
        └── engine.ts           # Validation rule engine (contrast, HTML, custom)
```

---

## AI Integration

The app integrates Anthropic Claude via three API routes, all rate-limited by IP address:

### `POST /api/ai/chat` - Trail Guide Chat

A floating mentor chat panel (bottom-right of every page) answers general WCAG questions. When the user is on a challenge page, the current challenge context is injected into the system prompt so Claude can give relevant, specific guidance.

### `POST /api/ai/explain` - Concept Explanation

The **Explain** button on challenge pages sends the current challenge's accessibility concept to Claude for a plain-language explanation tailored to the specific scenario.

### `POST /api/ai/hint` - Challenge Hints

The **Get a Hint** button provides progressive hints for the current challenge. Each hint used deducts points from the final score (penalty varies by difficulty).

All three endpoints use structured system prompts that frame Claude as a knowledgeable but encouraging Western-themed mentor, "the Trail Guide."

---

## Accessibility

This app practices what it teaches. Key WCAG implementations include:

| Feature                | Implementation                                                             |
| ---------------------- | -------------------------------------------------------------------------- |
| Skip Navigation        | Hidden link visible on keyboard focus, jumps to `#main-content`            |
| Semantic HTML          | Proper landmark regions (`<main>`, `<nav>`, `<header>`, `<footer>`)        |
| Heading Hierarchy      | Logical `h1` → `h2` → `h3` structure across all pages                      |
| ARIA Attributes        | `aria-label`, `aria-expanded`, `aria-live`, `role="dialog"` throughout     |
| Focus Management       | Focus trap in modal dialogs; visible `:focus-visible` outlines (3px solid) |
| Color Contrast         | Theme colors meet WCAG AA contrast ratios                                  |
| Reduced Motion         | `prefers-reduced-motion` disables all CSS transitions and animations       |
| Screen Reader Support  | `.sr-only` class for visually-hidden text; `aria-live` regions for chat    |
| Keyboard Accessibility | All interactive elements reachable and operable via keyboard               |

---

## Contributing

Contributions are welcome! Some good areas to explore:

- **New challenges** - Add challenges for uncovered WCAG success criteria
- **Simulation improvements** - More realistic or varied empathy simulations
- **Validation rules** - More specific or nuanced accessibility checks
- **Localization** - Translations for non-English speaking developers

When adding challenges, see the `Challenge` interface in [src/data/challenges/types.ts](src/data/challenges/types.ts) and follow the existing patterns in any of the four principle directories.

---

## License

MIT
