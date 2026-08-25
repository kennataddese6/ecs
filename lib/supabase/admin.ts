import { createClient } from "@supabase/supabase-js";

/**
 * Creates a Supabase Admin client with service-role privileges.
 * WARNING: This client bypasses Row Level Security (RLS).
 * MUST ONLY be called in server-side contexts (Server Actions, Route Handlers, background jobs).
 * NEVER import or expose in client components.
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables."
    );
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
