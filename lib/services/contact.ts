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

export const DEMO_MESSAGES: ContactMessage[] = [
  {
    id: "msg-1",
    full_name: "Dawit Wolde",
    email: "dawit.w@gmail.com",
    phone: "+44 7911 123456",
    topic: "Bulk Order Inquiry",
    message: "Hello Enat Market! We would like to place a bulk order for 20kg Yirgacheffe coffee beans and Berbere spice for our cultural event in London.",
    status: "UNREAD",
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: "msg-2",
    full_name: "Helen Berhane",
    email: "helen.b@outlook.com",
    phone: "+44 7356 226884",
    topic: "Product Consultation",
    message: "Can you confirm if your Habesha Kemis gowns come with custom Netela matching scarves?",
    status: "READ",
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
];

export async function getContactMessages(): Promise<ContactMessage[]> {
  try {
    const adminClient = createAdminClient();
    const { data, error } = await adminClient
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data && data.length > 0) {
      return data as ContactMessage[];
    }
  } catch (err) {
    console.error("Failed to fetch contact messages from Supabase:", err);
  }

  return DEMO_MESSAGES;
}
