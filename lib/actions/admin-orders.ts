"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateOrderStatusAction(orderId: string, formData: FormData): Promise<void> {
  await requireAdmin();
  const supabase = await createClient();

  const status = formData.get("status") as string;
  const paymentStatus = formData.get("paymentStatus") as string;

  const updateData: Record<string, string> = {};
  if (status) updateData.status = status;
  if (paymentStatus) updateData.payment_status = paymentStatus;

  const { error } = await supabase
    .from("orders")
    .update(updateData)
    .eq("id", orderId);

  if (error) {
    redirect(`/admin/orders?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin/orders");
  revalidatePath("/account/orders");
  redirect("/admin/orders?success=Order+status+updated");
}
