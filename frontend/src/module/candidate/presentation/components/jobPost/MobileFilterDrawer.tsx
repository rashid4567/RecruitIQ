import React from "react";
import { X } from "lucide-react";
import type { JobPostFilters } from "@/module/candidate/domain/dto/JobPostDTO";
import { FilterSidebar } from "./FilterSidebar";


interface MobileFilterDrawerProps {
  isOpen: boolean;
  filters: JobPostFilters;
  onClose: () => void;
  onFilterChange: (f: Partial<JobPostFilters>) => void;
  onReset: () => void;
}

export const MobileFilterDrawer: React.FC<MobileFilterDrawerProps> = ({
  isOpen,
  filters,
  onClose,
  onFilterChange,
  onReset,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="absolute right-0 top-0 bottom-0 w-72 bg-white shadow-2xl overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h3 className="font-bold text-slate-900">Filters</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5">
          <FilterSidebar
            filters={filters}
            onFilterChange={(f: Partial<JobPostFilters>) => {
              onFilterChange(f);
              onClose();
            }}
            onReset={() => {
              onReset();
              onClose();
            }}
          />
        </div>
      </div>
    </div>
  );
};