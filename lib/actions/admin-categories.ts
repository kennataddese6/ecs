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

  const name = (formData.get("name") as string)?.trim();
  const slug = (formData.get("slug") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  let imageUrl = (formData.get("imageUrl") as string) || "";
  const imageFile = formData.get("imageFile") as File | null;
  const active = formData.get("active") === "true";

  if (!name || !slug) {
    redirect(`/admin/categories?error=${encodeURIComponent("Category Name and Slug are required.")}`);
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

  const name = (formData.get("name") as string)?.trim();
  const slug = (formData.get("slug") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  let imageUrl = (formData.get("imageUrl") as string) || "";
  const imageFile = formData.get("imageFile") as File | null;
  const active = formData.get("active") === "true";

  if (!name || !slug) {
    redirect(`/admin/categories/${categoryId}/edit?error=${encodeURIComponent("Category Name and Slug are required.")}`);
  }

  // Upload file if new file was selected
  if (imageFile && typeof imageFile === "object" && imageFile.size > 0) {
    const uploadedUrl = await uploadImageToStorage(imageFile, "category-images");
    if (uploadedUrl) {
      imageUrl = uploadedUrl;
    }
  }

  // Check if categoryId is a valid UUID
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(categoryId);

  let updatedRowsCount = 0;

  if (isUuid) {
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
      console.error("Supabase Category Update Error:", error);
    } else if (updatedRows && updatedRows.length > 0) {
      updatedRowsCount = updatedRows.length;
    }
  }

  // If 0 rows updated by UUID, attempt updating by slug
  if (updatedRowsCount === 0) {
    const { data: updatedBySlug } = await supabase
      .from("categories")
      .update({
        name,
        slug,
        description,
        image_url: imageUrl || null,
        active,
      })
      .eq("slug", slug)
      .select("id");

    if (updatedBySlug && updatedBySlug.length > 0) {
      updatedRowsCount = updatedBySlug.length;
    }
  }

  // If still 0 rows updated, insert new category into Supabase DB
  if (updatedRowsCount === 0) {
    const { error: insertError } = await supabase.from("categories").insert({
      name,
      slug,
      description,
      image_url: imageUrl || null,
      active,
    });

    if (insertError) {
      redirect(`/admin/categories/${categoryId}/edit?error=${encodeURIComponent(insertError.message)}`);
    }
  }

  revalidateCategoryPaths(slug);
  redirect("/admin/categories");
}

export async function deleteCategoryAction(categoryId: string): Promise<void> {
  await requireAdmin();
  const supabase = await createClient();

  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(categoryId);

  if (isUuid) {
    await supabase.from("categories").delete().eq("id", categoryId);
  } else {
    // Delete by ID or slug for demo records
    await supabase.from("categories").delete().or(`id.eq.${categoryId},slug.eq.${categoryId}`);
  }

  revalidateCategoryPaths();
  redirect("/admin/categories");
}
