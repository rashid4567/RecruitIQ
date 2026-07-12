import { Check, Star } from "lucide-react";
import { SectionCard } from "./Sectioncard";

interface SkillsSectionProps {
  requiredSkills: string[];
  preferredSkills: string[];
}

export function SkillsSection({ requiredSkills, preferredSkills }: SkillsSectionProps) {
  const total = requiredSkills.length + preferredSkills.length;
  if (total === 0) return null;

  return (
    <SectionCard title="Skills" icon={<Check className="w-4 h-4" />}>
      <div className="pt-4 space-y-4">
        <p className="text-xs text-slate-400">
          {total} skill{total === 1 ? "" : "s"} for this role — review these before your interview.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {requiredSkills.length > 0 && (
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-3">
                Required <span className="text-slate-300 font-medium normal-case">· {requiredSkills.length}</span>
              </p>
              <div className="flex flex-wrap gap-1.5">
                {requiredSkills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors"
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
                Preferred <span className="text-slate-300 font-medium normal-case">· {preferredSkills.length}</span>
              </p>
              <div className="flex flex-wrap gap-1.5">
                {preferredSkills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-lg text-xs font-medium hover:bg-amber-100 transition-colors"
                  >
                    <Star className="w-2.5 h-2.5" />
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </SectionCard>
  );
}