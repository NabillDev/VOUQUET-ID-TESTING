export default function ShopLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 animate-pulse">
      <div className="space-y-2">
        <div className="h-9 w-64 bg-surfaceStrong rounded-theme" />
        <div className="h-4 w-96 bg-surface rounded-theme" />
      </div>

      <div className="h-28 bg-surface rounded-theme border border-border" />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="border border-border rounded-theme bg-bg overflow-hidden flex flex-col"
          >
            <div className="aspect-[4/5] bg-surface" />
            <div className="p-4 space-y-3">
              <div className="h-3 w-16 bg-surfaceStrong rounded-theme" />
              <div className="h-5 w-3/4 bg-surface rounded-theme" />
              <div className="h-4 w-1/2 bg-surfaceStrong rounded-theme pt-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
