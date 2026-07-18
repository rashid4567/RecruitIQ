import { BriefcaseBusiness, Building2, FileText, CalendarDays, Crown } from "lucide-react";
import type { RecruiterProfile } from "@/module/admin/types/recruiter.types";

interface RecruiterCompanyCardProps {
  recruiter: RecruiterProfile;
}

export function RecruiterCompanyCard({ recruiter }: RecruiterCompanyCardProps) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200 h-full">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100">
        <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
          <BriefcaseBusiness className="w-4 h-4 text-indigo-500" />
        </div>
        <h3 className="text-sm font-bold text-slate-800 tracking-wide">
          Company &amp; Subscription
        </h3>
      </div>
      <div className="p-6 space-y-5">
        <InfoItem
          icon={Building2}
          accent="bg-sky-50 border-sky-100"
          iconColor="text-sky-500"
          label="Company Name"
          value={recruiter.companyName || "—"}
        />
        <InfoItem
          icon={Crown}
          accent="bg-violet-50 border-violet-100"
          iconColor="text-violet-500"
          label="Subscription"
          value={recruiter.subscriptionStatus?.toUpperCase() || "FREE"}
        />
        <InfoItem
          icon={FileText}
          accent="bg-slate-100 border-slate-200"
          iconColor="text-slate-500"
          label="Job Posts Used"
          value={String(recruiter.jobPostsUsed)}
        />
        <InfoItem
          icon={CalendarDays}
          accent="bg-emerald-50 border-emerald-100"
          iconColor="text-emerald-500"
          label="Member Since"
          value={
            recruiter.joinedDate
              ? new Date(recruiter.joinedDate).toLocaleDateString("en-IN", {
                  month: "long",
                  year: "numeric",
                })
              : "—"
          }
        />
      </div>
    </div>
  );
}

function InfoItem({
  icon: Icon,
  accent,
  iconColor,
  label,
  value,
}: {
  icon: React.ElementType;
  accent: string;
  iconColor: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3.5">
      <div className={`w-10 h-10 rounded-xl ${accent} border flex items-center justify-center shrink-0`}>
        <Icon className={`h-4 w-4 ${iconColor}`} />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">{label}</p>
        <p className="text-sm font-semibold text-slate-800 mt-0.5 truncate">{value}</p>
      </div>
    </div>
  );
}