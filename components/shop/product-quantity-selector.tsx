"use client";

import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

interface QuantitySelectorProps {
  quantity: number;
  maxQuantity?: number;
  onChange: (newQuantity: number) => void;
}

export function ProductQuantitySelector({
  quantity,
  maxQuantity = 99,
  onChange,
}: QuantitySelectorProps) {
  return (
    <div className="flex items-center space-x-2 border border-input rounded-md px-2 py-1 w-fit bg-background">
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={() => onChange(Math.max(1, quantity - 1))}
        disabled={quantity <= 1}
        aria-label="Decrease quantity"
      >
        <Minus className="h-3.5 w-3.5" />
      </Button>
      <span className="w-8 text-center text-sm font-semibold">{quantity}</span>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={() => onChange(Math.min(maxQuantity, quantity + 1))}
        disabled={quantity >= maxQuantity}
        aria-label="Increase quantity"
      >
        <Plus className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
