"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export interface ContactFormResponse {
  success: boolean;
  message: string;
}

export async function submitContactFormAction(formData: FormData): Promise<ContactFormResponse> {
  try {
    const fullName = (formData.get("fullName") as string)?.trim();
    const email = (formData.get("email") as string)?.trim().toLowerCase();
    const phone = (formData.get("phone") as string)?.trim() || null;
    const topic = (formData.get("topic") as string) || "general";
    const message = (formData.get("message") as string)?.trim();

    if (!fullName || !email || !message) {
      return {
        success: false,
        message: "Please fill in all required fields (Name, Email, and Message).",
      };
    }

    const adminClient = createAdminClient();

    const { error } = await adminClient.from("contact_messages").insert({
      full_name: fullName,
      email,
      phone,
      topic,
      message,
      status: "UNREAD",
    });

    if (error) {
      console.error("Supabase Contact Message Insert Error:", error);
      throw new Error(error.message || "Failed to submit contact message to database.");
    }

    revalidatePath("/admin/messages");

    return {
      success: true,
      message: "Thank you for reaching out to Enat Market UK! A member of our dedicated customer care team will respond to your inquiry shortly.",
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || "Failed to submit message. Please try again or call us directly.",
    };
  }
}
