import { cn } from "@/lib/utils";

interface PriceDisplayProps {
  price: number;
  compareAtPrice?: number | null;
  className?: string;
}

export function PriceDisplay({ price, compareAtPrice, className }: PriceDisplayProps) {
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);

  const formattedComparePrice = compareAtPrice
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(compareAtPrice)
    : null;

  return (
    <div className={cn("flex items-baseline space-x-2 font-semibold", className)}>
      <span className="text-foreground">{formattedPrice}</span>
      {formattedComparePrice && compareAtPrice! > price && (
        <span className="text-sm text-muted-foreground line-through font-normal">
          {formattedComparePrice}
        </span>
      )}
    </div>
  );
}
