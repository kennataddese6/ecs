import { createAdminClient } from "@/lib/supabase/admin";

export interface ContactMessage {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  topic: string;
  message: string;
  status: string;
  created_at: string;
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  try {
    const adminClient = createAdminClient();
    const { data, error } = await adminClient
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      return data as ContactMessage[];
    }
  } catch (err) {
    console.error("Failed to fetch contact messages from Supabase:", err);
  }

  return [];
}
