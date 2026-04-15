// components/recruiter-profile/RecruiterProfileHeader.tsx
import { ArrowLeft, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Recruiter } from "@/module/admin/domain/entities/recruiter.entity";

interface RecruiterProfileHeaderProps {
  recruiter: Recruiter;
  onBack: () => void;
}

export function RecruiterProfileHeader({ recruiter, onBack }: RecruiterProfileHeaderProps) {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-slate-600 hover:text-indigo-700 hover:bg-indigo-50/50"
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Recruiters
        </Button>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Recruiter Profile
        </h1>
      </div>

      <Button variant="outline" size="sm" className="gap-2 shadow-sm">
        <Download className="h-4 w-4" />
        Export PDF
      </Button>
    </header>
  );
}