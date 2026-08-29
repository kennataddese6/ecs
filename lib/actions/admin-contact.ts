"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteContactMessageAction(messageId: string): Promise<void> {
  await requireAdmin();
  const adminClient = createAdminClient();

  const { error } = await adminClient
    .from("contact_messages")
    .delete()
    .eq("id", messageId);

  if (error) {
    redirect(`/admin/messages?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin/messages");
  redirect("/admin/messages?success=Message+deleted+successfully");
}
