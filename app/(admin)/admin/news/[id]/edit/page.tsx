import Link from "next/link";
import { notFound } from "next/navigation";
import { getNewsBySlug } from "@/lib/services/news";
import { updateNewsAction } from "@/lib/actions/admin-news";
import { ImageUploadInput } from "@/components/admin/image-upload-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";

export default async function EditNewsArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await getNewsBySlug(id);

  if (!article) notFound();

  const updateWithId = updateNewsAction.bind(null, id);

  return (
    <div className="max-w-2xl space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/admin/news">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to News
        </Link>
      </Button>

      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Edit News Article</h1>
        <p className="text-sm text-muted-foreground mt-1">Update details for {article.title}.</p>
      </div>

      <form action={updateWithId} className="space-y-4 bg-card border border-border p-6 rounded-xl shadow-sm">
        <div className="space-y-2">
          <label className="text-sm font-semibold">Title</label>
          <Input name="title" defaultValue={article.title} required />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold">Slug</label>
          <Input name="slug" defaultValue={article.slug} required />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold">Excerpt</label>
          <textarea
            name="excerpt"
            defaultValue={article.excerpt || ""}
            className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm min-h-[80px]"
          />
        </div>

        <ImageUploadInput
          label="Featured Article Image (Upload File to Supabase Storage or URL)"
          name="featuredImage"
          fileInputName="imageFile"
          defaultValue={article.featured_image || ""}
        />

        <div className="space-y-2">
          <label className="text-sm font-semibold">Content (HTML / Markdown)</label>
          <textarea
            name="content"
            defaultValue={article.content}
            className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm min-h-[160px]"
            required
          />
        </div>

        <label className="flex items-center space-x-2 text-sm font-medium cursor-pointer pt-2">
          <input
            type="checkbox"
            name="published"
            value="true"
            defaultChecked={article.published}
            className="rounded border-input"
          />
          <span>Published Article</span>
        </label>

        <Button type="submit" className="w-full pt-2">
          Update Article
        </Button>
      </form>
    </div>
  );
}
