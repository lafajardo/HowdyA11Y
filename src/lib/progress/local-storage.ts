const STORAGE_KEY = "wcag-learn-progress";
const SYNCED_KEY = "wcag-learn-synced";

export interface ChallengeProgress {
  slug: string;
  completed: boolean;
  score: number;
  hintsUsed: number;
  attempts: number;
  completedAt?: string;
}

export interface UserProgress {
  challenges: Record<string, ChallengeProgress>;
  totalScore: number;
  lastVisited?: string;
}

export const defaultProgress: UserProgress = {
  challenges: {},
  totalScore: 0,
};

export function loadProgress(): UserProgress {
  if (typeof window === "undefined") return defaultProgress;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // Private browsing or corrupted data
  }
  return defaultProgress;
}

export function saveProgress(progress: UserProgress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Private browsing mode - silently fail
  }
}

export function hasLocalProgress(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return false;
    const data = JSON.parse(stored) as UserProgress;
    return Object.keys(data.challenges).length > 0;
  } catch {
    return false;
  }
}

export function hasSynced(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(SYNCED_KEY) === "true";
}

export function markSynced() {
  try {
    localStorage.setItem(SYNCED_KEY, "true");
  } catch {
    // Silently fail
  }
}
