import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/api/get-user";
import { getSupabase } from "@/lib/supabase";

export async function POST() {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabase();

  // Delete all challenge progress rows
  await supabase
    .from("challenge_progress")
    .delete()
    .eq("user_id", user.id);

  // Reset total score
  await supabase
    .from("users")
    .update({
      total_score: 0,
      last_visited: null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  return NextResponse.json({ success: true });
}
