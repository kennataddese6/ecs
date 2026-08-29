"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const emailSchema = z.string().email("Please enter a valid email address.");

export interface NewsletterResponse {
  success: boolean;
  message: string;
}

export async function subscribeNewsletterAction(email: string): Promise<NewsletterResponse> {
  try {
    const cleanEmail = email.trim().toLowerCase();
    const validEmail = emailSchema.parse(cleanEmail);

    const adminClient = createAdminClient();

    // Check if email is already subscribed
    const { data: existing } = await adminClient
      .from("newsletter_subscribers")
      .select("id, status")
      .eq("email", validEmail)
      .maybeSingle();

    if (existing) {
      return {
        success: true,
        message: "You are already subscribed to the Enat Market journal & newsletter!",
      };
    }

    // Save subscriber email to Supabase database
    const { error } = await adminClient.from("newsletter_subscribers").insert({
      email: validEmail,
      status: "ACTIVE",
    });

    if (error) {
      throw new Error(error.message || "Database insert failed.");
    }

    revalidatePath("/admin/subscribers");
    return {
      success: true,
      message: "Thank you! You have successfully subscribed to the Enat Market journal & newsletter.",
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || "Failed to subscribe. Please check your email and try again.",
    };
  }
}

export async function deleteSubscriberAction(subscriberId: string): Promise<void> {
  await requireAdmin();
  const adminClient = createAdminClient();

  const { error } = await adminClient
    .from("newsletter_subscribers")
    .delete()
    .eq("id", subscriberId);

  if (error) {
    redirect(`/admin/subscribers?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin/subscribers");
  redirect("/admin/subscribers?success=Subscriber+removed+successfully");
}
