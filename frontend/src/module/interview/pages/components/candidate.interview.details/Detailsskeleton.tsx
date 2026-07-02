export default function DetailsSkeleton() {
  return (
    <div className="space-y-5 animate-pulse" aria-hidden="true">
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="h-5 w-24 bg-slate-200 rounded-full mb-4" />
        <div className="h-6 w-2/3 bg-slate-200 rounded mb-2" />
        <div className="h-4 w-28 bg-slate-100 rounded mb-4" />
        <div className="h-3 w-1/2 bg-slate-100 rounded" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="h-3 w-20 bg-slate-200 rounded mb-5" />
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-3 w-16 bg-slate-100 rounded" />
                  <div className="h-4 w-24 bg-slate-200 rounded" />
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 h-28" />
        </div>
        <div className="space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 h-40" />
          <div className="rounded-2xl border border-slate-200 bg-white p-5 h-32" />
          <div className="rounded-2xl border border-slate-200 bg-white p-5 h-44" />
        </div>
      </div>
    </div>
  );
}