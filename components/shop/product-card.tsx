import Link from "next/link";
import Image from "next/image";
import { ProductWithImages } from "@/lib/services/products";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PriceDisplay } from "@/components/shop/price-display";
import { AddToCartButton } from "@/components/shop/add-to-cart-button";

export function ProductCard({ product }: { product: ProductWithImages }) {
  const imageUrl = product.product_images?.[0]?.image_url || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop";

  const isOutOfStock = product.stock_quantity <= 0;
  const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= 5;
  const isSale = product.compare_at_price && product.compare_at_price > product.price;

  const discountPercent = isSale
    ? Math.round(((product.compare_at_price! - product.price) / product.compare_at_price!) * 100)
    : 0;

  const isDeliverable = product.is_deliverable ?? true;
  const deliveryFee = product.delivery_fee_per_unit ?? 0;

  return (
    <Card className="group overflow-hidden flex flex-col h-full hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md bg-card">
      <Link href={`/products/${product.slug}`} className="relative aspect-square overflow-hidden bg-muted block">
        {/* Badges */}
        <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
          <div className="flex flex-col space-y-1">
            {isSale && (
              <Badge className="bg-destructive text-destructive-foreground font-bold shadow-md">
                -{discountPercent}% OFF
              </Badge>
            )}
            {product.featured && (
              <Badge className="bg-primary text-primary-foreground font-bold shadow-md">
                Featured
              </Badge>
            )}
          </div>

          {isOutOfStock ? (
            <Badge variant="outline" className="bg-background/90 backdrop-blur-md text-destructive border-destructive/30 font-semibold">
              Sold Out
            </Badge>
          ) : isLowStock ? (
            <Badge variant="outline" className="bg-background/90 backdrop-blur-md text-amber-500 border-amber-500/30 font-semibold">
              Only {product.stock_quantity} left
            </Badge>
          ) : null}
        </div>

        {/* Product Image */}
        <div className="w-full h-full flex items-center justify-center bg-muted/50 group-hover:scale-105 transition-transform duration-500">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        </div>
      </Link>

      <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {product.categories && (
            <p className="text-xs font-semibold text-primary mb-1 uppercase tracking-wider">
              {product.categories.name}
            </p>
          )}
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-bold text-base tracking-tight line-clamp-2 hover:text-primary transition-colors">
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="flex items-baseline justify-between pt-1">
          <div className="flex items-baseline space-x-1.5 flex-wrap">
            <PriceDisplay price={product.price} compareAtPrice={product.compare_at_price} />
            {product.unit_label && (
              <span className="text-xs font-semibold text-muted-foreground">/ {product.unit_label}</span>
            )}
          </div>

          <span className="text-[11px] font-semibold text-muted-foreground">
            {!isDeliverable ? (
              <span className="text-destructive font-bold">Pickup Only</span>
            ) : deliveryFee === 0 ? (
              <span className="text-emerald-500 font-bold">Free UK Delivery</span>
            ) : (
              `+£${deliveryFee.toFixed(2)} UK Delivery`
            )}
          </span>
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0">
        <AddToCartButton productId={product.id} className="w-full" disabled={isOutOfStock} />
      </CardFooter>
    </Card>
  );
}
