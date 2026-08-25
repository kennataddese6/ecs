import { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://lumen-store.vercel.app";
  const supabase = await createClient();

  const [{ data: products }, { data: news }, { data: categories }] = await Promise.all([
    supabase.from("products").select("slug, updated_at").eq("active", true),
    supabase.from("news").select("slug, updated_at").eq("published", true),
    supabase.from("categories").select("slug, updated_at").eq("active", true),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/shop",
    "/news",
    "/about",
    "/contact",
    "/cart",
    "/login",
    "/register",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: route === "" ? 1.0 : 0.8,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = (categories || []).map((c) => ({
    url: `${baseUrl}/shop/${c.slug}`,
    lastModified: new Date(c.updated_at),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const productRoutes: MetadataRoute.Sitemap = (products || []).map((p) => ({
    url: `${baseUrl}/products/${p.slug}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: "daily",
    priority: 0.9,
  }));

  const newsRoutes: MetadataRoute.Sitemap = (news || []).map((n) => ({
    url: `${baseUrl}/news/${n.slug}`,
    lastModified: new Date(n.updated_at),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes, ...newsRoutes];
}
