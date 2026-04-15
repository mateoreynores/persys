export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header skeleton */}
      <div className="mb-6 space-y-1.5">
        <div className="h-7 w-32 animate-pulse rounded-md bg-muted" />
        <div className="h-4 w-44 animate-pulse rounded-md bg-muted/50" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[15rem_1fr]">
        {/* Sidebar skeleton */}
        <div className="hidden animate-pulse space-y-3 rounded-2xl border border-border/40 bg-card p-4 lg:block">
          <div className="h-4 w-16 rounded bg-muted" />
          <div className="space-y-2">
            <div className="h-3 w-12 rounded bg-muted/60" />
            <div className="h-9 rounded-md bg-muted/40" />
          </div>
          <div className="space-y-2">
            <div className="h-3 w-16 rounded bg-muted/60" />
            <div className="h-9 rounded-md bg-muted/40" />
          </div>
          <div className="h-8 rounded-md bg-muted" />
        </div>

        {/* Grid skeleton */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="flex animate-pulse flex-col overflow-hidden rounded-xl border border-border/40 bg-card"
              style={{ animationDelay: `${index * 75}ms` }}
            >
              <div className="aspect-[4/3] bg-muted/30" />
              <div className="space-y-2.5 p-4">
                <div className="flex justify-between">
                  <div className="h-2.5 w-14 rounded bg-muted/60" />
                  <div className="h-2.5 w-10 rounded bg-muted/40" />
                </div>
                <div className="h-4 w-3/4 rounded bg-muted/50" />
                <div className="space-y-1.5">
                  <div className="h-3 w-full rounded bg-muted/30" />
                  <div className="h-3 w-2/3 rounded bg-muted/30" />
                </div>
                <div className="border-t border-border/20 pt-3">
                  <div className="h-5 w-20 rounded bg-muted/60" />
                </div>
              </div>
              <div className="px-4 pb-4">
                <div className="h-9 rounded-md bg-muted/40" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
