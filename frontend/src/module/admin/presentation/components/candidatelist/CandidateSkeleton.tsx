export function CandidateSkeleton() {
  return (
    <tr className="border-b border-slate-100 last:border-0">
      <td className="px-6 py-5">
        <div className="flex items-center gap-3.5">
          <div className="h-11 w-11 rounded-full bg-slate-200 animate-pulse" />
          <div className="flex-1">
            <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
            <div className="h-3 w-48 bg-slate-200 rounded mt-2 animate-pulse" />
          </div>
        </div>
      </td>
      <td className="px-5 py-5">
        <div className="flex gap-1.5">
          <div className="h-6 w-20 bg-slate-200 rounded-full animate-pulse" />
          <div className="h-6 w-24 bg-slate-200 rounded-full animate-pulse" />
        </div>
      </td>
      <td className="px-5 py-5"><div className="h-4 w-16 bg-slate-200 rounded animate-pulse" /></td>
      <td className="px-5 py-5"><div className="h-4 w-20 bg-slate-200 rounded animate-pulse" /></td>
      <td className="px-4 py-5 text-center"><div className="h-6 w-10 mx-auto bg-slate-200 rounded-full animate-pulse" /></td>
      <td className="px-4 py-5 text-center"><div className="h-6 w-24 mx-auto bg-slate-200 rounded-full animate-pulse" /></td>
      <td className="px-5 py-5"><div className="h-4 w-24 bg-slate-200 rounded animate-pulse" /></td>
      <td className="px-6 py-5 text-right pr-8"><div className="h-8 w-8 ml-auto bg-slate-200 rounded-lg animate-pulse" /></td>
    </tr>
  );
}