export type ChallengeMode = "code-editor" | "ui-controls" | "experience";
export type WCAGPrinciple = "perceivable" | "operable" | "understandable" | "robust" | "experience";
export type ConformanceLevel = "A" | "AA" | "AAA";
export type Difficulty = "beginner" | "intermediate" | "advanced";
export type ExperienceType = "visual" | "motor" | "screen-reader";

export interface WCAGReference {
  criterion: string;
  title: string;
  level: ConformanceLevel;
  url: string;
}

export interface ChallengeHint {
  text: string;
  scorePenalty: number;
}

export interface UIControl {
  id: string;
  type: "color-picker" | "slider" | "dropdown" | "toggle" | "text-input";
  label: string;
  description: string;
  initialValue: string | number | boolean;
  options?: { label: string; value: string }[];
  min?: number;
  max?: number;
  step?: number;
}

export interface ValidationRule {
  id: string;
  type:
    | "contrast-ratio"
    | "html-attribute"
    | "html-element-exists"
    | "css-property"
    | "aria-attribute"
    | "custom"
    | "task-completion";
  description: string;
  params: Record<string, unknown>;
}

export interface SimulationConfig {
  type: ExperienceType;
  effect:
    | "blur"
    | "protanopia"
    | "deuteranopia"
    | "low-contrast"
    | "no-mouse"
    | "screen-reader-view";
  intensity?: number;
  targetHTML: string;
}

export interface ExperienceTask {
  id: string;
  instruction: string;
  type: "text-match" | "confirmation" | "quiz";
  params: Record<string, unknown>;
}

export interface ExperiencePhase {
  id: string;
  title: string;
  description: string;
  simulation: SimulationConfig;
  tasks: ExperienceTask[];
  revealAfterComplete?: string;
}

export interface ChallengeDefinition {
  slug: string;
  title: string;
  principle: WCAGPrinciple;
  wcagRef: WCAGReference;
  difficulty: Difficulty;
  mode: ChallengeMode;
  maxScore: number;
  estimatedMinutes?: number;
  learningObjectives?: string[];

  // Content
  description: string;
  realWorldImpact: string;
  instructions: string;

  // For code-editor mode
  initialCode?: string;
  solutionCode?: string;

  // For ui-controls mode
  controls?: UIControl[];
  renderPreview?: (values: Record<string, unknown>) => string;

  // For experience mode
  experienceType?: ExperienceType;
  phases?: ExperiencePhase[];
  disclaimer?: string;

  // Validation
  validationRules: ValidationRule[];

  // Hints
  hints: ChallengeHint[];

  // Ordering
  order: number;
}
