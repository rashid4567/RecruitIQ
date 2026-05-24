import { Input } from "@/components/ui/input";
import { Code2, Star, TrendingUp } from "lucide-react";
import TagInput from "./TagInput";
import type { JobFormData } from "@/module/recruiter/presentation/types/jobForm.types";

interface Props {
  formData: JobFormData;
  setFormData: (updater: (prev: JobFormData) => JobFormData) => void;
  errors: Record<string, string>;
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

const skillSuggestions = [
  "React",
  "Node.js",
  "Python",
  "TypeScript",
  "AWS",
  "Docker",
  "PostgreSQL",
  "MongoDB",
  "GraphQL",
  "Next.js",
  "Kubernetes",
  "Java",
  "Go",
  "Redis",
  "Terraform",
  "CI/CD",
  "REST APIs",
  "System Design",
  "Microservices",
  "Vue.js",
  "Angular",
  "Swift",
  "Kotlin",
  "Flutter",
  "Django",
  "FastAPI",
  "Spring Boot",
];

const experienceLevels = [
  { label: "Entry", range: "0–2", min: 0, max: 2, color: "bg-emerald-500" },
  { label: "Mid", range: "2–5", min: 2, max: 5, color: "bg-blue-500" },
  { label: "Senior", range: "5–8", min: 5, max: 8, color: "bg-violet-500" },
  { label: "Lead", range: "8+", min: 8, max: 15, color: "bg-amber-500" },
];

export default function Step3Requirements({
  formData,
  setFormData,
  errors,
}: Props) {
  const expMin = formData.experienceMin;
  const expMax = formData.experienceMax;

  const setExp = (min: number, max: number) => {
    setFormData((p) => ({ ...p, experienceMin: min, experienceMax: max }));
  };

  const activeLevel = experienceLevels.find(
    (l) => l.min === expMin && l.max === expMax,
  );

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center">
            <Code2 className="w-4 h-4 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            Skills & Experience
          </h2>
        </div>
        <p className="text-gray-500 text-sm ml-10">
          What should the ideal candidate bring to the table?
        </p>
      </div>

      <div className="space-y-7">
        <div className="p-5 bg-linear-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100/80">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <label className="text-sm font-bold text-gray-800">
              Years of Experience <span className="text-red-400">*</span>
            </label>
          </div>

          <div className="grid grid-cols-4 gap-2 mb-4">
            {experienceLevels.map((level) => {
              const isActive = activeLevel?.label === level.label;
              return (
                <button
                  key={level.label}
                  type="button"
                  onClick={() => setExp(level.min, level.max)}
                  className={`flex flex-col items-center py-2.5 px-3 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "border-indigo-400 bg-white shadow-md shadow-indigo-100/60 text-indigo-700"
                      : "border-transparent bg-white/60 text-gray-500 hover:bg-white hover:border-gray-200"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${level.color} mb-1.5`}
                  />
                  <span className="font-bold text-xs">{level.label}</span>
                  <span className="text-[11px] text-gray-400">
                    {level.range} yrs
                  </span>
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-blue-700/80 uppercase tracking-wider block mb-1.5">
                Minimum Years
              </label>
              <div className="relative">
                <Input
                  type="number"
                  min={0}
                  max={50}
                  value={expMin}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      experienceMin: parseInt(e.target.value) || 0,
                    }))
                  }
                  className={`h-11 rounded-xl border-2 bg-white text-sm font-medium pr-14 transition-all focus:ring-4 focus:ring-blue-100 ${
                    errors.experienceMin
                      ? "border-red-400"
                      : "border-blue-200 focus:border-blue-400"
                  }`}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">
                  years
                </span>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-blue-700/80 uppercase tracking-wider block mb-1.5">
                Maximum Years
              </label>
              <div className="relative">
                <Input
                  type="number"
                  min={0}
                  max={50}
                  value={expMax}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      experienceMax: parseInt(e.target.value) || 0,
                    }))
                  }
                  className={`h-11 rounded-xl border-2 bg-white text-sm font-medium pr-14 transition-all focus:ring-4 focus:ring-blue-100 ${
                    errors.experienceMax
                      ? "border-red-400"
                      : "border-blue-200 focus:border-blue-400"
                  }`}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">
                  years
                </span>
              </div>
            </div>
          </div>
          <ErrorMsg msg={errors.experienceMax || errors.experienceMin} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-indigo-500 flex items-center justify-center">
                <Code2 className="w-3 h-3 text-white" />
              </div>
              <label className="text-sm font-bold text-gray-800">
                Required Skills <span className="text-red-400">*</span>
              </label>
            </div>
            {formData.requiredSkills.length > 0 && (
              <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
                {formData.requiredSkills.length} skill
                {formData.requiredSkills.length !== 1 ? "s" : ""} added
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 mb-2 ml-7">
            Skills candidates must have — these will be shown prominently on the
            listing
          </p>
          <TagInput
            tags={formData.requiredSkills}
            setTags={(tags) =>
              setFormData((p) => ({ ...p, requiredSkills: tags }))
            }
            placeholder="Type a skill and press Enter..."
            suggestions={skillSuggestions.filter(
              (s) => !formData.preferredSkills.includes(s),
            )}
            color="indigo"
          />
          <ErrorMsg msg={errors.requiredSkills} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-violet-400 flex items-center justify-center">
                <Star className="w-3 h-3 text-white" />
              </div>
              <label className="text-sm font-bold text-gray-800">
                Preferred Skills
                <span className="ml-2 text-xs font-normal text-gray-400">
                  (optional)
                </span>
              </label>
            </div>
            {formData.preferredSkills.length > 0 && (
              <span className="text-xs font-semibold text-violet-600 bg-violet-50 px-2.5 py-1 rounded-full border border-violet-100">
                {formData.preferredSkills.length} skill
                {formData.preferredSkills.length !== 1 ? "s" : ""} added
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 mb-2 ml-7">
            Nice-to-have skills that would set candidates apart
          </p>
          <TagInput
            tags={formData.preferredSkills}
            setTags={(tags) =>
              setFormData((p) => ({ ...p, preferredSkills: tags }))
            }
            placeholder="Type a preferred skill and press Enter..."
            suggestions={skillSuggestions.filter(
              (s) => !formData.requiredSkills.includes(s),
            )}
            color="violet"
          />
        </div>
      </div>
    </div>
  );
}
