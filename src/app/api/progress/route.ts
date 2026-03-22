import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/api/get-user";
import { getSupabase } from "@/lib/supabase";
import { getChallengeBySlug } from "@/data/challenges";

export async function GET() {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabase();
  const { data: rows } = await supabase
    .from("challenge_progress")
    .select("*")
    .eq("user_id", user.id);

  const challenges: Record<string, unknown> = {};
  for (const row of rows ?? []) {
    challenges[row.slug] = {
      slug: row.slug,
      completed: row.completed,
      score: row.score,
      hintsUsed: row.hints_used,
      attempts: row.attempts,
      completedAt: row.completed_at,
    };
  }

  return NextResponse.json({
    challenges,
    totalScore: user.total_score,
    lastVisited: user.last_visited,
  });
}

export async function PUT(request: Request) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { slug, completed, score, hintsUsed, attempts, completedAt } = body;

  // Validate slug exists
  if (!slug || !getChallengeBySlug(slug)) {
    return NextResponse.json({ error: "Invalid challenge slug" }, { status: 400 });
  }

  const supabase = getSupabase();
  const { error } = await supabase
    .from("challenge_progress")
    .upsert(
      {
        user_id: user.id,
        slug,
        completed: completed ?? false,
        score: score ?? 0,
        hints_used: hintsUsed ?? 0,
        attempts: attempts ?? 0,
        completed_at: completedAt ?? null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,slug" }
    );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Recalculate total score
  const { data: allRows } = await supabase
    .from("challenge_progress")
    .select("score")
    .eq("user_id", user.id);

  const totalScore = (allRows ?? []).reduce((sum, r) => sum + r.score, 0);

  await supabase
    .from("users")
    .update({ total_score: totalScore, updated_at: new Date().toISOString() })
    .eq("id", user.id);

  return NextResponse.json({ success: true, totalScore });
}
