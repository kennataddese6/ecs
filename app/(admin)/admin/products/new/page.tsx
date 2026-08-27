import Link from "next/link";
import { getAllAdminCategories } from "@/lib/services/admin";
import { createProductAction } from "@/lib/actions/admin-products";
import { ImageUploadInput } from "@/components/admin/image-upload-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";

export default async function NewProductPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const categories = await getAllAdminCategories();
  const params = await searchParams;

  return (
    <div className="max-w-2xl space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/admin/products">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Products
        </Link>
      </Button>

      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Create New Product</h1>
        <p className="text-sm text-muted-foreground mt-1">Add a new item to your store catalog.</p>
      </div>

      {params.error && (
        <div className="p-4 rounded-xl bg-destructive/10 text-destructive text-sm font-medium border border-destructive/20">
          {params.error}
        </div>
      )}

      <form action={createProductAction} className="space-y-4 bg-card border border-border p-6 rounded-xl shadow-sm">
        <div className="space-y-2">
          <label className="text-sm font-semibold">Product Name</label>
          <Input name="name" placeholder="Yirgacheffe Specialty Coffee" required />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold">Slug</label>
          <Input name="slug" placeholder="yirgacheffe-specialty-coffee" required />
        </div>

        <ImageUploadInput label="Product Image (Upload File to Supabase Storage or URL)" name="imageUrl" fileInputName="imageFile" />

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold">Price (£)</label>
            <Input name="price" type="number" step="0.01" placeholder="28.50" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold">Compare At Price (£)</label>
            <Input name="compareAtPrice" type="number" step="0.01" placeholder="34.00" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold">Stock Quantity</label>
            <Input name="stockQuantity" type="number" defaultValue="10" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold">SKU</label>
            <Input name="sku" placeholder="ETH-COF-001" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold">Category</label>
          <select
            name="categoryId"
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
          >
            <option value="">No Category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold">Description</label>
          <textarea
            name="description"
            className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm min-h-[100px]"
            placeholder="Detailed description of the product..."
          />
        </div>

        <div className="flex items-center space-x-6 pt-2">
          <label className="flex items-center space-x-2 text-sm font-medium cursor-pointer">
            <input type="checkbox" name="active" value="true" defaultChecked className="rounded border-input" />
            <span>Active & Published</span>
          </label>

          <label className="flex items-center space-x-2 text-sm font-medium cursor-pointer">
            <input type="checkbox" name="featured" value="true" className="rounded border-input" />
            <span>Featured Product</span>
          </label>
        </div>

        <Button type="submit" className="w-full pt-2">
          Save Product
        </Button>
      </form>
    </div>
  );
}
