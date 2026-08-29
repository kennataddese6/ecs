import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategoryById } from "@/lib/services/categories";
import { updateCategoryAction } from "@/lib/actions/admin-categories";
import { ImageUploadInput } from "@/components/admin/image-upload-input";
import { SubmitButton } from "@/components/common/submit-button";
import { FormError } from "@/components/ui/form-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";

export default async function EditCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const sParams = await searchParams;

  const category = await getCategoryById(id);

  if (!category) notFound();

  const updateWithId = updateCategoryAction.bind(null, id);

  return (
    <div className="max-w-2xl space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/admin/categories">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Categories
        </Link>
      </Button>

      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Edit Category</h1>
        <p className="text-sm text-muted-foreground mt-1">Update details and image for {category.name}.</p>
      </div>

      <FormError message={sParams.error} />

      <form action={updateWithId} className="space-y-4 bg-card border border-border p-6 rounded-xl shadow-sm">
        <div className="space-y-2">
          <label className="text-sm font-semibold">Category Name</label>
          <Input name="name" defaultValue={category.name} required />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold">Slug</label>
          <Input name="slug" defaultValue={category.slug} required />
        </div>

        <ImageUploadInput
          label="Category Banner Image"
          defaultValue={category.image_url || ""}
        />

        <div className="space-y-2">
          <label className="text-sm font-semibold">Description</label>
          <textarea
            name="description"
            defaultValue={category.description || ""}
            placeholder="Category description..."
            className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm min-h-[100px]"
          />
        </div>

        <div className="pt-2">
          <label className="flex items-center space-x-2 text-sm font-medium cursor-pointer">
            <input type="checkbox" name="active" value="true" defaultChecked={category.active} className="rounded border-input" />
            <span>Active & Published</span>
          </label>
        </div>

        <SubmitButton className="w-full pt-2" loadingText="Updating Category...">
          Update Category
        </SubmitButton>
      </form>
    </div>
  );
}
