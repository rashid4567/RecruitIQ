import { FileText } from "lucide-react";
import type { RecruiterProfile } from "@/module/admin/types/recruiter.types";

interface RecruiterBioCardProps {
  recruiter: RecruiterProfile;
}

export function RecruiterBioCard({ recruiter }: RecruiterBioCardProps) {
  const hasBio = Boolean(recruiter.bio?.trim());

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200 h-full">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100">
        <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
          <FileText className="w-4 h-4 text-indigo-500" />
        </div>
        <h3 className="text-sm font-bold text-slate-800 tracking-wide">
          About Company
        </h3>
      </div>
      <div className="p-6">
        {hasBio ? (
          <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
            {recruiter.bio}
          </p>
        ) : (
          <div className="flex flex-col items-center text-center py-6 gap-2">
            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
              <FileText className="w-4 h-4 text-slate-300" />
            </div>
            <p className="text-sm text-slate-400">
              No company description provided.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}