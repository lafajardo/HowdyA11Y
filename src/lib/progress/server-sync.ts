import type { UserProgress } from "./local-storage";

export async function fetchServerProgress(): Promise<UserProgress | null> {
  try {
    const res = await fetch("/api/progress");
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function syncProgressToServer(
  localProgress: UserProgress
): Promise<UserProgress | null> {
  try {
    const res = await fetch("/api/progress/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(localProgress),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function updateChallengeOnServer(data: {
  slug: string;
  completed: boolean;
  score: number;
  hintsUsed: number;
  attempts: number;
  completedAt?: string;
}): Promise<void> {
  try {
    await fetch("/api/progress", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  } catch {
    // Fire-and-forget: silently fail
  }
}

export async function updateLastVisitedOnServer(slug: string): Promise<void> {
  try {
    await fetch("/api/progress/last-visited", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    });
  } catch {
    // Fire-and-forget
  }
}

export async function resetProgressOnServer(): Promise<void> {
  try {
    await fetch("/api/progress/reset", { method: "POST" });
  } catch {
    // Fire-and-forget
  }
}
