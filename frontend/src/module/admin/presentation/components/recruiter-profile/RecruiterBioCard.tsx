import { FileText } from "lucide-react";
import type { Recruiter } from "@/module/admin/domain/entities/recruiter.entity";

interface RecruiterBioCardProps {
  recruiter: Recruiter;
}

export function RecruiterBioCard({ recruiter }: RecruiterBioCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-50">
        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
          <FileText className="w-4 h-4 text-slate-500" />
        </div>
        <h3 className="text-sm font-semibold text-gray-800 tracking-wide uppercase">About Company</h3>
      </div>
      <div className="p-6">
        {recruiter.bio?.trim() ? (
          <p className="text-sm text-gray-600 leading-relaxed">{recruiter.bio}</p>
        ) : (
          <p className="text-sm text-gray-400 italic">No company description provided.</p>
        )}
      </div>
    </div>
  );
}