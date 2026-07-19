import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  CheckCircle2,
  X,
  Briefcase,
  GraduationCap,
  MapPin,
  Sparkles,
  FileText,
  Linkedin,
  Plus,
  Lock,
  Sprout,
  Rocket,
  Star,
  Crown,
  Wand2,
  Circle,
  ChevronDown,
  Scissors,
  Wand,
} from "lucide-react";
import { type ZodIssue } from "zod";

import { useCompleteCandidateProfile } from "../hooks/useCompleteCandidateProfile";
import type { CompleteCandidateProfileForm } from "../types/candidate.types";
import { candidateProfileSchema } from "../validators/complete-profile.validation";

interface CompleteCandidateProfileProps {
  candidateName?: string;
}

const SUGGESTED_SKILLS = [
  "React",
  "Node.js",
  "TypeScript",
  "MongoDB",
  "Express",
  "AWS",
  "Docker",
  "Git",
  "REST API",
  "PostgreSQL",
  "Python",
  "Next.js",
];

const ROLE_SKILL_MAP: { match: RegExp; label: string; skills: string[] }[] = [
  {
    match: /front[\s-]?end|react|ui\b|web developer/i,
    label: "Suggested for Frontend roles",
    skills: ["React", "TypeScript", "Redux", "Tailwind CSS", "Next.js", "Vite"],
  },
  {
    match: /back[\s-]?end|api|server/i,
    label: "Suggested for Backend roles",
    skills: ["Node.js", "Express", "PostgreSQL", "Redis", "Docker", "GraphQL"],
  },
  {
    match: /full[\s-]?stack/i,
    label: "Suggested for Full Stack roles",
    skills: ["React", "Node.js", "TypeScript", "MongoDB", "AWS", "Docker"],
  },
  {
    match: /design|ux|ui designer/i,
    label: "Suggested for Design roles",
    skills: [
      "Figma",
      "Design Systems",
      "Prototyping",
      "User Research",
      "Accessibility",
    ],
  },
  {
    match: /data|analy(st|tics)|ml|machine learning/i,
    label: "Suggested for Data roles",
    skills: [
      "Python",
      "SQL",
      "Pandas",
      "Power BI",
      "TensorFlow",
      "Data Visualization",
    ],
  },
  {
    match: /devops|sre|infra|platform/i,
    label: "Suggested for DevOps roles",
    skills: ["Docker", "Kubernetes", "AWS", "Terraform", "CI/CD", "Linux"],
  },
  {
    match: /product manager|product owner/i,
    label: "Suggested for Product roles",
    skills: [
      "Roadmapping",
      "Agile",
      "Stakeholder Management",
      "SQL",
      "A/B Testing",
    ],
  },
];

const EXPERIENCE_OPTIONS = [
  { value: "0", label: "Entry Level", range: "0–2 years", icon: Sprout },
  { value: "2", label: "Mid Level", range: "2–5 years", icon: Rocket },
  { value: "5", label: "Senior", range: "5–10 years", icon: Star },
  { value: "10", label: "Expert", range: "10+ years", icon: Crown },
];

const EDUCATION_OPTIONS = [
  { value: "highschool", label: "High School" },
  { value: "diploma", label: "Diploma" },
  { value: "bachelor", label: "Bachelor's Degree" },
  { value: "master", label: "Master's Degree" },
  { value: "phd", label: "PhD or equivalent" },
];

const EXPERIENCE_LABELS: Record<string, string> = {
  "0": "entry-level",
  "2": "mid-level",
  "5": "senior",
  "10": "expert-level",
};

const FIELD_ORDER = [
  "currentJob",
  "experienceYears",
  "educationLevel",
  "preferredJobLocations",
  "skills",
  "bio",
  "linkedinUrl",
] as const;

const FIELD_LABELS: Record<string, string> = {
  currentJob: "Current Job",
  experienceYears: "Experience",
  educationLevel: "Education",
  preferredJobLocations: "Locations",
  skills: "Skills",
  bio: "Bio",
  linkedinUrl: "LinkedIn",
};

type Accent = "indigo" | "emerald" | "amber";

const ACCENT_CLASSES: Record<
  Accent,
  {
    iconBg: string;
    iconText: string;
    iconRing: string;
    badgeDone: string;
    badgeTodo: string;
    text: string;
  }
> = {
  indigo: {
    iconBg: "bg-indigo-50",
    iconText: "text-indigo-600",
    iconRing: "ring-indigo-100",
    badgeDone: "bg-indigo-50 text-indigo-700",
    badgeTodo: "bg-slate-100 text-slate-500",
    text: "text-indigo-600",
  },
  emerald: {
    iconBg: "bg-emerald-50",
    iconText: "text-emerald-600",
    iconRing: "ring-emerald-100",
    badgeDone: "bg-emerald-50 text-emerald-700",
    badgeTodo: "bg-slate-100 text-slate-500",
    text: "text-emerald-600",
  },
  amber: {
    iconBg: "bg-amber-50",
    iconText: "text-amber-600",
    iconRing: "ring-amber-100",
    badgeDone: "bg-amber-50 text-amber-700",
    badgeTodo: "bg-slate-100 text-slate-500",
    text: "text-amber-600",
  },
};

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-600 animate-in fade-in slide-in-from-top-1 duration-150">
      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
      {message}
    </p>
  );
}

function inputCls(hasError: boolean, extra = "") {
  return [
    "w-full rounded-xl border bg-white px-4 pb-3 pt-6 text-[15px] text-slate-900 outline-none transition-all duration-200 placeholder:text-transparent",
    "focus:-translate-y-0.5 focus:shadow-[0_8px_24px_-8px_rgba(79,70,229,0.35)]",
    hasError
      ? "border-red-400 bg-red-50/50 focus:border-red-500 focus:ring-2 focus:ring-red-200"
      : "border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100",
    extra,
  ]
    .filter(Boolean)
    .join(" ");
}

function FloatingField({
  htmlFor,
  label,
  required,
  hasError,
  children,
  hasValue,
}: {
  htmlFor: string;
  label: string;
  required?: boolean;
  hasError?: boolean;
  hasValue: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="group relative">
      {children}
      <label
        htmlFor={htmlFor}
        className={`pointer-events-none absolute left-4 transition-all duration-200 ${
          hasValue
            ? "top-2 text-[11px] font-medium"
            : "top-1/2 -translate-y-1/2 text-[15px]"
        } ${hasError ? "text-red-500" : "text-slate-400 group-focus-within:top-2 group-focus-within:text-[11px] group-focus-within:font-medium group-focus-within:text-indigo-600"}`}
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    </div>
  );
}

function SectionIcon({
  icon: Icon,
  accent,
}: {
  icon: React.ElementType;
  accent: Accent;
}) {
  const c = ACCENT_CLASSES[accent];
  return (
    <span
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${c.iconBg} ${c.iconText} ring-1 ${c.iconRing}`}
    >
      <Icon className="h-4.5 w-4.5" />
    </span>
  );
}

function CompletionBadge({
  isDone,
  remaining,
  accent,
}: {
  isDone: boolean;
  remaining: number;
  accent: Accent;
}) {
  const c = ACCENT_CLASSES[accent];
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
        isDone ? c.badgeDone : c.badgeTodo
      }`}
    >
      {isDone ? (
        <>
          <CheckCircle2 className="h-3 w-3" />
          Completed
        </>
      ) : (
        `${remaining} remaining`
      )}
    </span>
  );
}

function Card({
  icon,
  title,
  subtitle,
  delayMs,
  accent,
  isDone,
  remaining,
  children,
}: {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  delayMs: number;
  accent: Accent;
  isDone: boolean;
  remaining: number;
  children: React.ReactNode;
}) {
  return (
    <section
      className="animate-card-in space-y-6 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-shadow duration-300 hover:shadow-[0_4px_20px_-4px_rgba(15,23,42,0.08)] sm:p-7"
      style={{ animationDelay: `${delayMs}ms` }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <SectionIcon icon={icon} accent={accent} />
          <div>
            <h2 className="text-[17px] font-semibold leading-tight text-slate-900">
              {title}
            </h2>
            <p className="mt-0.5 text-[13px] leading-snug text-slate-500">
              {subtitle}
            </p>
          </div>
        </div>
        <CompletionBadge
          isDone={isDone}
          remaining={remaining}
          accent={accent}
        />
      </div>
      {children}
    </section>
  );
}

/** Small collapsible panel used for the bio example and writing tips. */
function Collapsible({
  label,
  defaultOpen = false,
  children,
}: {
  label: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/60">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-slate-700"
      >
        {label}
        <ChevronDown
          className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}

/** Live requirement row: flips from ○ (pending) to ✓ / ✗ as the user types. */
function RequirementRow({ met, label }: { met: boolean; label: string }) {
  return (
    <li
      className={`flex items-center gap-2 text-[13px] font-medium transition-colors duration-200 ${
        met ? "text-emerald-600" : "text-slate-400"
      }`}
    >
      {met ? (
        <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
      ) : (
        <Circle className="h-3.5 w-3.5 shrink-0" />
      )}
      {label}
    </li>
  );
}

const WEIGHTS = {
  currentJob: 15,
  experienceYears: 15,
  educationLevel: 15,
  locations: 15,
  skills: 20,
  bio: 15,
  linkedinUrl: 5,
} as const;

function calcCompletion(
  formData: CompleteCandidateProfileForm,
  locationTags: string[],
) {
  let pct = 0;
  const done: Record<string, boolean> = {};
  done.job = !!formData.currentJob.trim();
  done.experience = !!formData.experienceYears;
  done.education = !!formData.educationLevel;
  done.locations = locationTags.length > 0;
  done.skills = formData.skills.length > 0;
  done.bio = formData.bio.trim().length >= 20;
  done.linkedin = !!formData.linkedinUrl?.trim();

  if (done.job) pct += WEIGHTS.currentJob;
  if (done.experience) pct += WEIGHTS.experienceYears;
  if (done.education) pct += WEIGHTS.educationLevel;
  if (done.locations) pct += WEIGHTS.locations;
  if (done.skills) pct += WEIGHTS.skills;
  if (done.bio) pct += WEIGHTS.bio;

  if (done.linkedin) pct += WEIGHTS.linkedinUrl;

  return { pct: Math.min(pct, 100), done };
}

function strengthLabel(pct: number): { label: string; stars: number } {
  if (pct >= 95) return { label: "Excellent", stars: 5 };
  if (pct >= 75) return { label: "Strong", stars: 4 };
  if (pct >= 50) return { label: "Good", stars: 3 };
  if (pct >= 25) return { label: "Getting there", stars: 2 };
  return { label: "Just started", stars: 1 };
}

function generateBioDraft(form: CompleteCandidateProfileForm): string {
  const job = form.currentJob.trim() || "professional";
  const level = EXPERIENCE_LABELS[String(form.experienceYears ?? "")] ?? "";
  const topSkills = form.skills.slice(0, 4).join(", ");
  const parts = [
    `${level ? `${level.charAt(0).toUpperCase()}${level.slice(1)} ` : ""}${job} focused on delivering measurable results.`,
    topSkills ? `Comfortable working across ${topSkills}.` : "",
    "Looking for a role where I can grow my skills while contributing to a product users genuinely rely on.",
  ].filter(Boolean);
  return parts.join(" ");
}

function improveBioDraft(bio: string): string {
  const trimmed = bio.trim();
  if (!trimmed) return trimmed;
  const withPeriod = /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
  return `${withPeriod} Focused on writing clean, maintainable work and communicating clearly with the team.`;
}

function shortenBioDraft(bio: string): string {
  const trimmed = bio.trim();
  if (!trimmed) return trimmed;

  const sentences = trimmed.match(/[^.!?]+[.!?]+/g) ?? [trimmed];
  const shortened = sentences.slice(0, 2).join(" ").trim();
  return shortened || trimmed;
}

function makeProfessionalDraft(bio: string): string {
  const trimmed = bio.trim();
  if (!trimmed) return trimmed;
  const withPeriod = /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
  const casualToProfessional: [RegExp, string][] = [
    [/\bi'm\b/gi, "I am"],
    [/\bi've\b/gi, "I have"],
    [/\bkinda\b/gi, "somewhat"],
    [/\bstuff\b/gi, "work"],
    [/\bgreat at\b/gi, "experienced in"],
    [/\blove\b/gi, "am passionate about"],
  ];
  const polished = casualToProfessional.reduce(
    (acc, [pattern, replacement]) => acc.replace(pattern, replacement),
    withPeriod,
  );
  return polished;
}

function ConfettiBurst() {
  const pieces = Array.from({ length: 18 });
  const colors = ["#4f46e5", "#10b981", "#f59e0b", "#6366f1", "#34d399"];
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {pieces.map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 0.3;
        const duration = 1.4 + Math.random() * 0.8;
        const color = colors[i % colors.length];
        const rotate = Math.random() * 360;
        return (
          <span
            key={i}
            className="absolute -top-2.5 h-2.5 w-2.5 rounded-sm animate-confetti-fall"
            style={{
              left: `${left}%`,
              backgroundColor: color,
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
              transform: `rotate(${rotate}deg)`,
            }}
          />
        );
      })}
    </div>
  );
}

/* ---------- main component ---------- */

export default function CompleteCandidateProfile({
  candidateName,
}: CompleteCandidateProfileProps) {
  const navigate = useNavigate();
  const { completeProfile, isSubmitting, error } =
    useCompleteCandidateProfile();

  const [formData, setFormData] = useState<CompleteCandidateProfileForm>({
    currentJob: "",
    experienceYears: "",
    educationLevel: "",
    skills: [],
    preferredJobLocations: "",
    bio: "",
    linkedinUrl: "",
  });

  const [locationTags, setLocationTags] = useState<string[]>([]);
  const [locationInput, setLocationInput] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [shakeField, setShakeField] = useState<string | null>(null);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "success">(
    "idle",
  );
  const [poppedSkill, setPoppedSkill] = useState<string | null>(null);
  const [prevPct, setPrevPct] = useState(0);
  const [pctDelta, setPctDelta] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [bioBusy, setBioBusy] = useState<
    "generate" | "improve" | "shorten" | "professional" | null
  >(null);
  const [showStickySave, setShowStickySave] = useState(false);

  const fieldRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const formRef = useRef<HTMLFormElement | null>(null);

  const { pct: completion, done: completionMap } = calcCompletion(
    formData,
    locationTags,
  );
  const { label: strengthText, stars } = strengthLabel(completion);

  // Track completion deltas so the sidebar can show "+15%" style feedback.
  useEffect(() => {
    if (completion !== prevPct) {
      const delta = completion - prevPct;
      setPrevPct(completion);
      if (delta > 0) {
        setPctDelta(delta);
        const t = setTimeout(() => setPctDelta(null), 1800);
        return () => clearTimeout(t);
      }
    }
  }, [completion]);

  useEffect(() => {
    const onScroll = () => setShowStickySave(window.scrollY > 420);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const clearError = (name: string) =>
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });

  const handleTextChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (submitted) clearError(name);
  };

  /* skills */
  const addSkill = (value?: string) => {
    const trimmed = (value ?? skillInput).trim();
    if (!trimmed) return;
    if (!formData.skills.includes(trimmed)) {
      setFormData((prev) => ({ ...prev, skills: [...prev.skills, trimmed] }));
      if (submitted) clearError("skills");
      setPoppedSkill(trimmed);
      setTimeout(() => setPoppedSkill(null), 350);
    }
    setSkillInput("");
  };
  const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };
  const removeSkill = (skill: string) =>
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  /* locations */
  const syncLocations = (tags: string[]) => {
    setLocationTags(tags);
    setFormData((prev) => ({
      ...prev,
      preferredJobLocations: tags.join(", "),
    }));
    if (submitted) clearError("preferredJobLocations");
  };
  const addLocation = () => {
    const trimmed = locationInput.trim();
    if (!trimmed || locationTags.includes(trimmed)) {
      setLocationInput("");
      return;
    }
    syncLocations([...locationTags, trimmed]);
    setLocationInput("");
  };
  const handleLocationKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addLocation();
    }
  };
  const removeLocation = (loc: string) =>
    syncLocations(locationTags.filter((l) => l !== loc));

  const runBioAssistant = (
    mode: "generate" | "improve" | "shorten" | "professional",
  ) => {
    setBioBusy(mode);

    setTimeout(() => {
      let next = formData.bio;
      if (mode === "generate") next = generateBioDraft(formData);
      if (mode === "improve") next = improveBioDraft(formData.bio);
      if (mode === "shorten") next = shortenBioDraft(formData.bio);
      if (mode === "professional") next = makeProfessionalDraft(formData.bio);
      setFormData((prev) => ({ ...prev, bio: next }));
      if (submitted) clearError("bio");
      setBioBusy(null);
    }, 500);
  };

  const bioWordCount = formData.bio.trim()
    ? formData.bio.trim().split(/\s+/).length
    : 0;
  const bioCharCount = formData.bio.length;
  const hasEnoughWords = bioWordCount >= 5;
  const hasEnoughChars = bioCharCount >= 20;
  const underMaxChars = bioCharCount <= 1000;
  const bioQualityPercent = Math.min(
    100,
    Math.round(
      (Math.min(bioWordCount, 5) / 5) * 50 +
        (Math.min(bioCharCount, 100) / 100) * 50,
    ),
  );

  const validate = (): boolean => {
    const result = candidateProfileSchema.safeParse({
      ...formData,
      preferredJobLocations: locationTags,
      linkedinUrl: formData.linkedinUrl?.trim() || undefined,
    });

    if (result.success) {
      setFieldErrors({});
      return true;
    }

    const errors: Record<string, string> = {};
    result.error.issues.forEach((issue: ZodIssue) => {
      const key = issue.path[0] as string;
      if (!errors[key]) errors[key] = issue.message;
    });
    setFieldErrors(errors);

    const firstKey = FIELD_ORDER.find((k) => errors[k]);
    if (firstKey) {
      const node = fieldRefs.current[firstKey];
      node?.scrollIntoView({ behavior: "smooth", block: "center" });
      node?.querySelector<HTMLElement>("input, textarea, select")?.focus();
      setShakeField(firstKey);
      setTimeout(() => setShakeField(null), 500);
    }
    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (!validate()) return;

    try {
      setSaveState("saving");
      await completeProfile({
        currentJob: formData.currentJob.trim(),
        experienceYears: formData.experienceYears
          ? String(formData.experienceYears)
          : undefined,
        educationLevel: formData.educationLevel,
        skills: formData.skills,
        preferredJobLocations: formData.preferredJobLocations,
        bio: formData.bio.trim(),
        linkedinUrl: formData.linkedinUrl?.trim() || undefined,
      });
      setSaveState("success");
      setShowConfetti(true);
      setTimeout(() => navigate("/candidate/home"), 1400);
    } catch (err) {
      console.error(err);
      setSaveState("idle");
    }
  };

  const errorKeys = FIELD_ORDER.filter((k) => fieldErrors[k]);
  const errorCount = errorKeys.length;

  const roleMatch = ROLE_SKILL_MAP.find((r) =>
    r.match.test(formData.currentJob),
  );
  const suggestionPool = roleMatch ? roleMatch.skills : SUGGESTED_SKILLS;
  const suggestionLabel = roleMatch
    ? roleMatch.label
    : "Recommended for your role";
  const remainingSuggestions = suggestionPool
    .filter((s) => !formData.skills.includes(s))
    .slice(0, 8);

  const checklist = [
    { key: "job", label: "Career" },
    { key: "experience", label: "Experience" },
    { key: "education", label: "Education" },
    { key: "locations", label: "Locations" },
    { key: "skills", label: "Skills" },
    { key: "bio", label: "Summary" },
    { key: "linkedin", label: "LinkedIn" },
  ];
  const remainingCount = checklist.filter((c) => !completionMap[c.key]).length;

 
  const careerKeys = ["job", "experience", "education"];
  const careerRemaining = careerKeys.filter((k) => !completionMap[k]).length;
  const skillsPrefKeys = ["skills", "locations"];
  const skillsPrefRemaining = skillsPrefKeys.filter(
    (k) => !completionMap[k],
  ).length;

  const presenceRemaining = completionMap.bio ? 0 : 1;

  return (
    <div className="relative min-h-screen overflow-hidden bg-white px-4 py-10 sm:px-6 lg:px-8">

      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-linear(700px circle at 12% -5%, rgba(79,70,229,0.08), transparent 55%), radial-linear(700px circle at 90% 10%, rgba(16,185,129,0.06), transparent 55%)",
        }}
      />

      <style>{`
        @keyframes fieldShake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(5px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(3px); }
        }
        .field-shake { animation: fieldShake 0.4s ease-in-out; }

        @keyframes cardIn {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-card-in { animation: cardIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) both; }

        @keyframes chipPop {
          0% { transform: scale(0.6); opacity: 0; }
          60% { transform: scale(1.08); opacity: 1; }
          100% { transform: scale(1); }
        }
        .animate-chip-pop { animation: chipPop 0.32s cubic-bezier(0.16, 1, 0.3, 1) both; }

        @keyframes deltaFloat {
          0% { opacity: 0; transform: translateY(4px); }
          20% { opacity: 1; transform: translateY(0); }
          80% { opacity: 1; }
          100% { opacity: 0; transform: translateY(-10px); }
        }
        .animate-delta { animation: deltaFloat 1.8s ease-out both; }

        @keyframes confettiFall {
          0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
        .animate-confetti-fall { animation: confettiFall linear forwards; }

        @keyframes stickySlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-sticky-in { animation: stickySlideUp 0.25s ease-out both; }

        @media (prefers-reduced-motion: reduce) {
          .field-shake, .animate-card-in, .animate-chip-pop, .animate-delta, .animate-confetti-fall, .animate-sticky-in {
            animation: none !important;
          }
        }
      `}</style>

      {showConfetti && <ConfettiBurst />}

      <div className="mx-auto max-w-2xl lg:grid lg:max-w-5xl lg:grid-cols-[1fr_260px] lg:gap-8">
        <div>
          {/* top bar */}
          <div className="mb-6 flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 rounded-full py-2 pl-1 pr-3 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
              aria-label="Go back"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <span className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Takes about 2 minutes
            </span>
          </div>

          <div className="animate-card-in overflow-hidden rounded-2xl border border-indigo-100 bg-white/70 p-6 shadow-sm backdrop-blur-sm sm:p-8">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-indigo-500">
              <span className="flex h-5 w-5 items-center justify-center rounded-md bg-indigo-600 text-[10px] font-bold text-white">
                R
              </span>
              RecruitIQ · AI-Powered Hiring
            </div>

            <div className="mt-4 flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-500 to-indigo-700 text-white shadow-md">
                <Sparkles className="h-5 w-5" />
              </span>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-[28px]">
                  {candidateName
                    ? `Welcome, ${candidateName}`
                    : "Complete your profile once."}
                </h1>
                <p className="mt-1.5 max-w-md text-[14px] leading-relaxed text-slate-500">
                  We'll use it to match you with better jobs and help recruiters
                  discover you faster.
                </p>
              </div>
            </div>

            <div className="mt-6">
              <div className="mb-1.5 flex items-center justify-between text-xs font-medium text-slate-500">
                <span>Profile Strength</span>
                <span className="flex items-center gap-1.5">
                  <span className="tabular-nums text-indigo-600">
                    {completion}%
                  </span>
                  {pctDelta !== null && (
                    <span className="animate-delta text-[11px] font-semibold text-emerald-600">
                      +{pctDelta}%
                    </span>
                  )}
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-linear-to-r from-indigo-500 to-emerald-500 transition-all duration-700 ease-out"
                  style={{ width: `${completion}%` }}
                />
              </div>
              <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${i < stars ? "fill-amber-400 text-amber-400" : "text-slate-200"}`}
                    />
                  ))}
                </div>
                <span className="font-medium text-slate-600">
                  {strengthText}
                </span>
              </div>
            </div>

            <ul className="mt-6 grid gap-2.5 sm:grid-cols-3">
              {[
                "AI-powered job recommendations",
                "Higher recruiter visibility",
                "One-click applications",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 rounded-xl bg-white px-3 py-2.5 text-[13px] font-medium text-slate-600 shadow-sm ring-1 ring-slate-100"
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* mobile checklist — visible under the hero, not hidden */}
          <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:hidden">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-800">
                Your checklist
              </p>
              <span className="text-xs font-medium text-slate-400">
                {remainingCount === 0
                  ? "All done"
                  : `${remainingCount} remaining`}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {checklist.map(({ key, label }) => {
                const isDone = completionMap[key];
                return (
                  <div
                    key={key}
                    className={`flex flex-col gap-0.5 rounded-lg px-2.5 py-2 text-xs font-medium ${
                      isDone
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-50 text-slate-400"
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      {isDone ? (
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                      ) : (
                        <Circle className="h-3.5 w-3.5 shrink-0" />
                      )}
                      {label}
                    </span>
                    <span className="pl-5 text-[10px] font-normal opacity-80">
                      {isDone ? "Completed" : "Missing"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {error && (
            <div className="mt-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {submitted && errorCount > 0 && (
            <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
                <div>
                  <p className="font-semibold text-amber-900">Almost there</p>
                  <p className="text-amber-700">
                    {errorCount} thing{errorCount > 1 ? "s" : ""} need
                    {errorCount > 1 ? "" : "s"} your attention.
                  </p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2 pl-8">
                {errorKeys.map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      const node = fieldRefs.current[key];
                      node?.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                      });
                      node
                        ?.querySelector<HTMLElement>("input, textarea, select")
                        ?.focus();
                    }}
                    className="rounded-full border border-amber-300 bg-white px-3 py-1 text-xs font-medium text-amber-800 transition hover:bg-amber-100"
                  >
                    {FIELD_LABELS[key] ?? key}
                  </button>
                ))}
              </div>
            </div>
          )}

          <form
            ref={formRef}
            onSubmit={handleSubmit}
            noValidate
            className="mt-6 space-y-6 sm:space-y-8"
          >
            {/* CAREER */}
            <Card
              icon={Briefcase}
              title="Career"
              subtitle="This information helps recruiters understand your professional background."
              delayMs={60}
              accent="indigo"
              isDone={careerRemaining === 0}
              remaining={careerRemaining}
            >
              <div
                ref={(el) => {
                  fieldRefs.current.currentJob = el;
                }}
                className={shakeField === "currentJob" ? "field-shake" : ""}
              >
                <FloatingField
                  htmlFor="currentJob"
                  label="Current / most recent job title"
                  required
                  hasError={!!fieldErrors.currentJob}
                  hasValue={!!formData.currentJob}
                >
                  <input
                    id="currentJob"
                    name="currentJob"
                    value={formData.currentJob}
                    onChange={handleTextChange}
                    placeholder="Current / most recent job title"
                    className={inputCls(!!fieldErrors.currentJob)}
                  />
                </FloatingField>
                <FieldError message={fieldErrors.currentJob} />
              </div>

              <div
                ref={(el) => {
                  fieldRefs.current.experienceYears = el;
                }}
                className={`space-y-2 ${shakeField === "experienceYears" ? "field-shake" : ""}`}
              >
                <label className="text-sm font-medium text-slate-700">
                  Years of Professional Experience{" "}
                  <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {EXPERIENCE_OPTIONS.map(
                    ({ value, label, range, icon: Icon }) => {
                      const active = formData.experienceYears === value;
                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              experienceYears: value,
                            }));
                            if (submitted) clearError("experienceYears");
                          }}
                          className={`flex flex-col items-center gap-1 rounded-xl border px-3 py-3 text-center transition-all duration-200 ${
                            active
                              ? "-translate-y-0.5 border-indigo-400 bg-indigo-50 shadow-[0_6px_16px_-6px_rgba(79,70,229,0.4)] ring-2 ring-indigo-200"
                              : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm"
                          }`}
                        >
                          <Icon
                            className={`h-5 w-5 ${active ? "text-indigo-600" : "text-slate-400"}`}
                          />
                          <span
                            className={`text-xs font-semibold ${active ? "text-indigo-700" : "text-slate-700"}`}
                          >
                            {label}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {range}
                          </span>
                        </button>
                      );
                    },
                  )}
                </div>
                <FieldError message={fieldErrors.experienceYears} />
              </div>

              <div
                ref={(el) => {
                  fieldRefs.current.educationLevel = el;
                }}
                className={`space-y-2 ${shakeField === "educationLevel" ? "field-shake" : ""}`}
              >
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <GraduationCap className="h-4 w-4 text-slate-400" />
                  Highest Education Level{" "}
                  <span className="text-red-500">*</span>
                </label>
                <div className="grid gap-2 sm:grid-cols-2">
                  {EDUCATION_OPTIONS.map(({ value, label }) => {
                    const active = formData.educationLevel === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            educationLevel: value,
                          }));
                          if (submitted) clearError("educationLevel");
                        }}
                        className={`flex items-center gap-2.5 rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all duration-200 ${
                          active
                            ? "border-indigo-400 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-200"
                            : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        <span
                          className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                            active ? "border-indigo-500" : "border-slate-300"
                          }`}
                        >
                          {active && (
                            <span className="h-2 w-2 rounded-full bg-indigo-500" />
                          )}
                        </span>
                        {label}
                      </button>
                    );
                  })}
                </div>
                <FieldError message={fieldErrors.educationLevel} />
              </div>
            </Card>

            {/* SKILLS & PREFERENCES */}
            <Card
              icon={Sparkles}
              title="Skills & Preferences"
              subtitle="Help us understand your expertise and where you want to work."
              delayMs={140}
              accent="emerald"
              isDone={skillsPrefRemaining === 0}
              remaining={skillsPrefRemaining}
            >
              <div
                ref={(el) => {
                  fieldRefs.current.skills = el;
                }}
                className={`space-y-1.5 ${shakeField === "skills" ? "field-shake" : ""}`}
              >
                <label className="text-sm font-medium text-slate-700">
                  Key Skills <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={handleSkillKeyDown}
                    placeholder="Type a skill and press Enter"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[15px] outline-none transition-all duration-200 placeholder:text-slate-400 focus:-translate-y-0.5 focus:border-emerald-400 focus:shadow-[0_8px_24px_-8px_rgba(16,185,129,0.35)] focus:ring-2 focus:ring-emerald-100"
                  />
                  <button
                    type="button"
                    onClick={() => addSkill()}
                    className="flex shrink-0 items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 font-medium text-emerald-700 transition-all duration-150 hover:-translate-y-0.5 hover:bg-emerald-100 active:translate-y-0 active:bg-emerald-200"
                  >
                    <Plus className="h-4 w-4" />
                    Add
                  </button>
                </div>
                <FieldError message={fieldErrors.skills} />

                {formData.skills.length === 0 ? (
                  <p className="rounded-lg border border-dashed border-slate-200 px-3 py-2.5 text-xs text-slate-400">
                    No skills yet — add your first skill above, or pick one
                    below.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {formData.skills.map((skill) => (
                      <span
                        key={skill}
                        className={`inline-flex items-center gap-1.5 rounded-full border border-emerald-200/80 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-800 transition-transform hover:-translate-y-0.5 ${
                          poppedSkill === skill ? "animate-chip-pop" : ""
                        }`}
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="text-emerald-500 transition-colors hover:text-emerald-900"
                          aria-label={`Remove ${skill}`}
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {remainingSuggestions.length > 0 && (
                  <div className="pt-1">
                    <p className="mb-1.5 text-xs font-medium text-slate-400">
                      {suggestionLabel}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {remainingSuggestions.map((skill) => (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => addSkill(skill)}
                          className="rounded-full border border-dashed border-slate-300 px-3 py-1.5 text-sm text-slate-500 transition-colors hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
                        >
                          + {skill}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div
                ref={(el) => {
                  fieldRefs.current.preferredJobLocations = el;
                }}
                className={`space-y-1.5 ${shakeField === "preferredJobLocations" ? "field-shake" : ""}`}
              >
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  Preferred Job Location(s){" "}
                  <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    value={locationInput}
                    onChange={(e) => setLocationInput(e.target.value)}
                    onKeyDown={handleLocationKeyDown}
                    placeholder="e.g. Remote, Kochi, Bengaluru — press Enter to add"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[15px] outline-none transition-all duration-200 placeholder:text-slate-400 focus:-translate-y-0.5 focus:border-emerald-400 focus:shadow-[0_8px_24px_-8px_rgba(16,185,129,0.35)] focus:ring-2 focus:ring-emerald-100"
                  />
                  <button
                    type="button"
                    onClick={addLocation}
                    className="flex shrink-0 items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 font-medium text-emerald-700 transition-all duration-150 hover:-translate-y-0.5 hover:bg-emerald-100 active:translate-y-0 active:bg-emerald-200"
                  >
                    <Plus className="h-4 w-4" />
                    Add
                  </button>
                </div>
                <FieldError message={fieldErrors.preferredJobLocations} />

                {locationTags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {locationTags.map((loc) => (
                      <span
                        key={loc}
                        className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700"
                      >
                        <MapPin className="h-3 w-3" />
                        {loc}
                        <button
                          type="button"
                          onClick={() => removeLocation(loc)}
                          className="text-slate-400 transition-colors hover:text-slate-800"
                          aria-label={`Remove ${loc}`}
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Card>

            {/* PROFESSIONAL PRESENCE */}
            <Card
              icon={FileText}
              title="Professional Presence"
              subtitle="A short summary is what recruiters read first."
              delayMs={220}
              accent="amber"
              isDone={presenceRemaining === 0}
              remaining={presenceRemaining}
            >
              <div
                ref={(el) => {
                  fieldRefs.current.bio = el;
                }}
                className={`space-y-3 ${shakeField === "bio" ? "field-shake" : ""}`}
              >
                <label className="text-sm font-medium text-slate-700">
                  Professional Summary <span className="text-red-500">*</span>
                </label>

                {/* AI Assistant */}
                <div className="rounded-xl border border-amber-100 bg-amber-50/40 p-3">
                  <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-amber-700">
                    <Sparkles className="h-3.5 w-3.5" />
                    AI Assistant
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => runBioAssistant("generate")}
                      disabled={bioBusy !== null}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
                    >
                      {bioBusy === "generate" ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Wand2 className="h-3.5 w-3.5" />
                      )}
                      Generate Bio
                    </button>

                    {formData.bio.trim().length > 0 && (
                      <>
                        <button
                          type="button"
                          onClick={() => runBioAssistant("improve")}
                          disabled={bioBusy !== null}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
                        >
                          {bioBusy === "improve" ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Sparkles className="h-3.5 w-3.5" />
                          )}
                          Improve Writing
                        </button>
                        <button
                          type="button"
                          onClick={() => runBioAssistant("shorten")}
                          disabled={bioBusy !== null}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
                        >
                          {bioBusy === "shorten" ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Scissors className="h-3.5 w-3.5" />
                          )}
                          Shorten
                        </button>
                        <button
                          type="button"
                          onClick={() => runBioAssistant("professional")}
                          disabled={bioBusy !== null}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
                        >
                          {bioBusy === "professional" ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Wand className="h-3.5 w-3.5" />
                          )}
                          Make Professional
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-600">
                      Bio Quality
                    </span>
                    <span className="font-semibold text-amber-600">
                      {bioQualityPercent}%
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-linear-to-r from-amber-400 via-orange-400 to-emerald-500 transition-all duration-500"
                      style={{ width: `${bioQualityPercent}%` }}
                    />
                  </div>
                </div>

                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleTextChange}
                  rows={4}
                  placeholder="Describe your experience, top technologies, achievements, and the type of role you're looking for."
                  className={inputCls(
                    !!fieldErrors.bio,
                    "resize-y min-h-27.5 pt-4 placeholder:text-slate-400",
                  )}
                />

                <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3.5">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Requirements
                  </p>
                  <ul className="space-y-1.5">
                    <RequirementRow
                      met={hasEnoughChars}
                      label={`Minimum 20 characters (${bioCharCount}/20)`}
                    />
                    <RequirementRow
                      met={hasEnoughWords}
                      label={`Minimum 5 words (${bioWordCount}/5)`}
                    />
                    <RequirementRow
                      met={underMaxChars}
                      label={`Maximum 1000 characters (${bioCharCount}/1000)`}
                    />
                  </ul>
                  {fieldErrors.bio && (
                    <p className="mt-2.5 flex items-center gap-1.5 border-t border-slate-200 pt-2.5 text-xs font-medium text-red-600">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      {fieldErrors.bio}
                    </p>
                  )}
                </div>

                <Collapsible label="Need inspiration? View example">
                  <p className="text-xs font-semibold uppercase tracking-wide text-amber-600">
                    Example
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Frontend developer with 2 years of experience building
                    responsive web applications using React, TypeScript,
                    Tailwind CSS, and Node.js. Passionate about creating fast,
                    accessible user experiences while continuously learning
                    modern frontend technologies.
                  </p>
                  <p className="mt-3 text-xs text-slate-500">
                    Mention your experience, strongest technologies, one
                    achievement, and your career goals. Aim for 3–5 sentences.
                  </p>
                </Collapsible>
              </div>

              <div
                ref={(el) => {
                  fieldRefs.current.linkedinUrl = el;
                }}
                className={shakeField === "linkedinUrl" ? "field-shake" : ""}
              >
                <div className="mb-1.5 flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-700">
                    LinkedIn Profile
                  </span>
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
                    Recommended
                  </span>
                </div>
                <FloatingField
                  htmlFor="linkedinUrl"
                  label="LinkedIn Profile (Optional)"
                  hasError={!!fieldErrors.linkedinUrl}
                  hasValue={!!formData.linkedinUrl}
                >
                  <div className="relative">
                    <Linkedin className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300" />
                    <input
                      id="linkedinUrl"
                      name="linkedinUrl"
                      value={formData.linkedinUrl ?? ""}
                      onChange={handleTextChange}
                      placeholder="LinkedIn"
                      className={inputCls(!!fieldErrors.linkedinUrl, "pr-10")}
                    />
                  </div>
                </FloatingField>
                <p className="mt-2 text-xs text-slate-500">
                  Adding your LinkedIn profile helps recruiters verify your
                  professional experience and increases profile credibility.
                </p>
                <FieldError message={fieldErrors.linkedinUrl} />
              </div>
            </Card>

            <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-5 text-sm text-slate-600">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-slate-400 ring-1 ring-slate-200">
                <Lock className="h-4 w-4" />
              </span>
              <div>
                <p className="font-medium text-slate-700">
                  Your information is private.
                </p>
                <p className="mt-0.5 text-slate-500">
                  Recruiters only see your profile when you apply for a job. You
                  can update it anytime.{" "}
                  <a
                    href="/support"
                    className="font-medium text-indigo-600 underline underline-offset-2 hover:text-indigo-700"
                  >
                    Need help? Contact Support
                  </a>
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 pb-20 sm:flex-row sm:pb-0">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 rounded-xl border border-slate-300 bg-white px-6 py-3.5 font-medium text-slate-700 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow active:translate-y-0"
              >
                Previous
              </button>
              <button
                type="submit"
                disabled={isSubmitting || saveState !== "idle"}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-indigo-600 to-indigo-700 px-6 py-3.5 font-semibold text-white shadow-[0_8px_24px_-8px_rgba(79,70,229,0.6)] transition-all duration-150 hover:-translate-y-0.5 hover:from-indigo-700 hover:to-indigo-800 hover:shadow-[0_12px_28px_-8px_rgba(79,70,229,0.7)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-80"
              >
                {saveState === "saving" && (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Saving Profile...
                  </>
                )}
                {saveState === "success" && (
                  <>
                    <CheckCircle2 className="h-5 w-5 animate-in zoom-in-50 duration-200" />
                    Profile Completed — Redirecting...
                  </>
                )}
                {saveState === "idle" && "Save Profile & Continue"}
              </button>
            </div>
          </form>
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-10 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="mb-1 text-sm font-semibold text-slate-800">
              Profile Strength
            </p>
            <div className="mb-1 flex items-baseline gap-2">
              <p className="text-2xl font-bold text-indigo-600">
                {completion}%
              </p>
              {pctDelta !== null && (
                <span className="animate-delta text-xs font-semibold text-emerald-600">
                  +{pctDelta}%
                </span>
              )}
            </div>
            <div className="mb-4 flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-3.5 w-3.5 ${i < stars ? "fill-amber-400 text-amber-400" : "text-slate-200"}`}
                />
              ))}
              <span className="ml-1.5 text-xs font-medium text-slate-500">
                {strengthText}
              </span>
            </div>
            <ul className="space-y-2.5">
              {checklist.map(({ key, label }) => {
                const isDone = completionMap[key];
                return (
                  <li
                    key={key}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="flex items-center gap-2">
                      {isDone ? (
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                      ) : (
                        <span className="h-4 w-4 shrink-0 rounded-full border-2 border-slate-200" />
                      )}
                      <span
                        className={isDone ? "text-slate-700" : "text-slate-400"}
                      >
                        {label}
                      </span>
                    </span>
                    <span
                      className={`text-[11px] font-medium ${isDone ? "text-emerald-600" : "text-slate-400"}`}
                    >
                      {isDone ? "Completed" : "Missing"}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>
      </div>

      {showStickySave && saveState === "idle" && (
        <div className="animate-sticky-in fixed inset-x-4 bottom-4 z-40 sm:hidden">
          <button
            type="button"
            onClick={() => formRef.current?.requestSubmit()}
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-indigo-600 to-indigo-700 px-6 py-3.5 font-semibold text-white shadow-[0_12px_28px_-6px_rgba(79,70,229,0.55)] transition-all duration-150 active:translate-y-0"
          >
            Save Profile & Continue
          </button>
        </div>
      )}
    </div>
  );
}
