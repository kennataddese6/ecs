import { createAdminClient } from "@/lib/supabase/admin";

export interface NewsletterSubscriber {
  id: string;
  email: string;
  status: string;
  created_at: string;
}

export async function getNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
  try {
    const adminClient = createAdminClient();
    const { data, error } = await adminClient
      .from("newsletter_subscribers")
      .select("id, email, status, created_at")
      .order("created_at", { ascending: false });

    if (!error && data) {
      return data as NewsletterSubscriber[];
    }
  } catch (err) {
    console.error("Failed to fetch subscribers from Supabase:", err);
  }

  return [];
}
