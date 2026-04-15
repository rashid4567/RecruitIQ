import { TableRow, TableCell } from "@/components/ui/table";

export function RecruiterSkeletonRow() {
  return (
    <TableRow className="animate-pulse">
      <TableCell className="px-6 py-5">
        <div className="flex items-center gap-4">
          <div className="h-11 w-11 rounded-full bg-slate-200" />
          <div className="space-y-2">
            <div className="h-4 w-40 bg-slate-200 rounded" />
            <div className="h-3 w-52 bg-slate-200 rounded" />
          </div>
        </div>
      </TableCell>

      <TableCell className="px-6 py-5">
        <div className="h-6 w-24 bg-slate-200 rounded-full" />
      </TableCell>

      <TableCell className="px-6 py-5">
        <div className="h-6 w-28 bg-slate-200 rounded-full" />
      </TableCell>

      <TableCell className="px-6 py-5 text-center">
        <div className="h-5 w-8 bg-slate-200 rounded mx-auto" />
      </TableCell>

      <TableCell className="px-6 py-5 text-center">
        <div className="h-6 w-20 bg-slate-200 rounded-full mx-auto" />
      </TableCell>

      <TableCell className="px-6 py-5">
        <div className="h-4 w-28 bg-slate-200 rounded" />
      </TableCell>

      <TableCell className="px-6 py-5 text-right">
        <div className="h-8 w-8 bg-slate-200 rounded-lg ml-auto" />
      </TableCell>
    </TableRow>
  );
}