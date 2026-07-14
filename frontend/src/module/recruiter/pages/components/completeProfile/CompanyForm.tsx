import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  Building2,
  Globe,
  Users,
  User,
  Briefcase,
  MapPin,
  FileText,
  Check,
  AlertTriangle,
  Search,
  Sparkles,
  LocateFixed,
  type LucideIcon,
} from "lucide-react";

export interface CompanyFormData {
  companyName: string;
  companyWebsite: string;
  companySize: "" | "1-10" | "11-50" | "51-200" | "201-500" | "501+";
  industry:
    | ""
    | "Technology"
    | "Finance"
    | "Healthcare"
    | "Retail"
    | "Manufacturing"
    | "Education"
    | "Marketing"
    | "Consulting"
    | "Other";
  designation: string;
  location: string;
  bio: string;
}

export interface CompanyFormErrors {
  companyName?: string;
  companyWebsite?: string;
  industry?: string;
  designation?: string;
  location?: string;
  bio?: string;
}

type FormChangeEvent = React.ChangeEvent<
  HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
>;

interface CompanyFormProps {
  formData: CompanyFormData;
  errors: CompanyFormErrors;
  onChange: (e: FormChangeEvent) => void;
}

export interface CompanyFormHandle {
  focusFirstError: () => void;
}

const REQUIRED_FIELD_ORDER: (keyof CompanyFormData)[] = [
  "companyName",
  "companyWebsite",
  "companySize",
  "industry",
  "designation",
  "location",
  "bio",
];

const URL_RE = /^https?:\/\/[^\s]+\.[^\s]+$/i;

function nameChecks(v: string) {
  return [
    { label: "Minimum 3 characters", pass: v.trim().length >= 3 },
    { label: "No special symbols", pass: /^[a-zA-Z0-9 .&'-]*$/.test(v) },
  ];
}

function bioChecks(v: string) {
  return [
    { label: "At least 20 characters", pass: v.trim().length >= 20 },
    { label: "Under 500 characters", pass: v.length <= 500 },
  ];
}
function urlChecks(v: string) {
  if (!v) return [];
  return [{ label: "Valid website URL", pass: URL_RE.test(v) }];
}

function completionRatio(data: CompanyFormData) {
  const filled = REQUIRED_FIELD_ORDER.filter((k) => {
    const v = data[k];
    if (k === "bio") return v.trim().length >= 20;
    if (k === "companyName") return v.trim().length >= 3;
    return v.trim().length > 0;
  }).length;
  return filled / REQUIRED_FIELD_ORDER.length;
}

export const CompanyForm = forwardRef<CompanyFormHandle, CompanyFormProps>(
  function CompanyForm({ formData, errors, onChange }, ref) {
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [shakeField, setShakeField] = useState<string | null>(null);
    const fieldRefs = useRef<Record<string, HTMLElement | null>>({});

    const markTouched = (name: string) =>
      setTouched((t) => (t[name] ? t : { ...t, [name]: true }));

    const wrappedOnChange = (e: FormChangeEvent) => {
      markTouched(e.target.name);
      onChange(e);
    };

    const completion = Math.round(completionRatio(formData) * 100);

    useImperativeHandle(ref, () => ({
      focusFirstError: () => {
        const firstBad = REQUIRED_FIELD_ORDER.find(
          (k) => errors[k as keyof CompanyFormErrors],
        );
        if (!firstBad) return;
        const node = fieldRefs.current[firstBad];
        if (node) {
          node.scrollIntoView({ behavior: "smooth", block: "center" });
          setShakeField(firstBad);
          window.setTimeout(() => {
            const focusable = node.querySelector<HTMLElement>(
              "input, select, textarea, button",
            );
            (focusable ?? node).focus?.();
          }, 250);
          window.setTimeout(() => setShakeField(null), 650);
        }
      },
    }));

    const errorList = REQUIRED_FIELD_ORDER.filter(
      (k) => errors[k as keyof CompanyFormErrors],
    );

    return (
      <div
        className="rounded-3xl p-8 border border-slate-200/70 shadow-xl shadow-slate-200/50
                   bg-linear-to-br from-white to-blue-50/40
                   transition-shadow duration-300 hover:shadow-2xl hover:shadow-blue-200/40"
      >
        <div className="flex items-start justify-between gap-6 pb-7 mb-7 border-b border-slate-200/70">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-600/10 flex items-center justify-center shrink-0 mt-0.5">
              <Building2 className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900 tracking-tight">
                Company information
              </h2>
              <p className="text-sm text-slate-500 mt-1 max-w-md">
                This appears on your public company profile and job postings, so
                candidates can see who they'd be working with.
              </p>
            </div>
          </div>
          <CompletionDial percent={completion} />
        </div>

        {errorList.length > 0 && (
          <div className="mb-7 rounded-2xl bg-rose-50 border border-rose-200 px-4 py-3">
            <p className="text-sm font-semibold text-rose-700 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Please fix {errorList.length} field
              {errorList.length > 1 ? "s" : ""}
            </p>
            <ul className="mt-1.5 ml-6 text-sm text-rose-600 list-disc space-y-0.5">
              {errorList.map((k) => (
                <li key={k}>{FIELD_LABELS[k]}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-7 md:gap-8">
          <FloatingField
            fieldKey="companyName"
            label="Company name"
            required
            icon={Building2}
            value={formData.companyName}
            onChange={wrappedOnChange}
            onBlur={() => markTouched("companyName")}
            error={errors.companyName}
            touched={touched.companyName}
            placeholder="Example: Acme Technologies Pvt. Ltd."
            helper="This name appears on all your job postings."
            checks={nameChecks(formData.companyName)}
            shake={shakeField === "companyName"}
            fieldRef={(el) => {
              fieldRefs.current.companyName = el;
            }}
          />

          <FloatingField
            fieldKey="companyWebsite"
            label="Company website"
            icon={Globe}
            type="url"
            optional
            value={formData.companyWebsite}
            onChange={wrappedOnChange}
            onBlur={() => markTouched("companyWebsite")}
            error={errors.companyWebsite}
            touched={touched.companyWebsite}
            placeholder="https://company.com"
            helper="Used to verify your organization."
            checks={urlChecks(formData.companyWebsite)}
            preview={
              formData.companyWebsite && URL_RE.test(formData.companyWebsite)
                ? formData.companyWebsite
                    .replace(/^https?:\/\//, "")
                    .replace(/\/$/, "")
                : undefined
            }
            shake={shakeField === "companyWebsite"}
            fieldRef={(el) => {
              fieldRefs.current.companyWebsite = el;
            }}
          />

          <div
            className="md:col-span-2"
            ref={(el) => {
              fieldRefs.current.companySize = el;
            }}
          >
            <CompanySizePicker
              value={formData.companySize}
              onChange={(val) =>
                wrappedOnChange({
                  target: { name: "companySize", value: val },
                } as unknown as FormChangeEvent)
              }
            />
          </div>

          <div
            ref={(el) => {
              fieldRefs.current.industry = el;
            }}
          >
            <IndustryCombobox
              value={formData.industry}
              error={errors.industry}
              shake={shakeField === "industry"}
              onChange={(val) => {
                markTouched("industry");
                wrappedOnChange({
                  target: { name: "industry", value: val },
                } as unknown as FormChangeEvent);
              }}
            />
          </div>

          <FloatingField
            fieldKey="designation"
            label="Your designation"
            required
            icon={Briefcase}
            value={formData.designation}
            onChange={wrappedOnChange}
            onBlur={() => markTouched("designation")}
            error={errors.designation}
            touched={touched.designation}
            placeholder="e.g. HR Manager, Talent Acquisition Lead, Founder"
            helper="Shown to candidates in communication."
            shake={shakeField === "designation"}
            fieldRef={(el) => {
              fieldRefs.current.designation = el;
            }}
          />

          <LocationField
            value={formData.location}
            error={errors.location}
            touched={touched.location}
            shake={shakeField === "location"}
            onChange={wrappedOnChange}
            onBlur={() => markTouched("location")}
            fieldRef={(el) => {
              fieldRefs.current.location = el;
            }}
          />
        </div>

        <div
          ref={(el) => {
            fieldRefs.current.bio = el;
          }}
          className="mt-8"
        >
          <BioField
            value={formData.bio}
            error={errors.bio}
            touched={touched.bio}
            shake={shakeField === "bio"}
            onChange={wrappedOnChange}
            onBlur={() => markTouched("bio")}
          />
        </div>
      </div>
    );
  },
);

const FIELD_LABELS: Record<string, string> = {
  companyName: "Company name",
  companyWebsite: "Company website",
  companySize: "Company size",
  industry: "Industry",
  designation: "Your designation",
  location: "Location",
  bio: "About your company",
};

function CompletionDial({ percent }: { percent: number }) {
  const r = 22;
  const c = 2 * Math.PI * r;
  const offset = c - (percent / 100) * c;
  const color =
    percent >= 100 ? "#059669" : percent >= 50 ? "#2563eb" : "#f59e0b";

  return (
    <div className="flex flex-col items-center shrink-0">
      <div className="relative h-16 w-16">
        <svg viewBox="0 0 56 56" className="h-16 w-16 -rotate-90">
          <circle
            cx="28"
            cy="28"
            r={r}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="5"
          />
          <circle
            cx="28"
            cy="28"
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={offset}
            style={{
              transition: "stroke-dashoffset 400ms ease, stroke 400ms ease",
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-semibold text-slate-900">
            {percent}%
          </span>
        </div>
      </div>
      <span className="mt-1 text-[11px] font-medium text-slate-500 whitespace-nowrap">
        Profile complete
      </span>
    </div>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="mt-2 flex items-center gap-1.5 rounded-lg bg-rose-50 border border-rose-200 px-3 py-1.5">
      <AlertTriangle className="h-3.5 w-3.5 text-rose-600 shrink-0" />
      <p className="text-xs font-medium text-rose-700">{message}</p>
    </div>
  );
}

function CheckList({ checks }: { checks: { label: string; pass: boolean }[] }) {
  if (!checks.length) return null;
  return (
    <ul className="mt-2 space-y-1">
      {checks.map((c) => (
        <li
          key={c.label}
          className={`flex items-center gap-1.5 text-xs transition-colors ${
            c.pass ? "text-emerald-600" : "text-slate-400"
          }`}
        >
          {c.pass ? (
            <Check className="h-3 w-3 shrink-0" />
          ) : (
            <span className="h-3 w-3 rounded-full border border-slate-300 shrink-0" />
          )}
          {c.label}
        </li>
      ))}
    </ul>
  );
}

interface FloatingFieldProps {
  fieldKey: string;
  label: string;
  icon: LucideIcon;
  value: string;
  onChange: (e: FormChangeEvent) => void;
  onBlur: () => void;
  error?: string;
  touched?: boolean;
  placeholder?: string;
  helper?: string;
  type?: React.HTMLInputTypeAttribute;
  required?: boolean;
  optional?: boolean;
  checks?: { label: string; pass: boolean }[];
  preview?: string;
  shake?: boolean;
  fieldRef?: (el: HTMLDivElement | null) => void;
}

function FloatingField({
  fieldKey,
  label,
  icon: Icon,
  value,
  onChange,
  onBlur,
  error,
  touched,
  placeholder,
  helper,
  type = "text",
  required,
  optional,
  checks = [],
  preview,
  shake,
  fieldRef,
}: FloatingFieldProps) {
  const [focused, setFocused] = useState(false);
  const showError = !!error && touched;
  const isValid =
    touched && !showError && value.length > 0 && checks.every((c) => c.pass);
  const floated = focused || value.length > 0;

  const borderColor = showError
    ? "border-rose-300 focus-within:ring-rose-500"
    : isValid
      ? "border-emerald-400 focus-within:ring-emerald-500"
      : "border-slate-300 focus-within:ring-blue-500";

  return (
    <div
      ref={fieldRef }
      className={shake ? "animate-[shake_0.5s_ease-in-out]" : undefined}
    >
      <div
        className={`relative border rounded-xl px-4 pt-5 pb-2 focus-within:ring-2 transition-all bg-white ${borderColor}`}
      >
        <label
          htmlFor={fieldKey}
          className={`absolute left-4 flex items-center gap-1.5 text-slate-500 pointer-events-none transition-all duration-150 ${
            floated ? "top-1.5 text-[11px]" : "top-3.5 text-sm"
          }`}
        >
          <Icon
            className={`shrink-0 ${floated ? "h-3 w-3" : "h-3.5 w-3.5"} text-blue-500`}
          />
          {label}
          {required && <span className="text-rose-500">*</span>}
          {optional && <span className="text-slate-400">(optional)</span>}
        </label>
        <input
          id={fieldKey}
          name={fieldKey}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            onBlur();
          }}
          placeholder={floated ? placeholder : ""}
          className="w-full bg-transparent outline-none text-sm text-slate-900 pt-1"
        />
        {isValid && (
          <Check className="h-4 w-4 text-emerald-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
        )}
      </div>

      {showError ? (
        <ErrorBanner message={error!} />
      ) : (
        <>
          {helper && <p className="mt-1.5 text-xs text-slate-400">{helper}</p>}
          {preview && (
            <p className="mt-1.5 text-xs text-emerald-600 flex items-center gap-1">
              <Globe className="h-3 w-3" /> {preview}
            </p>
          )}
          <CheckList checks={touched || value ? checks : []} />
        </>
      )}
    </div>
  );
}

const SIZE_OPTIONS: {
  value: CompanyFormData["companySize"];
  label: string;
  tag: string;
  dots: number;
}[] = [
  { value: "1-10", label: "1–10", tag: "Startup", dots: 1 },
  { value: "11-50", label: "11–50", tag: "Growing team", dots: 2 },
  { value: "51-200", label: "51–200", tag: "Mid-size", dots: 3 },
  { value: "201-500", label: "201–500", tag: "Established", dots: 4 },
  { value: "501+", label: "501+", tag: "Enterprise", dots: 5 },
];

function CompanySizePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="text-sm font-semibold text-slate-900 flex items-center gap-2 mb-3">
        <Users className="h-4 w-4 text-blue-500" />
        Company size
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {SIZE_OPTIONS.map((opt) => {
          const selected = value === opt.value;
          return (
            <button
              type="button"
              key={opt.value}
              onClick={() => onChange(opt.value)}
              className={`text-left rounded-2xl border px-3.5 py-3 transition-all ${
                selected
                  ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500/30"
                  : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/40"
              }`}
            >
              <div className="flex gap-0.5 mb-1.5">
                {Array.from({ length: opt.dots }).map((_, i) => (
                  <User
                    key={i}
                    className={`h-3.5 w-3.5 ${
                      selected ? "text-blue-600" : "text-slate-400"
                    }`}
                  />
                ))}
              </div>
              <p
                className={`text-sm font-semibold ${
                  selected ? "text-blue-700" : "text-slate-900"
                }`}
              >
                {opt.label}
              </p>
              <p className="text-[11px] text-slate-500">{opt.tag}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

const INDUSTRIES = [
  "Technology",
  "Finance",
  "Healthcare",
  "Retail",
  "Manufacturing",
  "Education",
  "Marketing",
  "Consulting",
  "Other",
];

function IndustryCombobox({
  value,
  onChange,
  error,
  shake,
}: {
  value: string;
  onChange: (v: string) => void;
  error?: string;
  shake?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const filtered = INDUSTRIES.filter((i) =>
    i.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div
      ref={containerRef}
      className={`relative ${shake ? "animate-[shake_0.5s_ease-in-out]" : ""}`}
    >
      <label className="text-sm font-semibold text-slate-900 flex items-center gap-2 mb-3">
        <Briefcase className="h-4 w-4 text-blue-500" />
        Industry <span className="text-rose-500">*</span>
      </label>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center justify-between px-4 py-3 border rounded-xl text-sm text-left transition-all ${
          error ? "border-rose-300" : "border-slate-300 hover:border-blue-300"
        } ${open ? "ring-2 ring-blue-500" : ""}`}
      >
        <span className={value ? "text-slate-900" : "text-slate-400"}>
          {value || "Select industry"}
        </span>
        <Search className="h-4 w-4 text-slate-400" />
      </button>

      {open && (
        <div className="absolute z-10 mt-1.5 w-full bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
          <div className="p-2 border-b border-slate-100">
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search industry..."
              className="w-full text-sm px-2.5 py-1.5 rounded-lg bg-slate-50 outline-none"
            />
          </div>
          <ul className="max-h-48 overflow-y-auto py-1">
            {filtered.length === 0 && (
              <li className="px-4 py-2 text-sm text-slate-400">No matches</li>
            )}
            {filtered.map((i) => (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(i);
                    setQuery("");
                    setOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-blue-50 flex items-center justify-between ${
                    value === i ? "text-blue-600 font-medium" : "text-slate-700"
                  }`}
                >
                  {i}
                  {value === i && <Check className="h-3.5 w-3.5" />}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {error && <ErrorBanner message={error} />}
    </div>
  );
}

function LocationField({
  value,
  error,
  touched,
  shake,
  onChange,
  onBlur,
  fieldRef,
}: {
  value: string;
  error?: string;
  touched?: boolean;
  shake?: boolean;
  onChange: (e: FormChangeEvent) => void;
  onBlur: () => void;
 fieldRef?: (el: HTMLDivElement | null) => void;
}) {
  const [locating, setLocating] = useState(false);
  const [focused, setFocused] = useState(false);
  const floated = focused || value.length > 0;
  const showError = !!error && touched;

  const useCurrentLocation = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`,
          );
          const data = await res.json();
          const city =
            data?.address?.city ||
            data?.address?.town ||
            data?.address?.state ||
            "";
          const country = data?.address?.country || "";
          const label = [city, country].filter(Boolean).join(", ");
          onChange({
            target: { name: "location", value: label || "Current location" },
          } as unknown as FormChangeEvent);
        } finally {
          setLocating(false);
        }
      },
      () => setLocating(false),
    );
  };

  return (
    <div
      ref={fieldRef}
      className={shake ? "animate-[shake_0.5s_ease-in-out]" : undefined}
    >
      <div
        className={`relative border rounded-xl px-4 pt-5 pb-2 focus-within:ring-2 transition-all bg-white ${
          showError
            ? "border-rose-300 focus-within:ring-rose-500"
            : "border-slate-300 focus-within:ring-blue-500"
        }`}
      >
        <label
          htmlFor="location"
          className={`absolute left-4 flex items-center gap-1.5 text-slate-500 pointer-events-none transition-all duration-150 ${
            floated ? "top-1.5 text-[11px]" : "top-3.5 text-sm"
          }`}
        >
          <MapPin
            className={`shrink-0 ${floated ? "h-3 w-3" : "h-3.5 w-3.5"} text-blue-500`}
          />
          Location <span className="text-slate-400">(optional)</span>
        </label>
        <input
          id="location"
          name="location"
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            onBlur();
          }}
          placeholder={floated ? "Kochi, Kerala, India" : ""}
          className="w-full bg-transparent outline-none text-sm text-slate-900 pt-1 pr-9"
        />
        <button
          type="button"
          onClick={useCurrentLocation}
          title="Use current location"
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-blue-500 hover:text-blue-700 disabled:opacity-40"
          disabled={locating}
        >
          <LocateFixed
            className={`h-4 w-4 ${locating ? "animate-spin" : ""}`}
          />
        </button>
      </div>
      {showError ? (
        <ErrorBanner message={error!} />
      ) : (
        <p className="mt-1.5 text-xs text-slate-400">
          Head office or main hiring location.
        </p>
      )}
    </div>
  );
}

const BIO_TIPS = [
  "Your mission",
  "Company culture",
  "Technologies you use",
  "Hiring values",
  "Growth opportunities",
];

function BioField({
  value,
  error,
  touched,
  shake,
  onChange,
  onBlur,
}: {
  value: string;
  error?: string;
  touched?: boolean;
  shake?: boolean;
  onChange: (e: FormChangeEvent) => void;
  onBlur: () => void;
}) {
  const showError = !!error && touched;
  const checks = bioChecks(value);

  const quality = Math.round(
    (checks.filter((c) => c.pass).length / checks.length) * 100,
  );

  const counterColor =
    value.length > 450
      ? "text-rose-500"
      : value.length > 350
        ? "text-amber-500"
        : "text-slate-400";

  const qualityColor =
    quality >= 100
      ? "bg-emerald-500"
      : quality >= 50
        ? "bg-blue-500"
        : "bg-amber-500";

  return (
    <div
      className={`grid grid-cols-1 lg:grid-cols-3 gap-5 ${shake ? "animate-[shake_0.5s_ease-in-out]" : ""}`}
    >
      <div className="lg:col-span-2">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <FileText className="h-4 w-4 text-blue-500" />
            About your company <span className="text-rose-500">*</span>
          </label>
          <span className={`text-xs ${counterColor}`}>
            {value.length}/500 characters
          </span>
        </div>

        <textarea
          name="bio"
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          rows={6}
          placeholder={
            "We're a fast-growing SaaS company building AI-powered recruitment tools for modern hiring teams..."
          }
          className={`w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 resize-none text-sm transition-all ${
            showError
              ? "border-rose-300 focus:ring-rose-500"
              : "border-slate-300 focus:ring-blue-500"
          }`}
        />

        {showError && <ErrorBanner message={error!} />}

        <div className="mt-3">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-medium text-slate-600">Bio quality</span>
            <span className="text-slate-500">{quality}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${qualityColor}`}
              style={{ width: `${quality}%` }}
            />
          </div>
        </div>

        <CheckList checks={checks} />
      </div>

      <div className="rounded-2xl bg-blue-50/60 border border-blue-100 p-4 h-fit">
        <p className="text-sm font-semibold text-slate-900 flex items-center gap-1.5 mb-2.5">
          <Sparkles className="h-3.5 w-3.5 text-blue-500" />
          Writing tips
        </p>
        <ul className="space-y-1.5">
          {BIO_TIPS.map((tip) => (
            <li
              key={tip}
              className="flex items-center gap-1.5 text-xs text-slate-600"
            >
              <Check className="h-3 w-3 text-blue-400 shrink-0" />
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default CompanyForm;

if (
  typeof document !== "undefined" &&
  !document.getElementById("company-form-shake-kf")
) {
  const style = document.createElement("style");
  style.id = "company-form-shake-kf";
  style.textContent = `
    @keyframes shake {
      10%, 90% { transform: translateX(-1px); }
      20%, 80% { transform: translateX(2px); }
      30%, 50%, 70% { transform: translateX(-4px); }
      40%, 60% { transform: translateX(4px); }
    }
  `;
  document.head.appendChild(style);
}
