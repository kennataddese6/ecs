"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createCategoryAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const supabase = await createClient();

  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const imageUrl = formData.get("imageUrl") as string;
  const active = formData.get("active") === "true";

  if (!name || !slug) {
    redirect(`/admin/categories?error=${encodeURIComponent("Name and slug are required.")}`);
  }

  const { error } = await supabase.from("categories").insert({
    name,
    slug,
    description,
    image_url: imageUrl,
    active,
  });

  if (error) {
    redirect(`/admin/categories?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin/categories");
  revalidatePath("/shop");
  redirect("/admin/categories");
}

export async function deleteCategoryAction(categoryId: string): Promise<void> {
  await requireAdmin();
  const supabase = await createClient();

  await supabase.from("categories").delete().eq("id", categoryId);

  revalidatePath("/admin/categories");
  revalidatePath("/shop");
  redirect("/admin/categories");
}
