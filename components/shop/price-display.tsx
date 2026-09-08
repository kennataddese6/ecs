import { cn } from "@/lib/utils";

interface PriceDisplayProps {
  price: number;
  compareAtPrice?: number | null;
  priceOnRequest?: boolean;
  className?: string;
}

export function PriceDisplay({
  price,
  compareAtPrice,
  priceOnRequest = false,
  className,
}: PriceDisplayProps) {
  if (priceOnRequest) {
    return (
      <div className={cn("flex items-baseline font-bold", className)}>
        <span className="text-primary tracking-tight">Price on Request</span>
      </div>
    );
  }

  const formattedPrice = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(price);

  const formattedComparePrice = compareAtPrice
    ? new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: "GBP",
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
