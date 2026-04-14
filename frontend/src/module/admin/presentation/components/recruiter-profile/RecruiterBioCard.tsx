// components/recruiter-profile/RecruiterBioCard.tsx
import { User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Recruiter } from "@/module/admin/domain/entities/recruiter.entity";

interface RecruiterBioCardProps {
  recruiter: Recruiter;
}

export function RecruiterBioCard({ recruiter }: RecruiterBioCardProps) {
  return (
    // No col-span here — the parent page grid controls layout
    <Card className="border-slate-200/60 shadow-sm rounded-2xl">
      <CardHeader className="bg-slate-50/80 px-6 py-4 border-b">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <User className="h-5 w-5 text-indigo-600" />
          About Company
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 text-slate-700 text-[15px] leading-relaxed">
        {recruiter.bio?.trim() ? (
          recruiter.bio
        ) : (
          <span className="text-slate-500 italic">No company description provided.</span>
        )}
      </CardContent>
    </Card>
  );
}