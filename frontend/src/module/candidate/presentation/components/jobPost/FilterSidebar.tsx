import React, { useState } from "react";
import { ChevronDown, X, RotateCcw } from "lucide-react";
import type { JobType } from "@/module/candidate/domain/entities/jobPost";
import type { JobPostFilters } from "../../../domain/dto/JobPostDTO";

const DEPARTMENTS = [
  "Engineering",
  "Product",
  "Design",
  "Marketing",
  "Sales",
  "HR",
];

interface ExperienceLevel {
  label: string;
  sublabel: string;
  min: number;
  max: number;
}

const EXPERIENCE_LEVELS: ExperienceLevel[] = [
  { label: "Fresher", sublabel: "0 yrs", min: 0, max: 0 },
  { label: "Junior", sublabel: "1–2 yrs", min: 1, max: 2 },
  { label: "Mid", sublabel: "3–5 yrs", min: 3, max: 5 },
  { label: "Senior", sublabel: "6–8 yrs", min: 6, max: 8 },
  { label: "Lead", sublabel: "9+ yrs", min: 9, max: 20 },
];

const JOB_TYPES: { value: JobType; label: string; color: string }[] = [
  {
    value: "full-time",
    label: "Full-time",
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  {
    value: "part-time",
    label: "Part-time",
    color: "bg-blue-100 text-blue-700 border-blue-200",
  },
  {
    value: "contract",
    label: "Contract",
    color: "bg-amber-100 text-amber-700 border-amber-200",
  },
  {
    value: "internship",
    label: "Internship",
    color: "bg-purple-100 text-purple-700 border-purple-200",
  },
];

function isExperienceSelected(
  filters: JobPostFilters,
  level: ExperienceLevel,
): boolean {
  if (
    filters.experienceMin === undefined ||
    filters.experienceMax === undefined
  )
    return false;
  return (
    filters.experienceMin === level.min && filters.experienceMax === level.max
  );
}

function countActiveFilters(filters: JobPostFilters): number {
  let count = 0;
  if (filters.department !== undefined) count++;
  if (filters.jobType !== undefined) count++;
  if (filters.isRemote !== undefined) count++;
  if (
    filters.experienceMin !== undefined ||
    filters.experienceMax !== undefined
  )
    count++;
  return count;
}

const FilterSection: React.FC<{
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  badge?: number;
}> = ({ title, children, defaultOpen = true, badge }) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="py-4 border-b border-slate-100 last:border-0 last:pb-0">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="flex w-full items-center justify-between group"
        aria-expanded={open}
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400 group-hover:text-indigo-500 transition-colors">
            {title}
          </span>
          {badge ? (
            <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center">
              {badge}
            </span>
          ) : null}
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 group-hover:text-indigo-500 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-200 ${
          open ? "max-h-96 opacity-100 mt-3" : "max-h-0 opacity-0"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

const FilterOption: React.FC<{
  id: string;
  label: string;
  sublabel?: string;
  checked: boolean;
  onChange: () => void;
}> = ({ id, label, sublabel, checked, onChange }) => (
  <label
    htmlFor={id}
    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-150 select-none
      ${checked ? "bg-indigo-50 ring-1 ring-indigo-200" : "hover:bg-slate-50"}`}
  >
    {/* Hidden native checkbox — handles all a11y + click correctly */}
    <input
      type="checkbox"
      id={id}
      checked={checked}
      onChange={onChange}
      className="sr-only"
    />

    {/* Custom visual checkbox */}
    <span
      aria-hidden="true"
      className={`w-4 h-4 rounded-[5px] border-2 flex items-center justify-center shrink-0 transition-all duration-150
        ${
          checked
            ? "bg-indigo-600 border-indigo-600 shadow-sm shadow-indigo-300"
            : "border-slate-300 bg-white"
        }`}
    >
      {checked && (
        <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 10">
          <path
            d="M1.5 5.5L3.5 7.5L8.5 2.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </span>

    <span className="flex-1 flex items-center justify-between gap-2">
      <span
        className={`text-sm font-medium transition-colors ${checked ? "text-indigo-700" : "text-slate-600"}`}
      >
        {label}
      </span>
      {sublabel && (
        <span
          className={`text-xs transition-colors ${checked ? "text-indigo-400" : "text-slate-400"}`}
        >
          {sublabel}
        </span>
      )}
    </span>
  </label>
);

const JobTypePill: React.FC<{
  value: JobType;
  label: string;
  color: string;
  checked: boolean;
  onChange: () => void;
}> = ({ value, label, color, checked, onChange }) => (
  <label
    htmlFor={`type-${value}`}
    className={`inline-flex items-center px-3 py-1.5 rounded-full border text-xs font-semibold cursor-pointer transition-all duration-150 select-none
      ${
        checked
          ? `${color} shadow-sm scale-105`
          : "bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700"
      }`}
  >
    <input
      type="checkbox"
      id={`type-${value}`}
      checked={checked}
      onChange={onChange}
      className="sr-only"
    />
    {label}
  </label>
);

interface FilterSidebarProps {
  filters: JobPostFilters;
  onFilterChange: (filters: Partial<JobPostFilters>) => void;
  onReset: () => void;
  className?: string;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFilterChange,
  onReset,
  className = "",
}) => {
  const activeCount = countActiveFilters(filters);

  const handleDepartmentChange = (dept: string) => {
    onFilterChange({
      department: filters.department === dept ? undefined : dept,
    });
  };

  const handleExperienceChange = (level: ExperienceLevel) => {
    if (isExperienceSelected(filters, level)) {
      onFilterChange({ experienceMin: undefined, experienceMax: undefined });
    } else {
      onFilterChange({ experienceMin: level.min, experienceMax: level.max });
    }
  };

  const handleJobTypeChange = (value: JobType) => {
    onFilterChange({ jobType: filters.jobType === value ? undefined : value });
  };

  const handleRemoteChange = () => {
    onFilterChange({ isRemote: filters.isRemote ? undefined : true });
  };

  return (
    <aside className={`w-60 shrink-0 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold text-slate-900">Filters</h2>
          {activeCount > 0 && (
            <span className="h-5 min-w-5 px-1.5 rounded-full bg-indigo-600 text-white text-[11px] font-bold flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-500 font-medium transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        )}
      </div>

      {/* Panel */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden px-4 divide-y divide-slate-100">
        {/* Department */}
        <FilterSection title="Department" badge={filters.department ? 1 : 0}>
          <div className="space-y-0.5">
            {DEPARTMENTS.map((dept) => (
              <FilterOption
                key={dept}
                id={`dept-${dept}`}
                label={dept}
                checked={filters.department === dept}
                onChange={() => handleDepartmentChange(dept)}
              />
            ))}
          </div>
        </FilterSection>

        {/* Experience */}
        <FilterSection
          title="Experience"
          badge={filters.experienceMin !== undefined ? 1 : 0}
        >
          <div className="space-y-0.5">
            {EXPERIENCE_LEVELS.map((level) => (
              <FilterOption
                key={level.label}
                id={`exp-${level.label}`}
                label={level.label}
                sublabel={level.sublabel}
                checked={isExperienceSelected(filters, level)}
                onChange={() => handleExperienceChange(level)}
              />
            ))}
          </div>
        </FilterSection>

        {/* Job Type */}
        <FilterSection
          title="Job Type"
          badge={(filters.jobType ? 1 : 0) + (filters.isRemote ? 1 : 0)}
        >
          {/* Pills for job type */}
          <div className="flex flex-wrap gap-2 mb-3">
            {JOB_TYPES.map((type) => (
              <JobTypePill
                key={type.value}
                value={type.value}
                label={type.label}
                color={type.color}
                checked={filters.jobType === type.value}
                onChange={() => handleJobTypeChange(type.value)}
              />
            ))}
          </div>

          {/* Remote toggle */}
          <label
            htmlFor="remote-toggle"
            className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-150 select-none
              ${
                filters.isRemote
                  ? "bg-indigo-50 ring-1 ring-indigo-200"
                  : "hover:bg-slate-50"
              }`}
          >
            <input
              type="checkbox"
              id="remote-toggle"
              checked={filters.isRemote === true}
              onChange={handleRemoteChange}
              className="sr-only"
            />
            <div className="flex items-center gap-2.5">
              <span className="text-base" aria-hidden="true">
                🌍
              </span>
              <span
                className={`text-sm font-medium ${filters.isRemote ? "text-indigo-700" : "text-slate-600"}`}
              >
                Remote Only
              </span>
            </div>
            {/* Toggle switch */}
            <span
              aria-hidden="true"
              className={`relative inline-flex w-9 h-5 rounded-full transition-colors duration-200 shrink-0
                ${filters.isRemote ? "bg-indigo-600" : "bg-slate-200"}`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200
                  ${filters.isRemote ? "translate-x-4" : "translate-x-0"}`}
              />
            </span>
          </label>
        </FilterSection>
      </div>

      {/* Active filter chips — quick remove */}
      {activeCount > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3 px-1">
          {filters.department && (
            <button
              type="button"
              onClick={() => onFilterChange({ department: undefined })}
              className="flex items-center gap-1 px-2.5 py-1 bg-indigo-50 border border-indigo-200 rounded-full text-xs text-indigo-700 font-medium hover:bg-indigo-100 transition-colors"
            >
              {filters.department}
              <X className="w-3 h-3" />
            </button>
          )}
          {filters.jobType && (
            <button
              type="button"
              onClick={() => onFilterChange({ jobType: undefined })}
              className="flex items-center gap-1 px-2.5 py-1 bg-indigo-50 border border-indigo-200 rounded-full text-xs text-indigo-700 font-medium hover:bg-indigo-100 transition-colors"
            >
              {JOB_TYPES.find((t) => t.value === filters.jobType)?.label}
              <X className="w-3 h-3" />
            </button>
          )}
          {filters.experienceMin !== undefined && (
            <button
              type="button"
              onClick={() =>
                onFilterChange({
                  experienceMin: undefined,
                  experienceMax: undefined,
                })
              }
              className="flex items-center gap-1 px-2.5 py-1 bg-indigo-50 border border-indigo-200 rounded-full text-xs text-indigo-700 font-medium hover:bg-indigo-100 transition-colors"
            >
              {
                EXPERIENCE_LEVELS.find((l) => l.min === filters.experienceMin)
                  ?.label
              }
              <X className="w-3 h-3" />
            </button>
          )}
          {filters.isRemote && (
            <button
              type="button"
              onClick={() => onFilterChange({ isRemote: undefined })}
              className="flex items-center gap-1 px-2.5 py-1 bg-indigo-50 border border-indigo-200 rounded-full text-xs text-indigo-700 font-medium hover:bg-indigo-100 transition-colors"
            >
              Remote
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      )}
    </aside>
  );
};
