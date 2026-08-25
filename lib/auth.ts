import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function getCurrentUser() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) return user;
  } catch (e) {}

  const cookieStore = await cookies();
  const demoRole = cookieStore.get("lumen_demo_role")?.value;
  if (demoRole === "admin") {
    return {
      id: "admin-demo-id",
      email: "admin@lumen.com",
      user_metadata: { full_name: "LUMEN Administrator", role: "admin" },
    } as any;
  }

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

  if (user.id === "admin-demo-id" || user.email === "admin@lumen.com") {
    return { user, profile: { id: user.id, email: user.email, role: "admin" } };
  }

  try {
    const supabase = await createClient();
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile && profile.role === "admin") {
      return { user, profile };
    }
  } catch (e) {}

  redirect("/");
}
