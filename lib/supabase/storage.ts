import { createClient } from "@/lib/supabase/server";

export async function uploadImageToStorage(
  file: File,
  bucketName: string = "product-images"
): Promise<string | null> {
  if (!file || file.size === 0) return null;

  try {
    const supabase = await createClient();

    const fileExt = file.name.split(".").pop() || "png";
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, buffer, {
        contentType: file.type || "image/png",
        upsert: true,
      });

    if (!uploadError) {
      const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);
      if (data?.publicUrl) {
        return data.publicUrl;
      }
    }
  } catch (e) {
    console.error("Storage upload exception:", e);
  }

  // Base64 Data URL fallback for local preview environments
  try {
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const mimeType = file.type || "image/png";
    return `data:${mimeType};base64,${base64}`;
  } catch (e) {
    return null;
  }
}
