import { Brain, FileText, Search, Briefcase, TrendingUp } from "lucide-react";
import UsageCard from "./UsageCard";
import type { RecruiterSubscription } from "@/module/subscription/domain/entity/RecruiterSubscription.entity";

interface UsageSectionProps {
  subscription: RecruiterSubscription;
}

export default function UsageSection({ subscription }: UsageSectionProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
        <TrendingUp className="h-6 w-6 text-blue-600" />
        Current Usage
      </h2>
      <div className="grid md:grid-cols-2 gap-6">
        <UsageCard
          title="Job Posts"
          used={subscription.jobPostsUsed}
          limit={subscription.jobPostsLimit}
          icon={<Briefcase className="h-6 w-6 text-white" />}
          linear="from-blue-600 to-blue-500"
          description="Active listings per month"
        />
        <UsageCard
          title="Screening Credits"
          used={subscription.screeningUsed}
          limit={subscription.screeningLimit}
          icon={<Search className="h-6 w-6 text-white" />}
          linear="from-emerald-600 to-emerald-500"
          description="AI-powered screening"
        />
        <UsageCard
          title="Resume Parsing"
          used={subscription.resumeUsed}
          limit={subscription.resumeLimit}
          icon={<FileText className="h-6 w-6 text-white" />}
          linear="from-purple-600 to-purple-500"
          description="Automated parsing per month"
        />
        <UsageCard
          title="AI Scoring"
          used={subscription.aiScoreUsed}
          limit={subscription.aiScoreLimit}
          icon={<Brain className="h-6 w-6 text-white" />}
          linear="from-orange-600 to-orange-500"
          description="Candidate evaluation credits"
        />
      </div>
    </div>
  );
}
