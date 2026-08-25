import { createClient } from "@/lib/supabase/server";
import { Database } from "@/lib/types/database";

export type Order = Database["public"]["Tables"]["orders"]["Row"];
export type OrderItem = Database["public"]["Tables"]["order_items"]["Row"];

export interface OrderWithItems extends Order {
  order_items?: OrderItem[];
}

export async function getUserOrders(): Promise<OrderWithItems[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching user orders:", error);
    return [];
  }

  return (data as OrderWithItems[]) || [];
}

export async function getOrderById(orderId: string): Promise<OrderWithItems | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  const isAdmin = profile?.role === "admin";

  let query = supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", orderId);

  if (!isAdmin) {
    query = query.eq("user_id", user.id);
  }

  const { data, error } = await query.single();

  if (error || !data) {
    return null;
  }

  return data as OrderWithItems;
}
