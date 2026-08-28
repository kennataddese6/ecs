"use client";

import * as React from "react";
import ReactDOM from "react-dom";
import Link from "next/link";
import { ShoppingBag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartItemWithProduct } from "@/lib/types";
import { CartItem } from "@/components/shop/cart-item";
import { PriceDisplay } from "@/components/shop/price-display";

const emptySubscribe = () => () => {};

export function CartDrawer({ items }: { items: CartItemWithProduct[] }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const mounted = React.useSyncExternalStore(emptySubscribe, () => true, () => false);

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce(
    (acc, item) => acc + (item.product?.price || 0) * item.quantity,
    0
  );

  const drawerContent = isOpen && mounted ? (
    ReactDOM.createPortal(
      <div className="fixed inset-0 z-[100] flex justify-end">
        {/* Backdrop overlay */}
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />

        {/* Slide-out drawer panel */}
        <div className="relative z-[101] bg-card w-full max-w-md h-full flex flex-col p-6 shadow-2xl border-l border-border animate-in slide-in-from-right duration-300">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-lg">Your Cart ({totalItems})</h3>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} aria-label="Close cart drawer">
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto py-4 space-y-3">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-muted-foreground">
                <ShoppingBag className="h-12 w-12 mb-3 opacity-40 text-primary" />
                <p className="font-medium">Your cart is currently empty.</p>
                <Button variant="outline" className="mt-4 text-xs font-semibold" asChild onClick={() => setIsOpen(false)}>
                  <Link href="/shop">Start Shopping</Link>
                </Button>
              </div>
            ) : (
              items.map((item) => <CartItem key={item.id} item={item} />)
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t border-border pt-4 space-y-4 bg-card">
              <div className="flex items-center justify-between text-base">
                <span className="font-medium">Subtotal</span>
                <PriceDisplay price={subtotal} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" asChild onClick={() => setIsOpen(false)}>
                  <Link href="/cart">View Cart</Link>
                </Button>
                <Button asChild onClick={() => setIsOpen(false)}>
                  <Link href="/checkout">Checkout</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>,
      document.body
    )
  ) : null;

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="relative h-9 w-9 rounded-xl border-border/80 bg-card hover:bg-primary/10 hover:border-primary/40 hover:text-primary transition-all duration-300 shadow-2xs group cursor-pointer"
        onClick={() => setIsOpen(true)}
        aria-label="Open cart drawer"
      >
        <ShoppingBag className="h-4.5 w-4.5 text-foreground group-hover:text-primary transition-colors duration-300" />
        {totalItems > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-[10px] font-extrabold h-4.5 w-4.5 rounded-full flex items-center justify-center shadow-xs">
            {totalItems}
          </span>
        )}
      </Button>

      {drawerContent}
    </>
  );
}
