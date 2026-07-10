import { TableRow, TableCell } from "@/components/ui/table";

export function EmailLogsSkeletonRow() {
  return (
    <TableRow className="border-b border-slate-100">
      {/* Checkbox */}
      <TableCell className="pl-6 w-12">
        <div className="h-4 w-4 bg-slate-200 rounded animate-pulse" />
      </TableCell>

      {/* Sent At */}
      <TableCell className="w-44">
        <div className="space-y-1.5">
          <div className="h-3.5 w-24 bg-slate-200 rounded animate-pulse" />
          <div className="h-3 w-16 bg-slate-100 rounded animate-pulse" />
        </div>
      </TableCell>

      {/* Recipient */}
      <TableCell className="w-52">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-full bg-slate-200 animate-pulse shrink-0" />
          <div className="space-y-1.5 flex-1">
            <div className="h-3.5 w-32 bg-slate-200 rounded animate-pulse" />
            <div className="h-3 w-20 bg-slate-100 rounded animate-pulse" />
          </div>
        </div>
      </TableCell>

      {/* Subject */}
      <TableCell>
        <div className="space-y-1.5">
          <div className="h-3.5 w-3/4 bg-slate-200 rounded animate-pulse" />
          <div className="h-3 w-1/2 bg-slate-100 rounded animate-pulse" />
        </div>
      </TableCell>

      {/* Type */}
      <TableCell className="w-28">
        <div className="h-6 w-16 bg-slate-200 rounded-full animate-pulse" />
      </TableCell>

      {/* Status */}
      <TableCell className="w-28">
        <div className="h-6 w-20 bg-slate-200 rounded-full animate-pulse" />
      </TableCell>

      {/* Actions */}
      <TableCell className="pr-6 w-20">
        <div className="flex justify-end gap-1.5">
          <div className="h-8 w-8 bg-slate-100 rounded-lg animate-pulse" />
          <div className="h-8 w-8 bg-slate-100 rounded-lg animate-pulse" />
        </div>
      </TableCell>
    </TableRow>
  );
}
