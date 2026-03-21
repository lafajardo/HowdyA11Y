export type BountyId = "perceivable" | "operable" | "understandable" | "robust";

export interface BountyDefinition {
  id: BountyId;
  name: string;
  tagline: string;
  icon: string;
  color: string;
  empathySlug: string;
  sideQuestSlugs: string[];
  bossSlug: string;
}

export const bounties: BountyDefinition[] = [
  {
    id: "perceivable",
    name: "Perceivable Posse",
    tagline: "Can your users see and hear the trail ahead?",
    icon: "lantern",
    color: "#b45309",
    empathySlug: "blur-vision-experience",
    sideQuestSlugs: [
      "color-contrast",
      "missing-alt-text",
      "missing-captions",
      "color-only-meaning",
    ],
    bossSlug: "text-resize-reflow",
  },
  {
    id: "operable",
    name: "Operable Outlaws",
    tagline: "Can every rider navigate the frontier?",
    icon: "horseshoe",
    color: "#15803d",
    empathySlug: "keyboard-only-experience",
    sideQuestSlugs: [
      "keyboard-navigation",
      "skip-navigation",
      "timing-autoplay",
      "touch-target-size",
    ],
    bossSlug: "keyboard-traps",
  },
  {
    id: "understandable",
    name: "Understandable Union",
    tagline: "Is your message clear as a desert sky?",
    icon: "scroll",
    color: "#b91c1c",
    empathySlug: "color-blindness-experience",
    sideQuestSlugs: [
      "form-labels",
      "language-attribute",
      "inconsistent-navigation",
    ],
    bossSlug: "error-identification",
  },
  {
    id: "robust",
    name: "Robust Rangers",
    tagline: "Will your code stand the test of any tool?",
    icon: "star",
    color: "#7e22ce",
    empathySlug: "screen-reader-experience",
    sideQuestSlugs: ["aria-landmarks", "invalid-aria"],
    bossSlug: "name-role-value",
  },
];

export function getBountyById(id: BountyId): BountyDefinition | undefined {
  return bounties.find((b) => b.id === id);
}

export function getBountyForChallenge(
  slug: string
): BountyDefinition | undefined {
  return bounties.find(
    (b) =>
      b.empathySlug === slug ||
      b.sideQuestSlugs.includes(slug) ||
      b.bossSlug === slug
  );
}

export type ChallengeRole = "empathy" | "side-quest" | "boss";

export function getChallengeRole(slug: string): ChallengeRole | undefined {
  for (const b of bounties) {
    if (b.empathySlug === slug) return "empathy";
    if (b.sideQuestSlugs.includes(slug)) return "side-quest";
    if (b.bossSlug === slug) return "boss";
  }
  return undefined;
}

export function getAllBountySlugs(bountyId: BountyId): string[] {
  const b = getBountyById(bountyId);
  if (!b) return [];
  return [b.empathySlug, ...b.sideQuestSlugs, b.bossSlug];
}
