"use server";

import { createAdminClient } from "@/lib/supabase/admin";
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
