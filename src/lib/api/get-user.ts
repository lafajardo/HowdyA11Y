import { auth0 } from "@/lib/auth0";
import { getSupabase } from "@/lib/supabase";

export interface DBUser {
  id: string;
  auth0_id: string;
  email: string;
  name: string | null;
  picture: string | null;
  total_score: number;
  last_visited: string | null;
}

/**
 * Gets the authenticated user from the Auth0 session and ensures
 * a corresponding row exists in the Supabase users table (JIT provisioning).
 * Returns null if not authenticated.
 */
export async function getAuthenticatedUser(): Promise<DBUser | null> {
  const session = await auth0.getSession();
  if (!session?.user) return null;

  const { sub, email, name, picture } = session.user;

  // Try to find existing user
  const supabase = getSupabase();

  const { data: existing } = await supabase
    .from("users")
    .select("*")
    .eq("auth0_id", sub)
    .single();

  if (existing) return existing as DBUser;

  // JIT provisioning: create user on first authenticated request
  const { data: created, error } = await supabase
    .from("users")
    .insert({
      auth0_id: sub,
      email: email ?? "",
      name: name ?? null,
      picture: picture ?? null,
    })
    .select()
    .single();

  if (error) {
    // Handle race condition: another request may have created the user
    if (error.code === "23505") {
      const { data: retried } = await supabase
        .from("users")
        .select("*")
        .eq("auth0_id", sub)
        .single();
      return retried as DBUser;
    }
    throw error;
  }

  return created as DBUser;
}
