export default function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header skeleton */}
      <div className="border-b border-slate-100 pb-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="h-7 w-64 animate-pulse rounded-xl bg-slate-200" />
            <div className="mt-2 h-4 w-48 animate-pulse rounded-lg bg-slate-200" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-44 animate-pulse rounded-2xl bg-slate-200" />
            <div className="h-10 w-10 animate-pulse rounded-2xl bg-slate-200" />
          </div>
        </div>
      </div>

      {/* Scorecards skeleton */}
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100"
          >
            <div className="h-11 w-11 shrink-0 animate-pulse rounded-2xl bg-slate-200" />
            <div>
              <div className="h-7 w-12 animate-pulse rounded-lg bg-slate-200" />
              <div className="mt-1.5 h-3 w-20 animate-pulse rounded bg-slate-200" />
            </div>
          </div>
        ))}
      </div>

      {/* Chart + Table skeleton */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Chart skeleton */}
        <div className="lg:col-span-1">
          <div className="flex flex-col items-center justify-center rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
            <div className="mb-4 h-4 w-36 animate-pulse rounded bg-slate-200" />
            <div className="h-[220px] w-[220px] animate-pulse rounded-full bg-slate-200" />
            <div className="mt-4 flex gap-5">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-3 w-20 animate-pulse rounded bg-slate-200" />
              ))}
            </div>
          </div>
        </div>

        {/* Table skeleton */}
        <div className="lg:col-span-2">
          <div className="rounded-3xl bg-white shadow-sm ring-1 ring-slate-100">
            {/* Filters */}
            <div className="flex items-center justify-between border-b border-slate-100 p-4">
              <div className="h-9 w-72 animate-pulse rounded-xl bg-slate-200" />
              <div className="flex gap-1.5">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-7 w-14 animate-pulse rounded-xl bg-slate-200" />
                ))}
              </div>
            </div>

            {/* Table rows */}
            <div className="p-0">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 border-b border-slate-50 px-4 py-3"
                >
                  <div className="flex-1">
                    <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
                    <div className="mt-1.5 h-3 w-44 animate-pulse rounded bg-slate-200" />
                  </div>
                  <div className="h-4 w-20 animate-pulse rounded bg-slate-200" />
                  <div className="h-6 w-20 animate-pulse rounded-lg bg-slate-200" />
                  <div className="hidden h-4 w-28 animate-pulse rounded bg-slate-200 lg:block" />
                  <div className="hidden h-4 w-24 animate-pulse rounded bg-slate-200 md:block" />
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-slate-100 px-4 py-3">
              <div className="h-3 w-40 animate-pulse rounded bg-slate-200" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
