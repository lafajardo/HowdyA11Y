import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/api/get-user";
import { getSupabase } from "@/lib/supabase";

export async function PUT(request: Request) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await request.json();
  if (!slug || typeof slug !== "string") {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }

  const supabase = getSupabase();
  await supabase
    .from("users")
    .update({ last_visited: slug, updated_at: new Date().toISOString() })
    .eq("id", user.id);

  return NextResponse.json({ success: true });
}
