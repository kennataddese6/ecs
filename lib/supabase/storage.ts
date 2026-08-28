import { createClient } from "@/lib/supabase/server";

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
  "image/svg+xml",
];

const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "avif", "gif", "svg"];

export function isValidImageFile(file: File): boolean {
  if (!file || file.size === 0) return false;
  
  const ext = (file.name.split(".").pop() || "").toLowerCase();
  const mimeType = (file.type || "").toLowerCase();

  const isMimeValid = ALLOWED_IMAGE_TYPES.some((type) => mimeType.includes(type));
  const isExtValid = ALLOWED_EXTENSIONS.includes(ext);

  return isMimeValid || isExtValid;
}

export async function uploadImageToStorage(
  file: File,
  bucketName: string = "product-images"
): Promise<string | null> {
  if (!file || file.size === 0) return null;

  // Strict image format validation
  if (!isValidImageFile(file)) {
    console.error(`Rejected upload: File "${file.name}" (type: ${file.type}) is not a supported image format (JPG, JPEG, PNG, WEBP, AVIF).`);
    return null;
  }

  try {
    const supabase = await createClient();

    const rawExt = (file.name.split(".").pop() || "png").toLowerCase();
    const fileExt = ALLOWED_EXTENSIONS.includes(rawExt) ? rawExt : "jpg";
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, buffer, {
        contentType: file.type || `image/${fileExt}`,
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

  // Base64 Data URL fallback for local environments
  try {
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const mimeType = file.type || "image/jpeg";
    return `data:${mimeType};base64,${base64}`;
  } catch (e) {
    return null;
  }
}
