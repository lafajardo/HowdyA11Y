import type { ChallengeDefinition, WCAGPrinciple } from "./types";

// Perceivable
import { colorContrast } from "./perceivable/color-contrast";
import { missingAltText } from "./perceivable/missing-alt-text";
import { missingCaptions } from "./perceivable/missing-captions";
import { colorOnlyMeaning } from "./perceivable/color-only-meaning";
import { textResizeReflow } from "./perceivable/text-resize-reflow";

// Operable
import { keyboardNavigation } from "./operable/keyboard-navigation";
import { keyboardTraps } from "./operable/keyboard-traps";
import { skipNavigation } from "./operable/skip-navigation";
import { timingAutoplay } from "./operable/timing-autoplay";
import { touchTargetSize } from "./operable/touch-target-size";

// Understandable
import { formLabels } from "./understandable/form-labels";
import { errorIdentification } from "./understandable/error-identification";
import { languageAttribute } from "./understandable/language-attribute";
import { inconsistentNavigation } from "./understandable/inconsistent-navigation";

// Robust
import { ariaLandmarks } from "./robust/aria-landmarks";
import { invalidAria } from "./robust/invalid-aria";
import { nameRoleValue } from "./robust/name-role-value";

export const allChallenges: ChallengeDefinition[] = [
  // Perceivable
  colorContrast,
  missingAltText,
  missingCaptions,
  colorOnlyMeaning,
  textResizeReflow,
  // Operable
  keyboardNavigation,
  keyboardTraps,
  skipNavigation,
  timingAutoplay,
  touchTargetSize,
  // Understandable
  formLabels,
  errorIdentification,
  languageAttribute,
  inconsistentNavigation,
  // Robust
  ariaLandmarks,
  invalidAria,
  nameRoleValue,
];

export function getChallengeBySlug(
  slug: string
): ChallengeDefinition | undefined {
  return allChallenges.find((c) => c.slug === slug);
}

export function getChallengesByPrinciple(
  principle: WCAGPrinciple
): ChallengeDefinition[] {
  return allChallenges
    .filter((c) => c.principle === principle)
    .sort((a, b) => a.order - b.order);
}

export function getNextChallenge(
  currentSlug: string
): ChallengeDefinition | undefined {
  const currentIndex = allChallenges.findIndex((c) => c.slug === currentSlug);
  if (currentIndex === -1 || currentIndex === allChallenges.length - 1) {
    return undefined;
  }
  return allChallenges[currentIndex + 1];
}

export function getPreviousChallenge(
  currentSlug: string
): ChallengeDefinition | undefined {
  const currentIndex = allChallenges.findIndex((c) => c.slug === currentSlug);
  if (currentIndex <= 0) {
    return undefined;
  }
  return allChallenges[currentIndex - 1];
}
