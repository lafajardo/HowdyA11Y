import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/api/get-user";
import { getSupabase } from "@/lib/supabase";
import { getChallengeBySlug } from "@/data/challenges";

interface LocalChallengeProgress {
  slug: string;
  completed: boolean;
  score: number;
  hintsUsed: number;
  attempts: number;
  completedAt?: string;
}

export async function POST(request: Request) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const localChallenges: Record<string, LocalChallengeProgress> =
    body.challenges ?? {};

  const supabase = getSupabase();

  // Fetch existing server progress
  const { data: serverRows } = await supabase
    .from("challenge_progress")
    .select("*")
    .eq("user_id", user.id);

  const serverMap: Record<string, typeof serverRows extends (infer T)[] | null ? T : never> = {};
  for (const row of serverRows ?? []) {
    serverMap[row.slug] = row;
  }

  // Merge: for each slug, keep the higher score
  const allSlugs = new Set([
    ...Object.keys(localChallenges),
    ...Object.keys(serverMap),
  ]);

  const upsertRows: Array<{
    user_id: string;
    slug: string;
    completed: boolean;
    score: number;
    hints_used: number;
    attempts: number;
    completed_at: string | null;
    updated_at: string;
  }> = [];

  const mergedChallenges: Record<string, LocalChallengeProgress> = {};

  for (const slug of allSlugs) {
    // Validate slug
    if (!getChallengeBySlug(slug)) continue;

    const local = localChallenges[slug];
    const server = serverMap[slug];

    const localScore = local?.score ?? 0;
    const serverScore = server?.score ?? 0;

    // Pick the version with the higher score
    const useLocal = localScore > serverScore;

    const merged = {
      slug,
      completed: useLocal
        ? (local?.completed ?? false)
        : (server?.completed ?? false),
      score: Math.max(localScore, serverScore),
      hintsUsed: useLocal
        ? (local?.hintsUsed ?? 0)
        : (server?.hints_used ?? 0),
      attempts: Math.max(local?.attempts ?? 0, server?.attempts ?? 0),
      completedAt: useLocal
        ? (local?.completedAt ?? null)
        : (server?.completed_at ?? null),
    };

    mergedChallenges[slug] = {
      slug: merged.slug,
      completed: merged.completed,
      score: merged.score,
      hintsUsed: merged.hintsUsed,
      attempts: merged.attempts,
      completedAt: merged.completedAt ?? undefined,
    };

    upsertRows.push({
      user_id: user.id,
      slug: merged.slug,
      completed: merged.completed,
      score: merged.score,
      hints_used: merged.hintsUsed,
      attempts: merged.attempts,
      completed_at: merged.completedAt,
      updated_at: new Date().toISOString(),
    });
  }

  // Batch upsert
  if (upsertRows.length > 0) {
    const { error } = await supabase
      .from("challenge_progress")
      .upsert(upsertRows, { onConflict: "user_id,slug" });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  // Recalculate total score
  const totalScore = Object.values(mergedChallenges).reduce(
    (sum, c) => sum + c.score,
    0
  );

  await supabase
    .from("users")
    .update({
      total_score: totalScore,
      last_visited: body.lastVisited ?? user.last_visited,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  return NextResponse.json({
    challenges: mergedChallenges,
    totalScore,
    lastVisited: body.lastVisited ?? user.last_visited,
  });
}
