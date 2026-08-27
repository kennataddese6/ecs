import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function getCurrentUser() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) return user;
  } catch (e) {}

  return null;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}

export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login?redirectTo=/admin");
  }

  // Check role in user_metadata first
  if (user.user_metadata?.role === "admin") {
    return { user, profile: { id: user.id, email: user.email, role: "admin" } };
  }

  try {
    const supabase = await createClient();
    const { data: profile } = await supabase
      .from("profiles")
      .select("id, email, role")
      .eq("id", user.id)
      .single();

    if (profile && profile.role === "admin") {
      return { user, profile };
    }
  } catch (e) {}

  redirect("/");
}
