"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createProductAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const supabase = await createClient();

  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const compareAtPrice = formData.get("compareAtPrice")
    ? parseFloat(formData.get("compareAtPrice") as string)
    : null;
  const stockQuantity = parseInt(formData.get("stockQuantity") as string, 10) || 0;
  const sku = formData.get("sku") as string;
  const categoryId = (formData.get("categoryId") as string) || null;
  const imageUrl = formData.get("imageUrl") as string;
  const featured = formData.get("featured") === "true";
  const active = formData.get("active") === "true";

  if (!name || !slug || isNaN(price)) {
    redirect(`/admin/products/new?error=${encodeURIComponent("Name, slug, and valid price are required.")}`);
  }

  const { data: newProd, error } = await supabase
    .from("products")
    .insert({
      name,
      slug,
      description,
      price,
      compare_at_price: compareAtPrice,
      stock_quantity: stockQuantity,
      sku,
      category_id: categoryId,
      featured,
      active,
    })
    .select("id")
    .single();

  if (error || !newProd) {
    redirect(`/admin/products/new?error=${encodeURIComponent(error?.message || "Failed to create product.")}`);
  }

  if (imageUrl) {
    await supabase.from("product_images").insert({
      product_id: newProd.id,
      image_url: imageUrl,
      sort_order: 0,
    });
  }

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  redirect("/admin/products");
}

export async function updateProductAction(productId: string, formData: FormData): Promise<void> {
  await requireAdmin();
  const supabase = await createClient();

  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const compareAtPrice = formData.get("compareAtPrice")
    ? parseFloat(formData.get("compareAtPrice") as string)
    : null;
  const stockQuantity = parseInt(formData.get("stockQuantity") as string, 10) || 0;
  const sku = formData.get("sku") as string;
  const categoryId = (formData.get("categoryId") as string) || null;
  const imageUrl = formData.get("imageUrl") as string;
  const featured = formData.get("featured") === "true";
  const active = formData.get("active") === "true";

  const { error } = await supabase
    .from("products")
    .update({
      name,
      slug,
      description,
      price,
      compare_at_price: compareAtPrice,
      stock_quantity: stockQuantity,
      sku,
      category_id: categoryId,
      featured,
      active,
    })
    .eq("id", productId);

  if (error) {
    redirect(`/admin/products/${productId}/edit?error=${encodeURIComponent(error.message)}`);
  }

  if (imageUrl) {
    await supabase.from("product_images").delete().eq("product_id", productId);
    await supabase.from("product_images").insert({
      product_id: productId,
      image_url: imageUrl,
      sort_order: 0,
    });
  }

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  redirect("/admin/products");
}

export async function deleteProductAction(productId: string): Promise<void> {
  await requireAdmin();
  const supabase = await createClient();

  await supabase.from("products").delete().eq("id", productId);

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  redirect("/admin/products");
}
