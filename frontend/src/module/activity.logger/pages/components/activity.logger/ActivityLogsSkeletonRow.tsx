import { TableRow, TableCell } from "@/components/ui/table";

export function ActivityLogsSkeletonRow() {
  return (
    <TableRow className="border-b border-slate-100">
      <TableCell className="pl-6 w-12">
        <div className="h-4 w-4 bg-slate-200 rounded animate-pulse" />
      </TableCell>
      <TableCell className="w-36">
        <div className="space-y-1.5">
          <div className="h-3.5 w-24 bg-slate-200 rounded animate-pulse" />
          <div className="h-3 w-16 bg-slate-100 rounded animate-pulse" />
        </div>
      </TableCell>
      <TableCell className="w-28 hidden lg:table-cell">
        <div className="h-3 w-16 bg-slate-100 rounded animate-pulse" />
      </TableCell>
      <TableCell className="w-28">
        <div className="h-6 w-20 bg-slate-200 rounded-full animate-pulse" />
      </TableCell>
      <TableCell className="w-56">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-full bg-slate-200 animate-pulse shrink-0" />
          <div className="space-y-1.5 flex-1">
            <div className="h-3.5 w-28 bg-slate-200 rounded animate-pulse" />
            <div className="h-3 w-16 bg-slate-100 rounded animate-pulse" />
          </div>
        </div>
      </TableCell>
      <TableCell className="w-44">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-lg bg-slate-100 animate-pulse" />
          <div className="h-3.5 w-24 bg-slate-100 rounded animate-pulse" />
        </div>
      </TableCell>
      <TableCell>
        <div className="space-y-1.5">
          <div className="h-3.5 w-3/4 bg-slate-100 rounded animate-pulse" />
          <div className="h-3.5 w-1/2 bg-slate-100 rounded animate-pulse" />
        </div>
      </TableCell>
      <TableCell className="pr-6 w-14">
        <div className="h-8 w-8 bg-slate-100 rounded-lg animate-pulse ml-auto" />
      </TableCell>
    </TableRow>
  );
}