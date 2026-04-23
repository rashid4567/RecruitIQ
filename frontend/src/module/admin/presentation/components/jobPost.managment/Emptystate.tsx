import { Briefcase, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onRefresh: () => void;
}

export function EmptyState({ onRefresh }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 bg-white rounded-2xl border border-slate-200 shadow-sm text-center">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
        <Briefcase className="w-7 h-7 text-slate-400" />
      </div>
      <h3 className="text-base font-bold text-slate-900 mb-1">No job posts found</h3>
      <p className="text-sm text-slate-500 max-w-xs">
        Try adjusting your search query or filter tabs to find what you're looking for.
      </p>
      <Button
        variant="outline"
        size="sm"
        className="mt-5 gap-2 rounded-xl"
        onClick={onRefresh}
      >
        <RefreshCw className="w-3.5 h-3.5" />
        Refresh
      </Button>
    </div>
  );
}