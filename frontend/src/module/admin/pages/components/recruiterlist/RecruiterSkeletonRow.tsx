import { TableRow, TableCell } from "@/components/ui/table";

export function RecruiterSkeletonRow() {
  return (
    <TableRow className="animate-pulse">
      <TableCell className="px-4 md:px-5 lg:px-6 py-4 lg:py-5">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-slate-200" />
          <div className="space-y-2">
            <div className="h-4 w-36 bg-slate-200 rounded" />
            <div className="h-3 w-48 bg-slate-200 rounded" />
          </div>
        </div>
      </TableCell>

      <TableCell className="px-4 md:px-5 py-4 lg:py-5">
        <div className="h-6 w-28 bg-slate-200 rounded-full" />
      </TableCell>

      <TableCell className="hidden lg:table-cell px-5 py-5">
        <div className="h-6 w-28 bg-slate-200 rounded-full" />
      </TableCell>

      <TableCell className="px-4 md:px-5 py-4 lg:py-5 text-center">
        <div className="h-5 w-12 bg-slate-200 rounded mx-auto" />
      </TableCell>

      <TableCell className="px-4 py-4 lg:py-5 text-center">
        <div className="h-6 w-20 bg-slate-200 rounded-full mx-auto" />
      </TableCell>

      <TableCell className="hidden lg:table-cell px-5 py-5">
        <div className="h-4 w-28 bg-slate-200 rounded" />
      </TableCell>

      <TableCell className="px-4 md:px-6 py-4 lg:py-5 text-right">
        <div className="flex gap-1.5 justify-end">
          <div className="h-9 w-9 bg-slate-200 rounded-lg" />
          <div className="h-9 w-9 bg-slate-200 rounded-lg" />
        </div>
      </TableCell>
    </TableRow>
  );
}