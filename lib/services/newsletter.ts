import { createAdminClient } from "@/lib/supabase/admin";

export interface NewsletterSubscriber {
  id: string;
  email: string;
  status: string;
  created_at: string;
}

export const DEMO_SUBSCRIBERS: NewsletterSubscriber[] = [
  {
    id: "sub-1",
    email: "ethiopian.buna.fan@gmail.com",
    status: "ACTIVE",
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: "sub-2",
    email: "habesha.fashion.uk@outlook.com",
    status: "ACTIVE",
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: "sub-3",
    email: "selam.taddese@enatmarket.co.uk",
    status: "ACTIVE",
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
  },
  {
    id: "sub-4",
    email: "london.ethio.community@yahoo.co.uk",
    status: "ACTIVE",
    created_at: new Date(Date.now() - 86400000 * 15).toISOString(),
  },
];

export async function getNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
  try {
    const adminClient = createAdminClient();
    const { data, error } = await adminClient
      .from("newsletter_subscribers")
      .select("id, email, status, created_at")
      .order("created_at", { ascending: false });

    if (!error && data && data.length > 0) {
      return data as NewsletterSubscriber[];
    }
  } catch (err) {
    console.error("Failed to fetch subscribers from Supabase:", err);
  }

  return DEMO_SUBSCRIBERS;
}
