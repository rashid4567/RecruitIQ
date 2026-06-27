import { BriefcaseBusiness, Building2, FileText, CalendarDays, Crown } from "lucide-react";
import type { RecruiterProfile } from "@/module/admin/types/recruiter.types";

interface RecruiterCompanyCardProps {
  recruiter: RecruiterProfile;
}

export function RecruiterCompanyCard({ recruiter }: RecruiterCompanyCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-50">
        <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
          <BriefcaseBusiness className="w-4 h-4 text-amber-500" />
        </div>
        <h3 className="text-sm font-semibold text-gray-800 tracking-wide uppercase">Company & Subscription</h3>
      </div>
      <div className="p-6 grid sm:grid-cols-2 gap-5">
        <InfoItem
          icon={Building2}
          accent="bg-sky-50"
          iconColor="text-sky-500"
          label="Company Name"
          value={recruiter.companyName || "—"}
        />
        <InfoItem
          icon={Crown}
          accent="bg-violet-50"
          iconColor="text-violet-500"
          label="Subscription"
          value={recruiter.subscriptionStatus?.toUpperCase() || "FREE"}
        />
        <InfoItem
          icon={FileText}
          accent="bg-gray-50"
          iconColor="text-gray-400"
          label="Job Posts Used"
          value={String(recruiter.jobPostsUsed)}
        />
        <InfoItem
          icon={CalendarDays}
          accent="bg-emerald-50"
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
    <div className="flex items-start gap-3">
      <div className={`w-9 h-9 rounded-xl ${accent} border border-gray-100 flex items-center justify-center shrink-0`}>
        <Icon className={`h-4 w-4 ${iconColor}`} />
      </div>
      <div>
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{label}</p>
        <p className="text-sm font-semibold text-gray-800 mt-0.5">{value}</p>
      </div>
    </div>
  );
}