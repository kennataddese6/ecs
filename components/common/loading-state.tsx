import { Loader2 } from "lucide-react";

export function LoadingState({ message = "Loading content..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-16 text-center min-h-[300px] space-y-4">
      <div className="relative flex items-center justify-center">
        <div className="absolute h-12 w-12 rounded-full bg-primary/20 animate-ping" />
        <Loader2 className="h-8 w-8 animate-spin text-primary relative z-10" />
      </div>
      <p className="text-sm font-semibold text-muted-foreground animate-pulse">{message}</p>
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-card border border-border rounded-2xl p-4 space-y-4 shadow-sm">
          <div className="aspect-square bg-muted rounded-xl w-full" />
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded w-1/3" />
            <div className="h-5 bg-muted rounded w-3/4" />
            <div className="h-5 bg-muted rounded w-1/2" />
          </div>
          <div className="h-10 bg-muted rounded-lg w-full pt-2" />
        </div>
      ))}
    </div>
  );
}
