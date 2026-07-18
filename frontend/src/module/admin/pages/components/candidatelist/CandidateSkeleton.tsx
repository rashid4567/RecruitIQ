export function CandidateSkeleton() {
  return (
    <tr className="border-b border-slate-100 last:border-0">
      <td className="pl-2 pr-4 md:pl-3 md:pr-5 lg:pl-4 lg:pr-6 py-4 lg:py-5">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-slate-200 animate-pulse shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="h-4 w-28 bg-slate-200 rounded animate-pulse" />
            <div className="h-3 w-40 bg-slate-200 rounded mt-2 animate-pulse" />
          </div>
        </div>
      </td>
      <td className="px-4 md:px-5 py-4 lg:py-5">
        <div className="flex gap-1.5">
          <div className="h-6 w-20 bg-slate-200 rounded-full animate-pulse" />
          <div className="h-6 w-24 bg-slate-200 rounded-full animate-pulse" />
        </div>
      </td>
      <td className="hidden lg:table-cell px-5 py-5">
        <div className="h-4 w-16 bg-slate-200 rounded animate-pulse" />
      </td>
      <td className="hidden lg:table-cell px-5 py-5">
        <div className="h-4 w-20 bg-slate-200 rounded animate-pulse" />
      </td>
      <td className="hidden xl:table-cell px-4 py-5 text-center">
        <div className="h-6 w-10 mx-auto bg-slate-200 rounded-full animate-pulse" />
      </td>
      <td className="px-4 py-4 lg:py-5 text-center">
        <div className="h-6 w-24 mx-auto bg-slate-200 rounded-full animate-pulse" />
      </td>
      <td className="hidden xl:table-cell px-5 py-5">
        <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
      </td>
      <td className="px-4 md:px-6 py-4 lg:py-5 text-right md:pr-8">
        <div className="h-8 w-8 ml-auto bg-slate-200 rounded-lg animate-pulse" />
      </td>
    </tr>
  );
}