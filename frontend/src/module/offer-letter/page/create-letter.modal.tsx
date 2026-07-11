"use client";

import React, { useState, useMemo, useCallback, type JSX } from "react";
import {
  X,
  Check,
  AlertTriangle,
  Loader2,
  CalendarDays,
  Plus,
  ChevronDown,
  Sparkles,
  ArrowRight,
  Info,
} from "lucide-react";

import { useCreateOffer } from "../hooks/recruiter/useCreateOffer";
import type { CreateOfferRequest } from "../types/recruiterOffer.types";

interface Benefit {
  id: string;
  label: string;
  checked: boolean;
}

interface FormState {
  ctc: string;
  currency: string;
  joiningDate: string;
  probation: string;
  expiryDate: string;
  notes: string;
}

interface FormErrors {
  ctc?: string;
  joiningDate?: string;
  expiryDate?: string;
  benefits?: string;
}

interface CandidateData {
  id: string;
  name: string;
  role: string;
  appId: string;
  applicationId: string;
  aiScore: number;
}

interface JobData {
  id: string;
  company: string;
  title: string;
  department: string;
  location: string;
  employmentType: string;
}

const CURRENCIES = ["INR", "USD", "EUR", "GBP"];
const PROBATIONS = ["No Probation", "3 Months", "6 Months", "12 Months"];

const DEFAULT_BENEFITS: Benefit[] = [
  { id: "health", label: "Health Insurance", checked: true },
  { id: "pf", label: "Provident Fund", checked: true },
  { id: "flex", label: "Flexible Working", checked: true },
  { id: "bonus", label: "Annual Bonus", checked: true },
  { id: "leave", label: "Paid Leave", checked: true },
  { id: "laptop", label: "Laptop", checked: true },
];

// Utility functions
function todayISO(): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}

function formatINR(n: number | string): string {
  if (!n && n !== 0) return "";
  return new Intl.NumberFormat("en-IN").format(Number(n));
}

function formatDateLong(iso: string): string {
  if (!iso) return "—";
  const d = new Date(iso + "T00:00:00");
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function daysUntil(iso: string): number | null {
  if (!iso) return null;
  const target = new Date(iso + "T00:00:00");
  const today = new Date(todayISO() + "T00:00:00");
  return Math.round((target.getTime() - today.getTime()) / 86400000);
}

// Shared Tailwind fragments (kept as plain strings so they're easy to reuse
// without falling back to custom CSS classes)
const DATE_ICON_CLASSES =
  "[&::-webkit-calendar-picker-indicator]:opacity-[0.55] [&::-webkit-calendar-picker-indicator]:cursor-pointer";

// Component: Field Label
interface FieldLabelProps {
  children: React.ReactNode;
  required?: boolean;
}

function FieldLabel({ children, required }: FieldLabelProps): JSX.Element {
  return (
    <label className="mb-1.5 block text-sm font-medium text-slate-600">
      {children}
      {required && <span className="ml-0.5 text-red-600">*</span>}
    </label>
  );
}

// Component: Field Error
interface FieldErrorProps {
  children?: React.ReactNode;
}

function FieldError({ children }: FieldErrorProps): JSX.Element | null {
  if (!children) return null;
  return (
    <p className="mt-1.5 flex items-center gap-1 text-xs text-red-600">
      <AlertTriangle size={12} strokeWidth={2.5} />
      {children}
    </p>
  );
}

// Component: Field Ok
interface FieldOkProps {
  show: boolean;
}

function FieldOk({ show }: FieldOkProps): JSX.Element | null {
  if (!show) return null;
  return (
    <p className="mt-1.5 flex items-center gap-1 text-xs text-emerald-600">
      <Check size={12} strokeWidth={3} />
      Looks good
    </p>
  );
}

// Component: Info Row
interface InfoRowProps {
  label: string;
  value: string | number;
}

function InfoRow({ label, value }: InfoRowProps): JSX.Element {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 py-2.5 last:border-0">
      <span className="text-xs text-slate-500">{label}</span>
      <span className="text-sm font-medium text-slate-900">{value}</span>
    </div>
  );
}

interface EmploymentOfferModalProps {
  /** The candidate this offer is being created for */
  candidate: CandidateData;
  /** The job the candidate applied to */
  job: JobData;
  /**
   * Called once the offer has been created successfully. The parent decides
   * what happens next (toast, refetch, navigate, etc) — this component does
   * not show its own success screen and does not manage its own visibility.
   */
  onSent?: (offerNumber: string) => void;
  /** Called whenever the modal should be dismissed (X, backdrop, Cancel). The
   *  parent owns whether this component is rendered at all. */
  onClose: () => void;
}

// Main Component
export default function EmploymentOfferModal({
  candidate,
  job,
  onSent,
  onClose,
}: EmploymentOfferModalProps): JSX.Element {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { createOffer, loading: sending, error: apiError } = useCreateOffer();

  const [formState, setFormState] = useState<FormState>({
    ctc: "",
    currency: "INR",
    joiningDate: "",
    probation: "6 Months",
    expiryDate: "",
    notes: "",
  });

  const [benefits, setBenefits] = useState<Benefit[]>(DEFAULT_BENEFITS);
  const [newBenefit, setNewBenefit] = useState("");
  const [addingBenefit, setAddingBenefit] = useState(false);

  const activeBenefits = useMemo(
    () => benefits.filter((b) => b.checked),
    [benefits],
  );

  // Validation logic
  const errors: FormErrors = useMemo(() => {
    const e: FormErrors = {};
    const ctcNum = Number(formState.ctc);

    if (!formState.ctc || Number.isNaN(ctcNum) || ctcNum <= 0) {
      e.ctc = "Required";
    } else if (ctcNum < 1000) {
      e.ctc = "Enter a realistic annual CTC";
    } else if (ctcNum > 100000000) {
      e.ctc = "That looks too high, please check";
    }

    if (!formState.joiningDate) {
      e.joiningDate = "Required";
    } else if (formState.joiningDate < todayISO()) {
      e.joiningDate = "Cannot be before today";
    }

    if (!formState.expiryDate) {
      e.expiryDate = "Required";
    } else if (formState.expiryDate < todayISO()) {
      e.expiryDate = "Cannot be before today";
    } else if (
      formState.joiningDate &&
      formState.expiryDate >= formState.joiningDate
    ) {
      e.expiryDate = "Must be before joining date";
    }

    if (activeBenefits.length === 0) {
      e.benefits = "Select at least one benefit";
    }

    return e;
  }, [formState, activeBenefits]);

  const isValid = Object.keys(errors).length === 0;
  const requiredFilled = [
    formState.ctc,
    formState.joiningDate,
    formState.expiryDate,
  ].filter(Boolean).length;
  const progressPct = Math.round((requiredFilled / 3) * 100);

  // Handlers
  const mark = (field: string): void => {
    setTouched((t) => ({ ...t, [field]: true }));
  };

  const handleFieldChange = (field: keyof FormState, value: string): void => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const toggleBenefit = (id: string): void => {
    setBenefits((bs) =>
      bs.map((b) => (b.id === id ? { ...b, checked: !b.checked } : b)),
    );
    mark("benefits");
  };

  const addBenefitHandler = (): void => {
    const label = newBenefit.trim();
    if (!label) {
      setAddingBenefit(false);
      return;
    }
    const isDuplicate = benefits.some(
      (b) => b.label.toLowerCase() === label.toLowerCase(),
    );
    if (!isDuplicate) {
      setBenefits((bs) => [
        ...bs,
        { id: `custom-${Date.now()}`, label, checked: true },
      ]);
    }
    setNewBenefit("");
    setAddingBenefit(false);
    mark("benefits");
  };

  const handleSubmitClick = (): void => {
    setTouched({
      ctc: true,
      joiningDate: true,
      expiryDate: true,
      benefits: true,
    });
    if (!isValid) return;
    setSubmitError(null);
    setConfirmOpen(true);
  };

  // Single responsibility: create the offer, tell the parent it worked, and
  // let the parent decide what happens next. No local success screen, no
  // local open/close bookkeeping.
  const handleConfirmSend = useCallback(async (): Promise<void> => {
    setSubmitError(null);

    const payload: CreateOfferRequest = {
      applicationId: candidate.applicationId,
      annualCTC: Number(formState.ctc),
      currency: formState.currency,
      employmentType: job.employmentType,
      department: job.department || undefined,
      workLocation: job.location,
      joiningDate: formState.joiningDate,
      probationPeriod:
        formState.probation === "No Probation"
          ? undefined
          : formState.probation,
      benefits: activeBenefits.map((b) => b.label),
      notes: formState.notes.trim() || undefined,
      expiryDate: formState.expiryDate,
    };

    try {
      const response = await createOffer(payload);
      onSent?.(response.offerNumber);
      onClose();
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Something went wrong while sending the offer.",
      );
    }
  }, [
    candidate.applicationId,
    formState,
    job,
    activeBenefits,
    createOffer,
    onSent,
    onClose,
  ]);

  const expiryDays = daysUntil(formState.expiryDate);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/50 p-4 font-sans sm:p-8">
      <div
        onMouseDown={(e) => e.target === e.currentTarget && onClose()}
        className="fixed inset-0 -z-10"
      />

      <div className="relative flex max-h-[88vh] w-full max-w-6xl animate-modalIn flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_20px_70px_rgba(15,23,42,0.15)] motion-reduce:animate-none">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 px-7 pb-5 pt-6">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
              <span className="h-2 w-2 rounded-full bg-emerald-600" />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-slate-900">
                Employment Offer
              </h1>
              <p className="mt-0.5 text-xs text-slate-500">
                Create and send an official offer to the selected candidate.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            <X size={18} />
          </button>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-3 border-b border-slate-200 bg-slate-50 px-7 py-3">
          <span className="shrink-0 text-xs font-medium text-slate-500">
            Offer Information
          </span>
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-blue-500 transition-all duration-500 ease-out"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className="shrink-0 text-xs font-semibold text-slate-700">
            {progressPct}%
          </span>
        </div>

        {/* Body - Form and Preview */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left — form */}
          <div className="flex-1 overflow-y-auto px-7 py-6">
            {/* Candidate hero card */}
            <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_rgba(37,99,235,0.06)]">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-500 text-base font-semibold text-white">
                  {candidate.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-base font-semibold text-slate-900">
                    {candidate.name}
                  </div>
                  <div className="mt-0.5 text-xs text-slate-500">
                    {candidate.role} &middot;{" "}
                    <span className="font-mono-fig">{candidate.appId}</span>
                  </div>
                </div>
                <div className="flex shrink-0 flex-col items-center">
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-full border-4 border-blue-100">
                    <span className="text-xs font-bold text-blue-500">
                      {candidate.aiScore}%
                    </span>
                  </div>
                  <span className="mt-1 text-[10px] font-medium uppercase tracking-wide text-slate-400">
                    AI Score
                  </span>
                </div>
              </div>

              {/* Timeline */}
              <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4">
                {["Applied", "Interview", "Selected"].map((step, i) => (
                  <React.Fragment key={step}>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`flex h-4 w-4 items-center justify-center rounded-full ${
                          i < 2
                            ? "bg-emerald-600"
                            : "border-2 border-emerald-600 bg-white"
                        }`}
                      >
                        {i < 2 && (
                          <Check
                            size={10}
                            className="text-white"
                            strokeWidth={3}
                          />
                        )}
                      </span>
                      <span
                        className={`text-xs font-medium ${
                          i === 2 ? "text-emerald-600" : "text-slate-700"
                        }`}
                      >
                        {step}
                      </span>
                    </div>
                    {i < 2 && <div className="h-px w-6 bg-slate-200" />}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Job info */}
            <section className="mb-6">
              <div className="mb-2.5 flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                <Info size={13} className="text-blue-500" />
                <span className="uppercase tracking-wide">Job Information</span>
              </div>
              <div className="grid grid-cols-2 gap-x-8 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-1">
                <div>
                  <InfoRow label="Company" value={job.company} />
                  <InfoRow label="Department" value={job.department || "—"} />
                </div>
                <div>
                  <InfoRow label="Job Role" value={job.title} />
                  <InfoRow label="Location" value={job.location} />
                </div>
              </div>
            </section>

            {/* Compensation card */}
            <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="mb-5 flex items-center gap-1.5 text-sm font-semibold text-slate-900">
                <span>💰</span> Compensation
              </h2>
              <div className="grid grid-cols-2 gap-x-5 gap-y-5 sm:grid-cols-4">
                <div className="col-span-2">
                  <FieldLabel required>Annual CTC</FieldLabel>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 font-mono-fig text-base text-slate-400">
                      ₹
                    </span>
                    <input
                      type="number"
                      inputMode="numeric"
                      min={0}
                      value={formState.ctc}
                      onChange={(e) => handleFieldChange("ctc", e.target.value)}
                      onBlur={() => mark("ctc")}
                      placeholder="12,00,000"
                      className={`w-full rounded-xl border bg-white px-3 py-3 pl-8 font-mono-fig text-base font-semibold text-slate-900 outline-none transition-all duration-150 placeholder:text-slate-400 ${
                        touched.ctc && errors.ctc
                          ? "border-red-600 focus:ring-2 focus:ring-red-600/15"
                          : "border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15"
                      }`}
                    />
                  </div>
                  {touched.ctc && <FieldError>{errors.ctc}</FieldError>}
                  <FieldOk show={touched.ctc && !errors.ctc} />
                </div>

                <div>
                  <FieldLabel>Currency</FieldLabel>
                  <div className="relative">
                    <select
                      value={formState.currency}
                      onChange={(e) =>
                        handleFieldChange("currency", e.target.value)
                      }
                      className="w-full appearance-none rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-sm font-medium text-slate-900 outline-none transition-all duration-150 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15"
                    >
                      {CURRENCIES.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                    <ChevronDown
                      size={14}
                      className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <FieldLabel>Probation</FieldLabel>
                  <div className="relative">
                    <select
                      value={formState.probation}
                      onChange={(e) =>
                        handleFieldChange("probation", e.target.value)
                      }
                      className="w-full appearance-none rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-sm font-medium text-slate-900 outline-none transition-all duration-150 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15"
                    >
                      {PROBATIONS.map((p) => (
                        <option key={p}>{p}</option>
                      ))}
                    </select>
                    <ChevronDown
                      size={14}
                      className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                  </div>
                </div>

                <div className="col-span-2">
                  <FieldLabel required>Joining Date</FieldLabel>
                  <div className="relative">
                    <CalendarDays
                      size={15}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="date"
                      value={formState.joiningDate}
                      min={todayISO()}
                      onChange={(e) =>
                        handleFieldChange("joiningDate", e.target.value)
                      }
                      onBlur={() => mark("joiningDate")}
                      className={`w-full rounded-xl border bg-white px-3 py-3 pl-9 text-xs text-slate-900 outline-none transition-all duration-150 placeholder:text-slate-400 ${DATE_ICON_CLASSES} ${
                        touched.joiningDate && errors.joiningDate
                          ? "border-red-600 focus:ring-2 focus:ring-red-600/15"
                          : "border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15"
                      }`}
                    />
                  </div>
                  {touched.joiningDate && (
                    <FieldError>{errors.joiningDate}</FieldError>
                  )}
                  <FieldOk show={touched.joiningDate && !errors.joiningDate} />
                </div>
              </div>
            </section>

            {/* Benefits */}
            <section className="mb-6">
              <h2 className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Benefits
              </h2>
              {activeBenefits.length === 0 && !addingBenefit ? (
                <div
                  className={`rounded-2xl border border-dashed px-4 py-5 text-center ${
                    touched.benefits && errors.benefits
                      ? "border-red-400"
                      : "border-slate-300"
                  }`}
                >
                  <p className="mb-2 text-xs text-slate-400">
                    No benefits added
                  </p>
                  <button
                    onClick={() => setAddingBenefit(true)}
                    className="text-xs font-medium text-blue-500 hover:underline"
                  >
                    + Add Benefit
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                  {benefits.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => toggleBenefit(b.id)}
                      className={`flex items-center gap-2 rounded-xl border px-3.5 py-3 text-left text-xs font-medium transition-all duration-150 ease-linear hover:border-blue-600 ${
                        b.checked
                          ? "border-emerald-600 bg-emerald-50 text-slate-900 shadow-[0_1px_2px_rgba(5,150,105,0.08)]"
                          : "border-slate-200 bg-white text-slate-500"
                      }`}
                    >
                      <span
                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                          b.checked
                            ? "border-emerald-600 bg-emerald-600"
                            : "border-slate-300 bg-white"
                        }`}
                      >
                        {b.checked && (
                          <Check
                            size={10}
                            className="text-white"
                            strokeWidth={3}
                          />
                        )}
                      </span>
                      {b.label}
                    </button>
                  ))}
                  {addingBenefit ? (
                    <div className="flex items-center gap-1.5 rounded-xl border border-blue-500 bg-white px-3 py-3">
                      <input
                        autoFocus
                        value={newBenefit}
                        onChange={(e) => setNewBenefit(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" && addBenefitHandler()
                        }
                        onBlur={addBenefitHandler}
                        placeholder="Benefit name"
                        className="w-full bg-transparent text-xs outline-none"
                      />
                    </div>
                  ) : (
                    <button
                      onClick={() => setAddingBenefit(true)}
                      className="flex items-center justify-center gap-1 rounded-xl border border-dashed border-slate-300 px-3.5 py-3 text-xs font-medium text-slate-500 transition-colors hover:border-blue-500 hover:text-blue-500"
                    >
                      <Plus size={13} strokeWidth={2.5} />
                      Add Benefit
                    </button>
                  )}
                </div>
              )}
              {touched.benefits && <FieldError>{errors.benefits}</FieldError>}
            </section>

            {/* Offer Expiry */}
            <section className="mb-6">
              <h2 className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Offer Expiry
              </h2>
              <div className="flex flex-wrap items-end gap-3">
                <div className="max-w-56">
                  <FieldLabel required>Offer expires</FieldLabel>
                  <div className="relative">
                    <CalendarDays
                      size={15}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="date"
                      value={formState.expiryDate}
                      min={todayISO()}
                      onChange={(e) =>
                        handleFieldChange("expiryDate", e.target.value)
                      }
                      onBlur={() => mark("expiryDate")}
                      className={`w-full rounded-xl border bg-white px-3 py-3 pl-9 text-xs text-slate-900 outline-none transition-all duration-150 placeholder:text-slate-400 ${DATE_ICON_CLASSES} ${
                        touched.expiryDate && errors.expiryDate
                          ? "border-red-600 focus:ring-2 focus:ring-red-600/15"
                          : "border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15"
                      }`}
                    />
                  </div>
                  {touched.expiryDate && (
                    <FieldError>{errors.expiryDate}</FieldError>
                  )}
                  <FieldOk show={touched.expiryDate && !errors.expiryDate} />
                </div>
                {formState.expiryDate &&
                  expiryDays !== null &&
                  !errors.expiryDate && (
                    <span
                      className={`mb-1 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                        expiryDays < 0
                          ? "bg-red-50 text-red-600"
                          : expiryDays <= 3
                            ? "bg-amber-50 text-amber-600"
                            : "bg-blue-50 text-blue-600"
                      }`}
                    >
                      <Sparkles size={12} />
                      {expiryDays < 0
                        ? "Already expired"
                        : expiryDays === 0
                          ? "Expires today"
                          : `${expiryDays} Day${expiryDays === 1 ? "" : "s"} Left`}
                    </span>
                  )}
              </div>
              <p className="mt-1.5 text-xs text-slate-400">
                Candidate must respond before this date.
              </p>
            </section>

            {/* Notes */}
            <section className="mb-2">
              <h2 className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Recruiter Notes
              </h2>
              <textarea
                value={formState.notes}
                maxLength={5000}
                onChange={(e) => handleFieldChange("notes", e.target.value)}
                rows={4}
                className="w-full resize-none rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-xs leading-relaxed text-slate-900 outline-none transition-all duration-150 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15"
                placeholder="Write a welcome note..."
              />
              <div className="mt-1 flex items-center justify-between text-xs text-slate-400">
                <span>Markdown not supported</span>
                <span>{formState.notes.length} / 5000</span>
              </div>
            </section>
          </div>

          {/* Right — mini offer letter preview */}
          <div className="hidden w-80 shrink-0 border-l border-slate-200 bg-slate-50 p-6 lg:block">
            <div className="sticky top-0">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_28px_rgba(37,99,235,0.08)] transition-all duration-150 ease-linear">
                <div className="border-b border-slate-100 px-5 py-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-900 text-[10px] font-bold text-white">
                      {job.company.charAt(0)}
                    </div>
                    <span className="text-xs font-semibold text-slate-900">
                      {job.company}
                    </span>
                  </div>
                </div>

                <div className="px-5 py-4">
                  <p className="mb-3 text-[10.5px] font-semibold uppercase tracking-widest text-slate-400">
                    Employment Offer
                  </p>
                  <InfoRow
                    label="Candidate"
                    value={candidate.name.split(" ")[0]}
                  />
                  <InfoRow label="Position" value={job.title} />
                  <InfoRow
                    label="CTC"
                    value={
                      formState.ctc
                        ? formState.currency === "INR"
                          ? `₹${formatINR(Number(formState.ctc) / 100000)} LPA`
                          : `${formState.currency} ${formatINR(formState.ctc)}`
                        : "—"
                    }
                  />
                  <InfoRow
                    label="Joining"
                    value={formatDateLong(formState.joiningDate)}
                  />
                  <div className="flex items-center justify-between py-2.5">
                    <span className="text-xs text-slate-500">Status</span>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                        isValid
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-blue-50 text-blue-600"
                      }`}
                    >
                      {isValid ? "Ready" : "Draft"}
                    </span>
                  </div>
                </div>

                <div
                  className={`flex items-center justify-center gap-1.5 py-3 text-[11.5px] font-bold uppercase tracking-wide ${
                    isValid
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-slate-50 text-slate-400"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${isValid ? "bg-emerald-600" : "bg-slate-300"}`}
                  />
                  {isValid ? "Ready to Send" : "Incomplete"}
                </div>
              </div>

              <p className="mt-4 text-center text-xs leading-relaxed text-slate-400">
                Updates instantly as you edit the offer.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-4 border-t border-slate-200 bg-white px-7 py-4">
          <p className="flex items-center gap-1.5 text-xs text-slate-500">
            <AlertTriangle size={13} className="shrink-0 text-amber-600" />
            Once sent, this offer cannot be modified.
          </p>
          <div className="flex shrink-0 items-center gap-2.5">
            <button
              onClick={onClose}
              className="rounded-xl border border-slate-300 px-4 py-2.5 text-xs font-medium text-slate-600 transition-all duration-150 hover:-translate-y-0.5 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitClick}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-md"
            >
              Select Candidate &amp; Send Offer
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation dialog */}
      {confirmOpen && (
        <div className="fixed inset-0 z-10 flex animate-overlayIn items-center justify-center bg-slate-900/55 p-4 backdrop-blur-sm motion-reduce:animate-none">
          <div className="w-full max-w-sm animate-modalIn rounded-2xl bg-white p-6 shadow-[0_20px_70px_rgba(15,23,42,0.2)] motion-reduce:animate-none">
            <h3 className="text-base font-semibold text-slate-900">
              Complete Hiring
            </h3>
            <p className="mt-1 text-xs text-slate-600">
              {candidate.name} &middot; {job.title}
            </p>

            <div className="mt-4 border-t border-slate-100 pt-4">
              <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
                The following will happen
              </p>
              <ul className="space-y-2">
                {[
                  "Candidate status changes to Selected",
                  "Selection email sent",
                  "Offer becomes active",
                  "Candidate can Accept or Reject",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-xs text-slate-700"
                  >
                    <span className="flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-emerald-50">
                      <Check
                        size={11}
                        className="text-emerald-600"
                        strokeWidth={3}
                      />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <p className="mt-4 flex items-start gap-1.5 rounded-xl bg-amber-50 px-3 py-2.5 text-xs text-amber-900">
              <AlertTriangle
                size={14}
                className="mt-0.5 shrink-0 text-amber-600"
              />
              After sending, the offer cannot be modified.
            </p>

            {(submitError || apiError) && (
              <p className="mt-3 flex items-start gap-1.5 rounded-xl bg-red-50 px-3 py-2.5 text-xs text-red-700">
                <AlertTriangle
                  size={14}
                  className="mt-0.5 shrink-0 text-red-600"
                />
                {submitError || apiError}
              </p>
            )}

            <div className="mt-5 flex justify-end gap-2.5">
              <button
                disabled={sending}
                onClick={() => setConfirmOpen(false)}
                className="rounded-xl border border-slate-300 px-4 py-2.5 text-xs font-medium text-slate-600 transition-all duration-150 hover:-translate-y-0.5 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                disabled={sending}
                onClick={handleConfirmSend}
                className="flex min-w-44 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white transition-all duration-150 hover:-translate-y-0.5 hover:bg-emerald-700 disabled:opacity-80"
              >
                {sending ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Select Candidate & Send Offer"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}