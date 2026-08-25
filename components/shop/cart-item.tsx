"use client";

import Image from "next/image";
import Link from "next/link";
import { CartItemWithProduct } from "@/lib/types";
import { PriceDisplay } from "@/components/shop/price-display";
import { ProductQuantitySelector } from "@/components/shop/product-quantity-selector";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { updateCartQuantityAction, removeFromCartAction } from "@/lib/actions/cart";

export function CartItem({ item }: { item: CartItemWithProduct }) {
  const product = item.product;
  const imageUrl =
    product?.product_images?.[0]?.image_url ||
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop";

  const isLowStock = product && product.stock_quantity > 0 && product.stock_quantity < item.quantity;

  return (
    <div className="flex space-x-4 py-4 border-b border-border items-center">
      <Link href={`/products/${product?.slug}`} className="relative h-20 w-20 rounded-xl overflow-hidden bg-muted border border-border flex-shrink-0 block group">
        <Image src={imageUrl} alt={product?.name || "Product"} fill className="object-cover group-hover:scale-105 transition-transform" />
      </Link>

      <div className="flex-1 flex flex-col justify-between space-y-1">
        <Link href={`/products/${product?.slug}`} className="font-bold text-sm hover:text-primary transition-colors line-clamp-1">
          {product?.name}
        </Link>

        <PriceDisplay price={product?.price || 0} />

        {isLowStock && (
          <p className="text-[10px] font-semibold text-amber-500">
            Only {product.stock_quantity} left in stock
          </p>
        )}

        <div className="flex items-center space-x-3 pt-1">
          <ProductQuantitySelector
            quantity={item.quantity}
            maxQuantity={product?.stock_quantity || 99}
            onChange={(newQty) => updateCartQuantityAction(item.id, newQty)}
          />
        </div>
      </div>

      <div className="flex flex-col items-end justify-between space-y-3">
        <PriceDisplay price={(product?.price || 0) * item.quantity} className="font-bold text-sm" />
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          onClick={() => removeFromCartAction(item.id)}
          aria-label="Remove item"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
