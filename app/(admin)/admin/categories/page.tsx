import Link from "next/link";
import Image from "next/image";
import { getAllAdminCategories } from "@/lib/services/admin";
import { createCategoryAction, deleteCategoryAction } from "@/lib/actions/admin-categories";
import { ImageUploadInput } from "@/components/admin/image-upload-input";
import { DataTable, Column } from "@/components/admin/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Edit2, Trash2, ImageIcon } from "lucide-react";
import { FormError } from "@/components/ui/form-message";

type CategoryRow = Awaited<ReturnType<typeof getAllAdminCategories>>[number];

export default async function AdminCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const categories = await getAllAdminCategories();
  const sParams = await searchParams;

  const columns: Column<CategoryRow>[] = [
    {
      header: "Category",
      cell: (row) => (
        <div className="flex items-center space-x-3">
          <div className="relative h-11 w-11 rounded-xl overflow-hidden bg-muted border border-border shrink-0">
            {row.image_url ? (
              <Image
                src={row.image_url}
                alt={row.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                <ImageIcon className="h-5 w-5" />
              </div>
            )}
          </div>
          <div>
            <span className="font-bold block text-sm">{row.name}</span>
            <span className="text-xs text-muted-foreground block">/{row.slug}</span>
          </div>
        </div>
      ),
    },
    {
      header: "Description",
      cell: (row) => (
        <p className="text-xs text-muted-foreground max-w-xs truncate">
          {row.description || "No description"}
        </p>
      ),
    },
    {
      header: "Status",
      cell: (row) => (
        <Badge variant={row.active ? "secondary" : "outline"}>
          {row.active ? "Active" : "Hidden"}
        </Badge>
      ),
    },
    {
      header: "Actions",
      cell: (row) => (
        <div className="flex items-center space-x-1">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/admin/categories/${row.id}/edit`}>
              <Edit2 className="h-4 w-4" />
            </Link>
          </Button>

          <form action={deleteCategoryAction.bind(null, row.id)}>
            <Button variant="ghost" size="icon" className="text-destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          </form>
        </div>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <div className="lg:col-span-2 space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Categories</h1>
          <p className="text-sm text-muted-foreground mt-1">Organize products into store categories.</p>
        </div>

        <FormError message={sParams.error} />

        <DataTable columns={columns} data={categories} emptyTitle="No categories created" />
      </div>

      <div className="bg-card border border-border p-6 rounded-xl space-y-4 shadow-sm">
        <h2 className="text-lg font-bold border-b border-border pb-3">Create Category</h2>

        <form action={createCategoryAction} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold">Category Name</label>
            <Input name="name" placeholder="e.g. Ethiopian Coffee & Buna" required />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Slug</label>
            <Input name="slug" placeholder="e.g. coffee" required />
          </div>

          <ImageUploadInput label="Category Image" />

          <div className="space-y-2">
            <label className="text-sm font-semibold">Description</label>
            <textarea
              name="description"
              className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm min-h-[80px]"
              placeholder="Category description..."
            />
          </div>

          <label className="flex items-center space-x-2 text-sm font-medium cursor-pointer">
            <input type="checkbox" name="active" value="true" defaultChecked className="rounded border-input" />
            <span>Active Category</span>
          </label>

          <Button type="submit" className="w-full font-bold">
            Save Category
          </Button>
        </form>
      </div>
    </div>
  );
}
