import { Input } from "@/components/ui/input";
import {
  MapPin,
  Users,
  Briefcase,
  Building2,
  Globe,
  ChevronDown,
  Check,
  Wifi,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import type { JobFormData } from "@/module/recruiter/presentation/types/jobForm.types";

interface Props {
  formData: JobFormData;
  setFormData: (updater: (prev: JobFormData) => JobFormData) => void;
  errors: Record<string, string>;
}

const departments = [
  "Engineering",
  "Product",
  "Design",
  "Marketing",
  "Sales",
  "Data Science",
  "HR",
  "Finance",
  "Operations",
];

const jobTypes = [
  { value: "full-time", label: "Full-time", emoji: "💼", color: "indigo" },
  { value: "part-time", label: "Part-time", emoji: "⏰", color: "violet" },
  { value: "contract", label: "Contract", emoji: "📝", color: "amber" },
  { value: "internship", label: "Internship", emoji: "🎓", color: "emerald" },
] as const;

function FieldLabel({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="text-sm font-semibold text-gray-700 flex items-center gap-1 mb-2">
      {children}
      {required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
  );
}

function ErrorMsg({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1.5 font-medium">
      <span className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center text-red-500 shrink-0 text-[10px] font-bold">
        !
      </span>
      {msg}
    </p>
  );
}

function DepartmentDropdown({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // FIX: Only the DOM side-effect (focus) stays in useEffect — talking to an
  // external system (the DOM) is exactly what effects are for.
  // The search reset (setSearch) has been moved into the click handler below
  // so it runs as a direct consequence of the user's action, not as a
  // cascading state update triggered by another state change.
  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => {
      searchRef.current?.focus();
    }, 50);
    return () => clearTimeout(timer);
  }, [open]);

  const filtered = departments.filter((d) =>
    d.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => {
          // Reset search text when opening the dropdown — done here in the
          // event handler rather than inside a useEffect to avoid the
          // setState-in-effect cascade.
          setOpen((prev) => {
            if (!prev) setSearch("");
            return !prev;
          });
        }}
        className={`w-full h-12 px-4 flex items-center justify-between rounded-xl border-2 bg-white text-left transition-all duration-200 ${
          open
            ? "border-indigo-500 ring-4 ring-indigo-50 shadow-sm"
            : error
              ? "border-red-400 bg-red-50/50"
              : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
        }`}
      >
        <span
          className={`flex items-center gap-2.5 text-sm ${value ? "text-gray-900 font-medium" : "text-gray-400"}`}
        >
          <Building2
            className={`w-4 h-4 shrink-0 ${value ? "text-indigo-500" : "text-gray-300"}`}
          />
          {value || "Select department"}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 shrink-0 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          className="absolute z-50 mt-2 w-full bg-white border border-gray-100 rounded-2xl shadow-2xl shadow-gray-200/80 overflow-hidden"
          style={{ animation: "dropdownIn 0.15s ease-out" }}
        >
          <div className="p-3 border-b border-gray-50">
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search departments..."
              className="w-full h-9 px-3 text-sm rounded-lg bg-gray-50 border border-gray-100 outline-none focus:border-indigo-300 focus:bg-white transition-all placeholder:text-gray-400"
            />
          </div>
          <div className="p-2 max-h-56 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="text-center text-gray-400 text-sm py-4">
                No departments found
              </p>
            ) : (
              filtered.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => {
                    onChange(d);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all duration-100 ${
                    value === d
                      ? "bg-indigo-50 text-indigo-700 font-semibold"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {value === d && (
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                    )}
                    {d}
                  </span>
                  {value === d && (
                    <Check
                      className="w-4 h-4 text-indigo-500"
                      strokeWidth={2.5}
                    />
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}

      <ErrorMsg msg={error} />
      <style>{`
        @keyframes dropdownIn {
          from { opacity: 0; transform: translateY(-6px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}

export default function Step1BasicInfo({
  formData,
  setFormData,
  errors,
}: Props) {
  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center">
            <Briefcase className="w-4 h-4 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            Basic Information
          </h2>
        </div>
        <p className="text-gray-500 text-sm ml-10">
          Start with the core details of this position
        </p>
      </div>

      <div className="space-y-6">

        {/* ── Company Name ── */}
        <div>
          <FieldLabel required>
            <Building2 className="w-3.5 h-3.5" /> Company Name
          </FieldLabel>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <Building2
                className={`w-4 h-4 transition-colors duration-200 ${
                  formData.companyName ? "text-indigo-500" : "text-gray-300"
                }`}
              />
            </div>
            <Input
              value={formData.companyName}
              onChange={(e) =>
                setFormData((p) => ({ ...p, companyName: e.target.value }))
              }
              placeholder="e.g., Acme Technologies Pvt. Ltd."
              className={`h-12 pl-11 rounded-xl border-2 text-sm font-medium transition-all duration-200 focus:ring-4 focus:ring-indigo-50 placeholder:text-gray-300 placeholder:font-normal ${
                errors.companyName
                  ? "border-red-400 bg-red-50/50 focus:border-red-400"
                  : "border-gray-200 focus:border-indigo-500"
              }`}
            />
            {formData.companyName && (
              <span className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100">
                <Check className="w-3 h-3 text-emerald-600" strokeWidth={3} />
              </span>
            )}
          </div>
          <ErrorMsg msg={errors.companyName} />
        </div>

        {/* ── Job Title ── */}
        <div>
          <FieldLabel required>Job Title</FieldLabel>
          <Input
            value={formData.title}
            onChange={(e) =>
              setFormData((p) => ({ ...p, title: e.target.value }))
            }
            placeholder="e.g., Senior Software Engineer (Backend)"
            className={`h-12 rounded-xl border-2 text-sm font-medium transition-all duration-200 focus:ring-4 focus:ring-indigo-50 placeholder:text-gray-300 placeholder:font-normal ${
              errors.title
                ? "border-red-400 bg-red-50/50 focus:border-red-400"
                : "border-gray-200 focus:border-indigo-500"
            }`}
          />
          <ErrorMsg msg={errors.title} />
        </div>

        {/* ── Department + Openings ── */}
        <div className="grid grid-cols-2 gap-5">
          <div>
            <FieldLabel required>Department</FieldLabel>
            <DepartmentDropdown
              value={formData.department}
              onChange={(v) => setFormData((p) => ({ ...p, department: v }))}
              error={errors.department}
            />
          </div>

          <div>
            <FieldLabel required>
              <Users className="w-3.5 h-3.5" /> Number of Openings
            </FieldLabel>
            <div className="relative">
              <Input
                type="number"
                min={1}
                max={99}
                value={formData.positions}
                onChange={(e) =>
                  setFormData((p) => ({
                    ...p,
                    positions: parseInt(e.target.value) || 1,
                  }))
                }
                className={`h-12 rounded-xl border-2 text-sm font-medium transition-all duration-200 focus:ring-4 focus:ring-indigo-50 pr-16 ${
                  errors.positions
                    ? "border-red-400 bg-red-50/50"
                    : "border-gray-200 focus:border-indigo-500"
                }`}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium pointer-events-none">
                {formData.positions === 1 ? "seat" : "seats"}
              </span>
            </div>
            <ErrorMsg msg={errors.positions} />
          </div>
        </div>

        {/* ── Employment Type ── */}
        <div>
          <FieldLabel required>
            <Briefcase className="w-3.5 h-3.5" /> Employment Type
          </FieldLabel>
          <div className="grid grid-cols-4 gap-3">
            {jobTypes.map((t) => {
              const isSelected = formData.jobType === t.value;
              const colorClasses: Record<
                string,
                { active: string; inactive: string }
              > = {
                indigo: {
                  active:
                    "border-indigo-500 bg-indigo-50 text-indigo-700 shadow-md shadow-indigo-100",
                  inactive:
                    "border-gray-200 text-gray-500 hover:border-indigo-300 hover:bg-indigo-50/40 hover:text-indigo-600",
                },
                violet: {
                  active:
                    "border-violet-500 bg-violet-50 text-violet-700 shadow-md shadow-violet-100",
                  inactive:
                    "border-gray-200 text-gray-500 hover:border-violet-300 hover:bg-violet-50/40 hover:text-violet-600",
                },
                amber: {
                  active:
                    "border-amber-500 bg-amber-50 text-amber-700 shadow-md shadow-amber-100",
                  inactive:
                    "border-gray-200 text-gray-500 hover:border-amber-300 hover:bg-amber-50/40 hover:text-amber-600",
                },
                emerald: {
                  active:
                    "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-md shadow-emerald-100",
                  inactive:
                    "border-gray-200 text-gray-500 hover:border-emerald-300 hover:bg-emerald-50/40 hover:text-emerald-600",
                },
              };
              const cls = colorClasses[t.color];
              return (
                <button
                  key={t.value}
                  type="button"
                  onClick={() =>
                    setFormData((p) => ({ ...p, jobType: t.value }))
                  }
                  className={`flex flex-col items-center py-3.5 px-2 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${
                    isSelected ? cls.active : cls.inactive
                  }`}
                >
                  <span className="text-lg mb-1">{t.emoji}</span>
                  {t.label}
                  {isSelected && (
                    <span className="mt-1 w-1.5 h-1.5 rounded-full bg-current opacity-60" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Location ── */}
        <div className="p-5 bg-linear-to-br from-slate-50 to-gray-50 rounded-2xl border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">
                Job Location <span className="text-red-400">*</span>
              </p>
              <p className="text-xs text-gray-400">
                Where will this role be based?
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {(["city", "state", "country"] as const).map((field) => (
              <div key={field}>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest block mb-1.5">
                  {field}
                </label>
                <Input
                  value={formData.location[field]}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      location: { ...p.location, [field]: e.target.value },
                    }))
                  }
                  placeholder={
                    field === "city"
                      ? "Mumbai"
                      : field === "state"
                        ? "Maharashtra"
                        : "India"
                  }
                  className={`h-11 rounded-xl border-2 bg-white text-sm transition-all duration-200 focus:ring-4 focus:ring-blue-50 placeholder:text-gray-300 ${
                    errors[`location.${field}`]
                      ? "border-red-400 bg-red-50/50"
                      : "border-gray-200 focus:border-blue-400"
                  }`}
                />
                <ErrorMsg msg={errors[`location.${field}`]} />
              </div>
            ))}
          </div>
        </div>

        {/* ── Remote Toggle ── */}
        <div>
          <button
            type="button"
            onClick={() =>
              setFormData((p) => ({ ...p, isRemote: !p.isRemote }))
            }
            className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all duration-300 text-left ${
              formData.isRemote
                ? "border-emerald-400 bg-linear-to-r from-emerald-50 to-teal-50"
                : "border-gray-200 bg-gray-50/50 hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  formData.isRemote ? "bg-emerald-100 scale-105" : "bg-gray-100"
                }`}
              >
                {formData.isRemote ? (
                  <Wifi className="w-5 h-5 text-emerald-600" />
                ) : (
                  <Globe className="w-5 h-5 text-gray-400" />
                )}
              </div>
              <div>
                <p
                  className={`font-semibold text-sm transition-colors duration-300 ${
                    formData.isRemote ? "text-emerald-800" : "text-gray-700"
                  }`}
                >
                  Remote Work Available
                </p>
                <p
                  className={`text-xs mt-0.5 transition-colors duration-300 ${
                    formData.isRemote ? "text-emerald-600" : "text-gray-400"
                  }`}
                >
                  {formData.isRemote
                    ? "Candidates can work from anywhere in the world"
                    : "On-site presence required at the specified location"}
                </p>
              </div>
            </div>

            <div
              className={`relative w-12 h-6 rounded-full transition-all duration-300 shrink-0 ${
                formData.isRemote ? "bg-emerald-500" : "bg-gray-300"
              }`}
            >
              <div
                className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${
                  formData.isRemote ? "left-7" : "left-1"
                }`}
              />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}