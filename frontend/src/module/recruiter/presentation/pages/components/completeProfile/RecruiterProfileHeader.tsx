
import { Sparkles } from "lucide-react";

export function RecruiterProfileHeader() {
  return (
    <div className="text-center space-y-4">
      <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium">
        <Sparkles className="h-4 w-4" />
        Step 2 of 2
      </div>
      <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
        Complete Your Recruiter Profile
      </h1>
      <p className="text-lg text-slate-600 max-w-2xl mx-auto">
        Tell us about your company and choose a plan to start hiring top talent.
      </p>
    </div>
  );
}