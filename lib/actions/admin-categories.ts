"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { uploadImageToStorage } from "@/lib/supabase/storage";

function revalidateCategoryPaths(slug?: string) {
  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin/categories");
  revalidatePath("/shop/[category]", "page");
  if (slug) {
    revalidatePath(`/shop/${slug}`);
  }
}

export async function createCategoryAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const supabase = await createClient();

  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  let imageUrl = (formData.get("imageUrl") as string) || "";
  const imageFile = formData.get("imageFile") as File | null;
  const active = formData.get("active") === "true";

  if (!name || !slug) {
    redirect(`/admin/categories?error=${encodeURIComponent("Name and slug are required.")}`);
  }

  // Handle uploaded category image file
  if (imageFile && typeof imageFile === "object" && imageFile.size > 0) {
    const uploadedUrl = await uploadImageToStorage(imageFile, "category-images");
    if (uploadedUrl) {
      imageUrl = uploadedUrl;
    }
  }

  const { error } = await supabase.from("categories").insert({
    name,
    slug,
    description,
    image_url: imageUrl || null,
    active,
  });

  if (error) {
    redirect(`/admin/categories?error=${encodeURIComponent(error.message)}`);
  }

  revalidateCategoryPaths(slug);
  redirect("/admin/categories");
}

export async function updateCategoryAction(categoryId: string, formData: FormData): Promise<void> {
  await requireAdmin();
  const supabase = await createClient();

  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  let imageUrl = (formData.get("imageUrl") as string) || "";
  const imageFile = formData.get("imageFile") as File | null;
  const active = formData.get("active") === "true";

  if (!name || !slug) {
    redirect(`/admin/categories/${categoryId}/edit?error=${encodeURIComponent("Name and slug are required.")}`);
  }

  if (imageFile && typeof imageFile === "object" && imageFile.size > 0) {
    const uploadedUrl = await uploadImageToStorage(imageFile, "category-images");
    if (uploadedUrl) {
      imageUrl = uploadedUrl;
    }
  }

  // Try updating existing database record first
  const { data: updatedRows, error } = await supabase
    .from("categories")
    .update({
      name,
      slug,
      description,
      image_url: imageUrl || null,
      active,
    })
    .eq("id", categoryId)
    .select("id");

  if (error) {
    redirect(`/admin/categories/${categoryId}/edit?error=${encodeURIComponent(error.message)}`);
  }

  // If 0 rows were updated (e.g., editing a demo mock category like 'cat-1'), insert a real record into Supabase!
  if (!updatedRows || updatedRows.length === 0) {
    await supabase.from("categories").insert({
      name,
      slug,
      description,
      image_url: imageUrl || null,
      active,
    });
  }

  revalidateCategoryPaths(slug);
  redirect("/admin/categories");
}

export async function deleteCategoryAction(categoryId: string): Promise<void> {
  await requireAdmin();
  const supabase = await createClient();

  const { error } = await supabase.from("categories").delete().eq("id", categoryId);

  if (error) {
    redirect(`/admin/categories?error=${encodeURIComponent(error.message)}`);
  }

  revalidateCategoryPaths();
  redirect("/admin/categories");
}
