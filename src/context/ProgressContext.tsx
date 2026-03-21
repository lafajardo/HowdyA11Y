"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import {
  bounties,
  getBountyForChallenge,
  type BountyId,
} from "@/data/bounties";

const STORAGE_KEY = "wcag-learn-progress";

interface ChallengeProgress {
  slug: string;
  completed: boolean;
  score: number;
  hintsUsed: number;
  attempts: number;
  completedAt?: string;
}

interface UserProgress {
  challenges: Record<string, ChallengeProgress>;
  totalScore: number;
  lastVisited?: string;
}

interface BountyStatus {
  empathyDone: boolean;
  sidesDone: number;
  sidesTotal: number;
  bossUnlocked: boolean;
  bossCompleted: boolean;
  allDone: boolean;
}

interface ProgressContextValue {
  progress: UserProgress;
  markComplete: (slug: string, score: number, hintsUsed: number) => void;
  recordAttempt: (slug: string) => void;
  setLastVisited: (slug: string) => void;
  getChallenge: (slug: string) => ChallengeProgress | undefined;
  resetProgress: () => void;
  totalCompleted: number;
  isChallengeUnlocked: (slug: string) => boolean;
  getBountyStatus: (bountyId: BountyId) => BountyStatus;
}

const defaultProgress: UserProgress = {
  challenges: {},
  totalScore: 0,
};

const ProgressContext = createContext<ProgressContextValue | null>(null);

function loadProgress(): UserProgress {
  if (typeof window === "undefined") return defaultProgress;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // Private browsing or corrupted data
  }
  return defaultProgress;
}

function saveProgress(progress: UserProgress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Private browsing mode - silently fail
  }
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<UserProgress>(defaultProgress);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setProgress(loadProgress());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      saveProgress(progress);
    }
  }, [progress, mounted]);

  // Sync across tabs
  useEffect(() => {
    function handleStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          setProgress(JSON.parse(e.newValue));
        } catch {
          // Ignore corrupted data
        }
      }
    }
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const markComplete = useCallback(
    (slug: string, score: number, hintsUsed: number) => {
      setProgress((prev) => {
        const existing = prev.challenges[slug];
        // Keep the best score
        const bestScore =
          existing?.completed && existing.score > score
            ? existing.score
            : score;
        const newChallenges = {
          ...prev.challenges,
          [slug]: {
            slug,
            completed: true,
            score: bestScore,
            hintsUsed,
            attempts: (existing?.attempts ?? 0) + 1,
            completedAt: new Date().toISOString(),
          },
        };
        const totalScore = Object.values(newChallenges).reduce(
          (sum, c) => sum + c.score,
          0
        );
        return { ...prev, challenges: newChallenges, totalScore };
      });
    },
    []
  );

  const recordAttempt = useCallback((slug: string) => {
    setProgress((prev) => {
      const existing = prev.challenges[slug];
      return {
        ...prev,
        challenges: {
          ...prev.challenges,
          [slug]: {
            slug,
            completed: existing?.completed ?? false,
            score: existing?.score ?? 0,
            hintsUsed: existing?.hintsUsed ?? 0,
            attempts: (existing?.attempts ?? 0) + 1,
          },
        },
      };
    });
  }, []);

  const setLastVisited = useCallback((slug: string) => {
    setProgress((prev) => ({ ...prev, lastVisited: slug }));
  }, []);

  const getChallenge = useCallback(
    (slug: string) => progress.challenges[slug],
    [progress]
  );

  const resetProgress = useCallback(() => {
    setProgress(defaultProgress);
  }, []);

  const totalCompleted = Object.values(progress.challenges).filter(
    (c) => c.completed
  ).length;

  const isChallengeUnlocked = useCallback(
    (slug: string): boolean => {
      const bounty = getBountyForChallenge(slug);
      if (!bounty) return true; // not in any bounty = always unlocked

      // Empathy challenges are always unlocked
      if (bounty.empathySlug === slug) return true;

      // Side quests unlock after empathy is completed
      if (bounty.sideQuestSlugs.includes(slug)) {
        return !!progress.challenges[bounty.empathySlug]?.completed;
      }

      // Boss unlocks after all side quests are completed
      if (bounty.bossSlug === slug) {
        return bounty.sideQuestSlugs.every(
          (s) => !!progress.challenges[s]?.completed
        );
      }

      return true;
    },
    [progress]
  );

  const getBountyStatus = useCallback(
    (bountyId: BountyId): BountyStatus => {
      const bounty = bounties.find((b) => b.id === bountyId);
      if (!bounty) {
        return {
          empathyDone: false,
          sidesDone: 0,
          sidesTotal: 0,
          bossUnlocked: false,
          bossCompleted: false,
          allDone: false,
        };
      }

      const empathyDone = !!progress.challenges[bounty.empathySlug]?.completed;
      const sidesDone = bounty.sideQuestSlugs.filter(
        (s) => !!progress.challenges[s]?.completed
      ).length;
      const sidesTotal = bounty.sideQuestSlugs.length;
      const bossUnlocked = sidesDone === sidesTotal;
      const bossCompleted = !!progress.challenges[bounty.bossSlug]?.completed;
      const allDone = empathyDone && bossUnlocked && bossCompleted;

      return { empathyDone, sidesDone, sidesTotal, bossUnlocked, bossCompleted, allDone };
    },
    [progress]
  );

  return (
    <ProgressContext.Provider
      value={{
        progress,
        markComplete,
        recordAttempt,
        setLastVisited,
        getChallenge,
        resetProgress,
        totalCompleted,
        isChallengeUnlocked,
        getBountyStatus,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error("useProgress must be used within a ProgressProvider");
  }
  return context;
}
