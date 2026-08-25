import { PackageOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  actionHref?: string;
}

export function EmptyState({
  title = "No items found",
  description = "There are no records to display at the moment.",
  actionText,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed rounded-xl my-6 bg-card/50">
      <PackageOpen className="h-12 w-12 text-muted-foreground/60 mb-4" />
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">{description}</p>
      {actionText && actionHref && (
        <Button asChild>
          <Link href={actionHref}>{actionText}</Link>
        </Button>
      )}
    </div>
  );
}
