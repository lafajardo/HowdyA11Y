"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

export interface ChallengeContextData {
  slug: string;
  title: string;
  description: string;
  instructions: string;
  wcagRef: { criterion: string; title: string; level: string };
  difficulty: string;
  mode: string;
  currentCode?: string;
  controlValues?: Record<string, unknown>;
  validationResult?: {
    allPassed: boolean;
    results: Array<{ ruleId: string; passed: boolean; message: string }>;
  };
}

interface ChallengeContextValue {
  challengeContext: ChallengeContextData | null;
  setChallengeContext: (ctx: ChallengeContextData | null) => void;
}

const ChallengeContext = createContext<ChallengeContextValue | null>(null);

export function ChallengeContextProvider({ children }: { children: ReactNode }) {
  const [challengeContext, setChallengeContext] =
    useState<ChallengeContextData | null>(null);

  return (
    <ChallengeContext.Provider value={{ challengeContext, setChallengeContext }}>
      {children}
    </ChallengeContext.Provider>
  );
}

export function useChallengeContext() {
  const context = useContext(ChallengeContext);
  if (!context) {
    throw new Error(
      "useChallengeContext must be used within a ChallengeContextProvider"
    );
  }
  return context;
}
