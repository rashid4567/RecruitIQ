
import React, { useState } from "react";
import { ChevronDown, X } from "lucide-react";
import type { JobPostFilters } from "../../../domain/dto/JobPostDTO";

interface FilterSidebarProps {
  filters: JobPostFilters;
  onFilterChange: (filters: Partial<JobPostFilters>) => void;
  onReset: () => void;
  className?: string;
}

const DEPARTMENTS = ["Engineering", "Product", "Design", "Marketing", "Sales", "HR"];

const EXPERIENCE_LEVELS = [
  { label: "Fresher (0 yrs)", min: 0, max: 0 },
  { label: "Junior (1–2 yrs)", min: 1, max: 2 },
  { label: "Mid (3–5 yrs)", min: 3, max: 5 },
  { label: "Senior (6–8 yrs)", min: 6, max: 8 },
  { label: "Lead (9+ yrs)", min: 9, max: 20 },
];

const JOB_TYPES = [
  { value: "full-time", label: "Full-time" },
  { value: "part-time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
];

const FilterSection: React.FC<{
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}> = ({ title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-slate-100 last:border-0 pb-4 last:pb-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-2.5 text-sm font-semibold text-slate-800 hover:text-indigo-600 transition-colors"
      >
        {title}
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="mt-2 space-y-2.5">{children}</div>}
    </div>
  );
};

const FilterCheckbox: React.FC<{
  id: string;
  label: string;
  checked: boolean;
  onChange: () => void;
}> = ({ id, label, checked, onChange }) => (
  <label htmlFor={id} className="flex items-center gap-3 cursor-pointer group">
    <div
      onClick={onChange}
      className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all shrink-0 ${
        checked ? "bg-indigo-600 border-indigo-600" : "border-slate-300 group-hover:border-indigo-400"
      }`}
    >
      {checked && (
        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      )}
    </div>
    <input type="checkbox" id={id} className="sr-only" checked={checked} onChange={onChange} />
    <span className={`text-sm transition-colors ${checked ? "text-indigo-700 font-medium" : "text-slate-500 group-hover:text-slate-700"}`}>
      {label}
    </span>
  </label>
);

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFilterChange,
  onReset,
  className = "",
}) => {
  const activeCount = [
    filters.department,
    filters.jobType,
    filters.isRemote,
    filters.experienceMin !== undefined,
  ].filter(Boolean).length;

  return (
    <aside className={`w-56 shrink-0 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Filters</h2>
        {activeCount > 0 && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-semibold transition-colors"
          >
            <X className="w-3 h-3" /> Clear ({activeCount})
          </button>
        )}
      </div>

      <div className="space-y-1 bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
        <FilterSection title="Department">
          {DEPARTMENTS.map((dept) => (
            <FilterCheckbox
              key={dept}
              id={`dept-${dept}`}
              label={dept}
              checked={filters.department === dept}
              onChange={() => onFilterChange({ department: filters.department === dept ? undefined : dept })}
            />
          ))}
        </FilterSection>

        <FilterSection title="Experience">
          {EXPERIENCE_LEVELS.map((level) => (
            <FilterCheckbox
              key={level.label}
              id={`exp-${level.label}`}
              label={level.label}
              checked={filters.experienceMin === level.min && filters.experienceMax === level.max}
              onChange={() => {
                if (filters.experienceMin === level.min && filters.experienceMax === level.max) {
                  onFilterChange({ experienceMin: undefined, experienceMax: undefined });
                } else {
                  onFilterChange({ experienceMin: level.min, experienceMax: level.max });
                }
              }}
            />
          ))}
        </FilterSection>

        <FilterSection title="Job Type">
          {JOB_TYPES.map((type) => (
            <FilterCheckbox
              key={type.value}
              id={`type-${type.value}`}
              label={type.label}
              checked={filters.jobType === type.value}
              onChange={() => onFilterChange({ jobType: filters.jobType === type.value ? undefined : (type.value as any) })}
            />
          ))}
          <FilterCheckbox
            id="remote"
            label="Remote Only"
            checked={filters.isRemote === true}
            onChange={() => onFilterChange({ isRemote: filters.isRemote ? undefined : true })}
          />
        </FilterSection>
      </div>
    </aside>
  );
};