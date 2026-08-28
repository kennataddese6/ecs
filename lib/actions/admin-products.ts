"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { uploadImageToStorage } from "@/lib/supabase/storage";

function revalidateProductPaths(slug?: string) {
  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin/products");
  revalidatePath("/shop/[category]", "page");
  revalidatePath("/products/[slug]", "page");
  if (slug) {
    revalidatePath(`/products/${slug}`);
  }
}

async function handleProductImagesSave(supabase: any, productId: string, formData: FormData) {
  const imageFiles = formData.getAll("imageFiles") as File[];
  const singleImageFile = formData.get("imageFile") as File | null;
  const imageUrls = formData.getAll("imageUrls") as string[];
  const singleImageUrl = (formData.get("imageUrl") as string) || "";

  const finalImageUrls: string[] = [];

  // Add existing or manually entered URLs
  for (const url of imageUrls) {
    if (url && typeof url === "string" && url.trim().length > 0) {
      finalImageUrls.push(url.trim());
    }
  }
  if (singleImageUrl && !finalImageUrls.includes(singleImageUrl)) {
    finalImageUrls.push(singleImageUrl);
  }

  // Collect files to upload to Supabase Storage
  const filesToUpload = imageFiles.filter((f) => f && typeof f === "object" && f.size > 0);
  if (singleImageFile && singleImageFile.size > 0) {
    filesToUpload.push(singleImageFile);
  }

  for (const file of filesToUpload) {
    const uploadedUrl = await uploadImageToStorage(file, "product-images");
    if (uploadedUrl) {
      finalImageUrls.push(uploadedUrl);
    }
  }

  if (finalImageUrls.length > 0) {
    // Delete existing product images for this product ID
    await supabase.from("product_images").delete().eq("product_id", productId);
    const records = finalImageUrls.map((url, index) => ({
      product_id: productId,
      image_url: url,
      sort_order: index,
    }));
    await supabase.from("product_images").insert(records);
  }
}

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
  const unitLabel = (formData.get("unitLabel") as string) || "1 Item";
  const featured = formData.get("featured") === "true";
  const active = formData.get("active") === "true";
  const isDeliverable = formData.get("isDeliverable") === "true";
  const deliveryFeePerUnit = parseFloat((formData.get("deliveryFeePerUnit") as string) || "0");

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
      unit_label: unitLabel,
      featured,
      active,
      is_deliverable: isDeliverable,
      delivery_fee_per_unit: isNaN(deliveryFeePerUnit) ? 0 : deliveryFeePerUnit,
    })
    .select("id")
    .single();

  if (error || !newProd) {
    const msg = error?.message || "Failed to create product.";
    if (msg.includes("public.products") || msg.includes("schema cache")) {
      redirect(`/admin/products/new?error=${encodeURIComponent("The 'public.products' table does not exist in your Supabase project yet. Please run supabase/schema.sql in your Supabase SQL Editor.")}`);
    }
    redirect(`/admin/products/new?error=${encodeURIComponent(msg)}`);
  }

  await handleProductImagesSave(supabase, newProd.id, formData);

  revalidateProductPaths(slug);
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
  const unitLabel = (formData.get("unitLabel") as string) || "1 Item";
  const featured = formData.get("featured") === "true";
  const active = formData.get("active") === "true";
  const isDeliverable = formData.get("isDeliverable") === "true";
  const deliveryFeePerUnit = parseFloat((formData.get("deliveryFeePerUnit") as string) || "0");

  let actualProductId = productId;

  // Attempt update on existing Supabase product row
  const { data: updatedRows, error } = await supabase
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
      unit_label: unitLabel,
      featured,
      active,
      is_deliverable: isDeliverable,
      delivery_fee_per_unit: isNaN(deliveryFeePerUnit) ? 0 : deliveryFeePerUnit,
    })
    .eq("id", productId)
    .select("id");

  if (error) {
    if (error.message.includes("public.products") || error.message.includes("schema cache")) {
      redirect(`/admin/products/${productId}/edit?error=${encodeURIComponent("The 'public.products' table does not exist in your Supabase project yet. Please run supabase/schema.sql in your Supabase SQL Editor.")}`);
    }
    redirect(`/admin/products/${productId}/edit?error=${encodeURIComponent(error.message)}`);
  }

  // If 0 rows were updated (e.g. editing a demo product 'prod-1'), insert real row into Supabase
  if (!updatedRows || updatedRows.length === 0) {
    const { data: insertedProd, error: insertError } = await supabase
      .from("products")
      .insert({
        name,
        slug,
        description,
        price,
        compare_at_price: compareAtPrice,
        stock_quantity: stockQuantity,
        sku: sku || `SKU-${Date.now().toString().slice(-6)}`,
        category_id: categoryId,
        unit_label: unitLabel,
        featured,
        active,
        is_deliverable: isDeliverable,
        delivery_fee_per_unit: isNaN(deliveryFeePerUnit) ? 0 : deliveryFeePerUnit,
      })
      .select("id")
      .single();

    if (insertedProd) {
      actualProductId = insertedProd.id;
    }
  }

  await handleProductImagesSave(supabase, actualProductId, formData);

  revalidateProductPaths(slug);
  redirect("/admin/products");
}

export async function deleteProductAction(productId: string): Promise<void> {
  await requireAdmin();
  const supabase = await createClient();

  const { error } = await supabase.from("products").delete().eq("id", productId);

  if (error) {
    redirect(`/admin/products?error=${encodeURIComponent(error.message)}`);
  }

  revalidateProductPaths();
  redirect("/admin/products");
}
