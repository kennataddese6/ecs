"use client";

import * as React from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { ShoppingBag, Check, Loader2 } from "lucide-react";
import { addToCartAction } from "@/lib/actions/cart";

interface AddToCartButtonProps extends ButtonProps {
  productId: string;
  quantity?: number;
}

export function AddToCartButton({ productId, quantity = 1, className, ...props }: AddToCartButtonProps) {
  const [isPending, setIsPending] = React.useState(false);
  const [added, setAdded] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const handleAdd = async () => {
    setIsPending(true);
    setErrorMsg(null);
    const res = await addToCartAction(productId, quantity);
    setIsPending(false);

    if (res?.error) {
      setErrorMsg(res.error);
    } else {
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  return (
    <div className="flex flex-col space-y-1 w-full">
      <Button
        onClick={handleAdd}
        disabled={isPending || added}
        className={className}
        {...props}
      >
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            <span>Adding to Cart...</span>
          </>
        ) : added ? (
          <>
            <Check className="h-4 w-4 mr-2" /> Added to Cart
          </>
        ) : (
          <>
            <ShoppingBag className="h-4 w-4 mr-2" /> Add to Cart
          </>
        )}
      </Button>
      {errorMsg && <p className="text-xs text-destructive text-center font-medium">{errorMsg}</p>}
    </div>
  );
}
