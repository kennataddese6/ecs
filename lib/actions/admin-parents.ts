"use server";

import { requireAdmin } from "@/lib/auth";
import { createParent, deleteParent } from "@/lib/services/parents";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createParentAction(formData: FormData) {
  await requireAdmin();

  const fullName = formData.get("fullName") as string;
  const email = formData.get("email") as string;
  const mobileNumber = formData.get("mobileNumber") as string;
  const address = formData.get("address") as string;
  const relationshipToChild = formData.get("relationshipToChild") as string;
  const emergencyPhone = formData.get("emergencyPhone") as string;

  if (!fullName || !email || !mobileNumber || !address || !relationshipToChild) {
    redirect("/admin/parents/new?error=" + encodeURIComponent("Please fill in all required parent details."));
  }

  const res = await createParent({
    full_name: fullName,
    email,
    mobile_number: mobileNumber,
    address,
    relationship_to_child: relationshipToChild,
    emergency_phone: emergencyPhone,
  });

  if (!res.success) {
    redirect("/admin/parents/new?error=" + encodeURIComponent(res.error || "Failed to register parent."));
  }

  revalidatePath("/admin/parents");
  redirect("/admin/parents?success=" + encodeURIComponent(`Parent ${fullName} registered successfully!`));
}

export async function deleteParentAction(id: string) {
  await requireAdmin();
  await deleteParent(id);
  revalidatePath("/admin/parents");
  redirect("/admin/parents?success=" + encodeURIComponent("Parent record removed successfully."));
}
