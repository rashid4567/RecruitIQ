import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { RecruiterProfile } from "@/module/admin/types/recruiter.types";

interface RecruiterProfileHeaderProps {
  recruiter: RecruiterProfile;
  onBack: () => void;
}

export function RecruiterProfileHeader({ recruiter, onBack }: RecruiterProfileHeaderProps) {
  return (
    <header className="flex flex-col gap-3">
      <Button
        variant="ghost"
        size="sm"
        className="gap-2 text-slate-500 hover:text-indigo-700 hover:bg-indigo-50/60 w-fit -ml-2.5 h-8 px-2.5"
        onClick={onBack}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Recruiters
      </Button>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Recruiter Profile
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Reviewing details for{" "}
            <span className="font-semibold text-slate-700">{recruiter.name}</span>
          </p>
        </div>
      </div>
    </header>
  );
}