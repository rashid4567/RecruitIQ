import { Lightbulb } from "lucide-react";
import { SectionCard } from "./Sectioncard";

interface InterviewTipsSectionProps {
  allSkills: string[];
}

const TIPS = [
  "Prepare concrete examples of your past projects and measurable outcomes",
  "Practice explaining your problem-solving approach and technical decisions",
  "Research the company's products, mission, and recent news",
  "Prepare thoughtful questions to ask the interviewer",
];

export function InterviewTipsSection({ allSkills }: InterviewTipsSectionProps) {
  return (
    <SectionCard
      title="Interview preparation tips"
      icon={<Lightbulb className="w-4 h-4" />}
      collapsible
      defaultOpen={false}
    >
      <div className="space-y-2.5 pt-4">
        {allSkills.length > 0 && (
          <p className="text-sm text-slate-600 flex items-start gap-2">
            <span className="text-blue-400 mt-0.5 shrink-0">•</span>
            Review concepts related to:{" "}
            <span className="font-medium text-slate-700">
              {allSkills.slice(0, 5).join(", ")}
            </span>
          </p>
        )}
        {TIPS.map((tip, i) => (
          <p key={i} className="text-sm text-slate-600 flex items-start gap-2">
            <span className="text-blue-400 mt-0.5 shrink-0">•</span>
            {tip}
          </p>
        ))}
      </div>
    </SectionCard>
  );
}
