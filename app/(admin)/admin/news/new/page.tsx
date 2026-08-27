import Link from "next/link";
import { createNewsAction } from "@/lib/actions/admin-news";
import { ImageUploadInput } from "@/components/admin/image-upload-input";
import { SubmitButton } from "@/components/common/submit-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";

export default function NewNewsArticlePage() {
  return (
    <div className="max-w-2xl space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/admin/news">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to News
        </Link>
      </Button>

      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Create News Article</h1>
        <p className="text-sm text-muted-foreground mt-1">Publish store news or editorial announcements.</p>
      </div>

      <form action={createNewsAction} className="space-y-4 bg-card border border-border p-6 rounded-xl shadow-sm">
        <div className="space-y-2">
          <label className="text-sm font-semibold">Title</label>
          <Input name="title" placeholder="The Art of Coffee Ceremony" required />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold">Slug</label>
          <Input name="slug" placeholder="art-of-coffee-ceremony" required />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold">Excerpt</label>
          <textarea
            name="excerpt"
            className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm min-h-[80px]"
            placeholder="Short summary preview of the article..."
          />
        </div>

        <ImageUploadInput
          label="Featured Article Image"
          name="featuredImage"
          fileInputName="imageFile"
        />

        <div className="space-y-2">
          <label className="text-sm font-semibold">Content (HTML / Markdown)</label>
          <textarea
            name="content"
            className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm min-h-[160px]"
            placeholder="Full article content..."
            required
          />
        </div>

        <label className="flex items-center space-x-2 text-sm font-medium cursor-pointer pt-2">
          <input type="checkbox" name="published" value="true" defaultChecked className="rounded border-input" />
          <span>Publish Article Immediately</span>
        </label>

        <SubmitButton className="w-full pt-2" loadingText="Saving Article...">
          Save Article
        </SubmitButton>
      </form>
    </div>
  );
}
