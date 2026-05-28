import { TableRow, TableCell } from "@/components/ui/table";

export function EmailLogsSkeletonRow() {
  return (
    <TableRow>
      <TableCell>
        <div className="h-5 w-5 bg-slate-200 rounded animate-pulse" />
      </TableCell>
      <TableCell>
        <div className="h-4 w-20 bg-slate-200 rounded animate-pulse" />
      </TableCell>
      <TableCell>
        <div className="h-4 w-48 bg-slate-200 rounded animate-pulse" />
      </TableCell>
      <TableCell>
        <div className="h-4 w-64 bg-slate-200 rounded animate-pulse" />
      </TableCell>
      <TableCell>
        <div className="h-6 w-20 bg-slate-200 rounded-full animate-pulse" />
      </TableCell>
      <TableCell>
        <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
      </TableCell>
      <TableCell>
        <div className="h-6 w-24 bg-slate-200 rounded-full animate-pulse" />
      </TableCell>
      <TableCell>
        <div className="h-8 w-8 bg-slate-200 rounded-lg ml-auto animate-pulse" />
      </TableCell>
    </TableRow>
  );
}