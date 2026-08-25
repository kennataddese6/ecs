"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createNewsAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const supabase = await createClient();

  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const excerpt = formData.get("excerpt") as string;
  const content = formData.get("content") as string;
  const featuredImage = formData.get("featuredImage") as string;
  const published = formData.get("published") === "true";

  if (!title || !slug || !content) {
    redirect(`/admin/news/new?error=${encodeURIComponent("Title, slug, and content are required.")}`);
  }

  const { error } = await supabase.from("news").insert({
    title,
    slug,
    excerpt,
    content,
    featured_image: featuredImage,
    published,
    published_at: published ? new Date().toISOString() : null,
  });

  if (error) {
    redirect(`/admin/news/new?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin/news");
  revalidatePath("/news");
  redirect("/admin/news");
}

export async function updateNewsAction(articleId: string, formData: FormData): Promise<void> {
  await requireAdmin();
  const supabase = await createClient();

  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const excerpt = formData.get("excerpt") as string;
  const content = formData.get("content") as string;
  const featuredImage = formData.get("featuredImage") as string;
  const published = formData.get("published") === "true";

  const { error } = await supabase
    .from("news")
    .update({
      title,
      slug,
      excerpt,
      content,
      featured_image: featuredImage,
      published,
      published_at: published ? new Date().toISOString() : null,
    })
    .eq("id", articleId);

  if (error) {
    redirect(`/admin/news/${articleId}/edit?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin/news");
  revalidatePath("/news");
  redirect("/admin/news");
}

export async function deleteNewsAction(articleId: string): Promise<void> {
  await requireAdmin();
  const supabase = await createClient();

  await supabase.from("news").delete().eq("id", articleId);

  revalidatePath("/admin/news");
  revalidatePath("/news");
  redirect("/admin/news");
}
