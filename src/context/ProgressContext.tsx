"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

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

interface ProgressContextValue {
  progress: UserProgress;
  markComplete: (slug: string, score: number, hintsUsed: number) => void;
  recordAttempt: (slug: string) => void;
  setLastVisited: (slug: string) => void;
  getChallenge: (slug: string) => ChallengeProgress | undefined;
  resetProgress: () => void;
  totalCompleted: number;
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
