import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductBySlug, getRelatedProducts } from "@/lib/services/products";
import { ProductImageGallery } from "@/components/shop/product-image-gallery";
import { PriceDisplay } from "@/components/shop/price-display";
import { AddToCartButton } from "@/components/shop/add-to-cart-button";
import { ProductGrid } from "@/components/shop/product-grid";
import { Badge } from "@/components/ui/badge";
import { Truck, ShieldCheck, RotateCcw, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Product Not Found" };
  }

  const imageUrl = product.product_images?.[0]?.image_url || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop";

  return {
    title: product.name,
    description: product.description || `Buy ${product.name} at Enat Market.`,
    openGraph: {
      title: `${product.name} | Enat Market`,
      description: product.description || `Buy ${product.name} at Enat Market.`,
      images: [{ url: imageUrl, alt: product.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | Enat Market`,
      description: product.description || `Buy ${product.name} at Enat Market.`,
      images: [imageUrl],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.id, product.category_id);

  const isOutOfStock = product.stock_quantity <= 0;
  const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= 5;
  const isSale = product.compare_at_price && product.compare_at_price > product.price;

  const discountPercent = isSale
    ? Math.round(((product.compare_at_price! - product.price) / product.compare_at_price!) * 100)
    : 0;

  const isDeliverable = product.is_deliverable ?? true;
  const deliveryFee = product.delivery_fee_per_unit ?? 0;

  const mainImageUrl = product.product_images?.[0]?.image_url || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: mainImageUrl,
    description: product.description,
    sku: product.sku || product.id,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "GBP",
      availability: isOutOfStock
        ? "https://schema.org/OutOfStock"
        : "https://schema.org/InStock",
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Button variant="ghost" size="sm" asChild>
        <Link href="/shop">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Shop
        </Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <ProductImageGallery
          images={product.product_images}
          productName={product.name}
        />

        <div className="space-y-6">
          {product.categories && (
            <Link
              href={`/shop/${product.categories.slug}`}
              className="text-xs font-bold text-primary uppercase tracking-widest hover:underline"
            >
              {product.categories.name}
            </Link>
          )}

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              {product.name}
            </h1>

            {product.sku && (
              <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>
            )}
          </div>

          <div className="flex items-center space-x-4 flex-wrap gap-y-2">
            <PriceDisplay
              price={product.price}
              compareAtPrice={product.compare_at_price}
              className="text-2xl sm:text-3xl font-extrabold"
            />
            {product.unit_label && (
              <span className="text-sm sm:text-base font-bold text-muted-foreground">
                / {product.unit_label}
              </span>
            )}
            {isSale && (
              <Badge className="bg-destructive text-destructive-foreground font-bold text-sm px-2.5 py-0.5">
                Save {discountPercent}%
              </Badge>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {isOutOfStock ? (
              <Badge variant="outline" className="text-destructive border-destructive/40 font-semibold px-3 py-1 text-sm">
                Out of Stock
              </Badge>
            ) : isLowStock ? (
              <Badge variant="outline" className="text-amber-500 border-amber-500/40 font-semibold px-3 py-1 text-sm">
                Low Stock &bull; Only {product.stock_quantity} left
              </Badge>
            ) : (
              <Badge variant="outline" className="text-emerald-500 border-emerald-500/40 font-semibold px-3 py-1 text-sm">
                In Stock & Ready to Ship
              </Badge>
            )}

            {!isDeliverable ? (
              <Badge variant="outline" className="text-destructive border-destructive/40 font-semibold px-3 py-1 text-sm">
                In-Store Pickup Only
              </Badge>
            ) : deliveryFee === 0 ? (
              <Badge variant="outline" className="text-emerald-500 border-emerald-500/40 font-semibold px-3 py-1 text-sm">
                Free UK Courier Shipping
              </Badge>
            ) : (
              <Badge variant="outline" className="text-primary border-primary/40 font-semibold px-3 py-1 text-sm">
                +£{deliveryFee.toFixed(2)} UK Delivery per unit
              </Badge>
            )}
          </div>

          {product.description && (
            <div className="prose prose-slate dark:prose-invert max-w-none text-muted-foreground text-base leading-relaxed border-t border-b border-border py-6">
              <p>{product.description}</p>
            </div>
          )}

          <div className="pt-2">
            <AddToCartButton
              productId={product.id}
              disabled={isOutOfStock}
              className="w-full h-12 text-base font-bold shadow-lg shadow-primary/25"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-border text-xs text-muted-foreground font-medium">
            <div className="flex items-center space-x-2">
              <Truck className="h-4 w-4 text-primary flex-shrink-0" />
              <span>
                {!isDeliverable
                  ? "In-Store Pickup"
                  : deliveryFee === 0
                  ? "Free UK Express Shipping"
                  : `£${deliveryFee.toFixed(2)} UK Delivery / Unit`}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <ShieldCheck className="h-4 w-4 text-primary flex-shrink-0" />
              <span>100% Authentic Quality</span>
            </div>
            <div className="flex items-center space-x-2">
              <RotateCcw className="h-4 w-4 text-primary flex-shrink-0" />
              <span>Easy Return Policy</span>
            </div>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <section className="space-y-6 pt-12 border-t border-border">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">You May Also Like</h2>
          <ProductGrid products={relatedProducts} />
        </section>
      )}
    </div>
  );
}
