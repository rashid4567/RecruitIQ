export default function InterviewsSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="divide-y divide-slate-100">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="flex flex-col gap-3 p-3.5 min-[375px]:p-4 sm:p-5 lg:hidden">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 shrink-0 rounded-lg bg-slate-200" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 w-2/5 rounded bg-slate-200" />
                <div className="h-2.5 w-1/3 rounded bg-slate-100" />
              </div>
              <div className="h-5 w-16 rounded-full bg-slate-200" />
            </div>
            <div className="h-2.5 w-1/2 rounded bg-slate-100" />
          </div>

          <div className="hidden grid-cols-[1.3fr_1.7fr_1fr_0.9fr_1fr_auto] items-center gap-3 px-5 py-4 lg:grid">
            <div className="space-y-1.5">
              <div className="h-3 w-16 rounded bg-slate-200" />
              <div className="h-2.5 w-10 rounded bg-slate-100" />
            </div>
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 shrink-0 rounded-lg bg-slate-200" />
              <div className="w-2/3 space-y-1.5">
                <div className="h-3 w-full max-w-24 rounded bg-slate-200" />
                <div className="hidden h-2.5 w-full max-w-32 rounded bg-slate-100 lg:block" />
              </div>
            </div>
            <div className="h-3 w-3/4 rounded bg-slate-200" />
            <div className="h-6 w-20 rounded-full bg-slate-100" />
            <div className="h-6 w-24 rounded-full bg-slate-200" />
            <div className="h-7 w-20 rounded-lg bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );
}