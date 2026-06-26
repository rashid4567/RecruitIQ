import { Check } from "lucide-react";
import { SectionCard } from "./Sectioncard";

interface SkillsSectionProps {
  requiredSkills: string[];
  preferredSkills: string[];
}

export function SkillsSection({ requiredSkills, preferredSkills }: SkillsSectionProps) {
  if (requiredSkills.length === 0 && preferredSkills.length === 0) return null;

  return (
    <SectionCard
      title="Skills required"
      icon={<Check className="w-4 h-4" />}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4">
        {requiredSkills.length > 0 && (
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-3">
              Required
            </p>
            <div className="flex flex-wrap gap-1.5">
              {requiredSkills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-lg text-xs font-medium"
                >
                  <Check className="w-2.5 h-2.5" />
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
        {preferredSkills.length > 0 && (
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-3">
              Preferred
            </p>
            <div className="flex flex-wrap gap-1.5">
              {preferredSkills.map((skill) => (
                <span
                  key={skill}
                  className="bg-slate-50 text-slate-600 border border-slate-200 px-2.5 py-1 rounded-lg text-xs font-medium hover:border-slate-300 transition-colors"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </SectionCard>
  );
}