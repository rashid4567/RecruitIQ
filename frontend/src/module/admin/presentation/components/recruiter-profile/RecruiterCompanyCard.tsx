// components/recruiter-profile/RecruiterCompanyCard.tsx
import { BriefcaseBusiness, Building2, FileText, CalendarDays, Crown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Recruiter } from "@/module/admin/domain/entities/recruiter.entity";

interface RecruiterCompanyCardProps {
  recruiter: Recruiter;
}

export function RecruiterCompanyCard({ recruiter }: RecruiterCompanyCardProps) {
  return (
    // No col-span here — the parent page grid controls layout
    <Card className="border-slate-200/60 shadow-sm rounded-2xl">
      <CardHeader className="bg-slate-50/80 px-6 py-4 border-b">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <BriefcaseBusiness className="h-5 w-5 text-indigo-600" />
          Company & Subscription
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 grid sm:grid-cols-2 gap-6">
        <InfoItem
          icon={Building2}
          label="Company Name"
          value={recruiter.companyName || "—"}
        />
        <InfoItem
          icon={Crown}
          label="Subscription"
          value={recruiter.subscriptionStatus?.toUpperCase() || "FREE"}
        />
        <InfoItem
          icon={FileText}
          label="Job Posts Used"
          value={String(recruiter.jobPostsUsed)}
        />
        <InfoItem
          icon={CalendarDays}
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
      </CardContent>
    </Card>
  );
}

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="rounded-xl bg-slate-100 p-3">
        <Icon className="h-5 w-5 text-slate-600" />
      </div>
      <div>
        <p className="text-xs font-medium text-slate-500 uppercase tracking-widest">{label}</p>
        <p className="font-semibold text-slate-900 mt-1">{value}</p>
      </div>
    </div>
  );
}