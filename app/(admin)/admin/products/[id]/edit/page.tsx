import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductById } from "@/lib/services/products";
import { getAllAdminCategories } from "@/lib/services/admin";
import { updateProductAction } from "@/lib/actions/admin-products";
import { MultiImageUploadInput } from "@/components/admin/multi-image-upload-input";
import { SubmitButton } from "@/components/common/submit-button";
import { FormError } from "@/components/ui/form-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Truck } from "lucide-react";

export default async function EditProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const sParams = await searchParams;

  const product = await getProductById(id);

  if (!product) notFound();

  const primaryImage = product.product_images?.[0]?.image_url || "";
  const categories = await getAllAdminCategories();
  const updateWithId = updateProductAction.bind(null, id);

  return (
    <div className="max-w-2xl space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/admin/products">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Products
        </Link>
      </Button>

      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Edit Product</h1>
        <p className="text-sm text-muted-foreground mt-1">Update details for {product.name}.</p>
      </div>

      <FormError message={sParams.error} />

      <form action={updateWithId} className="space-y-4 bg-card border border-border p-6 rounded-xl shadow-sm">
        <div className="space-y-2">
          <label className="text-sm font-semibold">Product Name</label>
          <Input name="name" defaultValue={product.name} required />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold">Slug</label>
          <Input name="slug" defaultValue={product.slug} required />
        </div>

        <MultiImageUploadInput
          label="Product Gallery Images"
          existingImages={product.product_images || []}
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold">Price (£)</label>
            <Input name="price" type="number" step="0.01" defaultValue={product.price} required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold">Compare At Price (£)</label>
            <Input name="compareAtPrice" type="number" step="0.01" defaultValue={product.compare_at_price || ""} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold">Unit / Pack Size (kg, Litre, g)</label>
            <Input name="unitLabel" placeholder="e.g. 1 kg, 500 g, 1 Litre, 250 ml" defaultValue={product.unit_label || "1 kg"} />
          </div>
        </div>

        {/* UK Delivery & Shipping Settings */}
        <div className="p-4 rounded-xl bg-muted/40 border border-border space-y-3">
          <div className="flex items-center space-x-2">
            <Truck className="h-4 w-4 text-primary" />
            <h3 className="text-xs font-bold uppercase tracking-wider">UK Delivery & Shipping Pricing</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold">Delivery Availability</label>
              <label className="flex items-center space-x-2 text-sm font-medium cursor-pointer pt-1">
                <input
                  type="checkbox"
                  name="isDeliverable"
                  value="true"
                  defaultChecked={product.is_deliverable ?? true}
                  className="rounded border-input text-primary"
                />
                <span>Deliverable via UK Courier</span>
              </label>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Delivery Fee per Unit (£)</label>
              <Input
                name="deliveryFeePerUnit"
                type="number"
                step="0.01"
                defaultValue={product.delivery_fee_per_unit ?? "5.00"}
                placeholder="5.00"
              />
              <p className="text-[10px] text-muted-foreground">
                e.g. £5 per unit adds £5 for 1 item, £10 for 2 items at checkout. Set 0 for free delivery.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold">Stock Quantity</label>
            <Input name="stockQuantity" type="number" defaultValue={product.stock_quantity} required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold">SKU</label>
            <Input name="sku" defaultValue={product.sku || ""} />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold">Category</label>
          <select
            name="categoryId"
            defaultValue={product.category_id || ""}
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
            defaultValue={product.description || ""}
            className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm min-h-[100px]"
          />
        </div>

        <div className="flex items-center space-x-6 pt-2">
          <label className="flex items-center space-x-2 text-sm font-medium cursor-pointer">
            <input type="checkbox" name="active" value="true" defaultChecked={product.active} className="rounded border-input" />
            <span>Active & Published</span>
          </label>

          <label className="flex items-center space-x-2 text-sm font-medium cursor-pointer">
            <input type="checkbox" name="featured" value="true" defaultChecked={product.featured} className="rounded border-input" />
            <span>Featured Product</span>
          </label>
        </div>

        <SubmitButton className="w-full pt-2" loadingText="Updating Product...">
          Update Product
        </SubmitButton>
      </form>
    </div>
  );
}
