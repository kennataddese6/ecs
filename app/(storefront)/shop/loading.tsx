export default function ShopLoading() {
  return (
    <div className="space-y-8 py-4">
      <div className="space-y-2">
        <div className="h-8 w-48 bg-muted rounded-lg animate-pulse" />
        <div className="h-4 w-72 bg-muted/60 rounded-lg animate-pulse" />
      </div>

      <div className="h-10 w-full bg-muted/40 rounded-xl animate-pulse" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-80 bg-card border border-border rounded-xl animate-pulse p-4 space-y-4">
            <div className="h-44 w-full bg-muted rounded-lg" />
            <div className="h-4 w-3/4 bg-muted rounded" />
            <div className="h-4 w-1/2 bg-muted rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
