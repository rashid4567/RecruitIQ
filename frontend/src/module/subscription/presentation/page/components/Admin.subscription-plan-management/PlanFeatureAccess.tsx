import { CollapsibleSection } from "./CollapsibleSection";
import { Calendar, BarChart2, ShieldCheck, FileSearch, ScanText, Users, Download } from "lucide-react";
import { Toggle } from "./Toggle";
import type { PlanFormData } from "../../../hooks/Admin.Subscription.plans.Hooks/usePlanEditor";

interface PlanFeatureAccessProps {
  formData: PlanFormData;
  handleFeaturesAccessChange: (
    key: keyof PlanFormData["featuresAccess"],
    value: boolean
  ) => void;
}

interface FeatureRowProps {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  label: string;
  description: string;
  checked: boolean;
  onToggle: () => void;
}

function FeatureRow({ icon, iconBg, iconColor, label, description, checked, onToggle }: FeatureRowProps) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 px-5 py-4">
      <div className="flex items-center gap-3">
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${iconBg}`}>
          <span className={iconColor}>{icon}</span>
        </div>
        <div>
          <p className="text-sm font-semibold text-zinc-800">{label}</p>
          <p className="text-xs text-zinc-500">{description}</p>
        </div>
      </div>
      <Toggle checked={checked} onChange={onToggle} />
    </div>
  );
}

export default function PlanFeatureAccess({
  formData,
  handleFeaturesAccessChange,
}: PlanFeatureAccessProps) {
  const { featuresAccess } = formData;

  return (
    <CollapsibleSection title="Feature Access Controls">
      <p className="text-sm text-zinc-500 mb-5">
        Control which premium capabilities this plan unlocks for subscribers.
      </p>

      <div className="space-y-4">
        <FeatureRow
          icon={<Calendar className="h-4 w-4" />}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
          label="Interview Scheduling"
          description="Allow automated interview booking with candidates"
          checked={featuresAccess.interviewScheduling}
          onToggle={() => handleFeaturesAccessChange("interviewScheduling", !featuresAccess.interviewScheduling)}
        />

        <FeatureRow
          icon={<BarChart2 className="h-4 w-4" />}
          iconBg="bg-emerald-100"
          iconColor="text-emerald-600"
          label="Advanced Analytics"
          description="Detailed hiring funnel metrics and reports"
          checked={featuresAccess.advancedAnalytics}
          onToggle={() => handleFeaturesAccessChange("advancedAnalytics", !featuresAccess.advancedAnalytics)}
        />

        <FeatureRow
          icon={<ShieldCheck className="h-4 w-4" />}
          iconBg="bg-amber-100"
          iconColor="text-amber-600"
          label="Priority Support"
          description="Dedicated support with faster response times"
          checked={featuresAccess.prioritySupport}
          onToggle={() => handleFeaturesAccessChange("prioritySupport", !featuresAccess.prioritySupport)}
        />

        {/* ✅ added: was missing from entity */}
        <FeatureRow
          icon={<ScanText className="h-4 w-4" />}
          iconBg="bg-violet-100"
          iconColor="text-violet-600"
          label="AI Resume Scoring"
          description="Automatically score and rank candidates by resume quality"
          checked={featuresAccess.aiResumeScoring}
          onToggle={() => handleFeaturesAccessChange("aiResumeScoring", !featuresAccess.aiResumeScoring)}
        />

        {/* ✅ added: was missing from entity */}
        <FeatureRow
          icon={<FileSearch className="h-4 w-4" />}
          iconBg="bg-sky-100"
          iconColor="text-sky-600"
          label="Resume Parsing"
          description="Extract structured data from uploaded resumes automatically"
          checked={featuresAccess.resumeParsing}
          onToggle={() => handleFeaturesAccessChange("resumeParsing", !featuresAccess.resumeParsing)}
        />

        {/* ✅ added: was missing from entity */}
        <FeatureRow
          icon={<Users className="h-4 w-4" />}
          iconBg="bg-rose-100"
          iconColor="text-rose-600"
          label="Candidate Shortlisting"
          description="AI-assisted shortlisting of top candidates per job post"
          checked={featuresAccess.candidateShortlisting}
          onToggle={() => handleFeaturesAccessChange("candidateShortlisting", !featuresAccess.candidateShortlisting)}
        />

        {/* ✅ added: was missing from entity */}
        <FeatureRow
          icon={<Download className="h-4 w-4" />}
          iconBg="bg-teal-100"
          iconColor="text-teal-600"
          label="Export Reports"
          description="Download hiring reports as PDF or CSV"
          checked={featuresAccess.exportReports}
          onToggle={() => handleFeaturesAccessChange("exportReports", !featuresAccess.exportReports)}
        />
      </div>
    </CollapsibleSection>
  );
}