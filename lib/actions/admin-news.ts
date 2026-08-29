"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { uploadImageToStorage } from "@/lib/supabase/storage";

function revalidateNewsPaths(slug?: string) {
  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidatePath("/news");
  revalidatePath("/admin/news");
  revalidatePath("/news/[slug]", "page");
  if (slug) {
    revalidatePath(`/news/${slug}`);
  }
}

export async function createNewsAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const supabase = await createClient();

  const title = (formData.get("title") as string)?.trim();
  const slug = (formData.get("slug") as string)?.trim();
  const excerpt = (formData.get("excerpt") as string)?.trim();
  const content = (formData.get("content") as string)?.trim();
  const published = formData.get("published") === "true";

  const imageFile = formData.get("imageFile") as File | null;
  let featuredImage = (formData.get("featuredImage") as string) || (formData.get("imageUrl") as string) || "";

  if (imageFile && typeof imageFile === "object" && imageFile.size > 0) {
    const uploadedUrl = await uploadImageToStorage(imageFile, "news-images");
    if (uploadedUrl) {
      featuredImage = uploadedUrl;
    }
  }

  if (!title || !slug || !content) {
    redirect(`/admin/news/new?error=${encodeURIComponent("Title, slug, and article content are required.")}`);
  }

  const { error } = await supabase.from("news").insert({
    title,
    slug,
    excerpt,
    content,
    featured_image: featuredImage || null,
    published,
    published_at: published ? new Date().toISOString() : null,
  });

  if (error) {
    redirect(`/admin/news/new?error=${encodeURIComponent(error.message)}`);
  }

  revalidateNewsPaths(slug);
  redirect("/admin/news");
}

export async function updateNewsAction(articleId: string, formData: FormData): Promise<void> {
  await requireAdmin();
  const supabase = await createClient();

  const title = (formData.get("title") as string)?.trim();
  const slug = (formData.get("slug") as string)?.trim();
  const excerpt = (formData.get("excerpt") as string)?.trim();
  const content = (formData.get("content") as string)?.trim();
  const published = formData.get("published") === "true";

  const imageFile = formData.get("imageFile") as File | null;
  let featuredImage = (formData.get("featuredImage") as string) || (formData.get("imageUrl") as string) || "";

  if (imageFile && typeof imageFile === "object" && imageFile.size > 0) {
    const uploadedUrl = await uploadImageToStorage(imageFile, "news-images");
    if (uploadedUrl) {
      featuredImage = uploadedUrl;
    }
  }

  if (!title || !slug || !content) {
    redirect(`/admin/news/${articleId}/edit?error=${encodeURIComponent("Title, slug, and article content are required.")}`);
  }

  // Attempt update on existing Supabase news article row
  const { data: updatedRows, error } = await supabase
    .from("news")
    .update({
      title,
      slug,
      excerpt,
      content,
      featured_image: featuredImage || null,
      published,
      published_at: published ? new Date().toISOString() : null,
    })
    .eq("id", articleId)
    .select("id");

  if (error) {
    redirect(`/admin/news/${articleId}/edit?error=${encodeURIComponent(error.message)}`);
  }

  // If 0 rows were updated (e.g. editing a demo news item like 'news-1'), insert real row into Supabase
  if (!updatedRows || updatedRows.length === 0) {
    await supabase.from("news").insert({
      title,
      slug,
      excerpt,
      content,
      featured_image: featuredImage || null,
      published,
      published_at: published ? new Date().toISOString() : null,
    });
  }

  revalidateNewsPaths(slug);
  redirect("/admin/news");
}

export async function deleteNewsAction(articleId: string): Promise<void> {
  await requireAdmin();
  const supabase = await createClient();

  const { error } = await supabase.from("news").delete().eq("id", articleId);

  if (error) {
    redirect(`/admin/news?error=${encodeURIComponent(error.message)}`);
  }

  revalidateNewsPaths();
  redirect("/admin/news");
}
