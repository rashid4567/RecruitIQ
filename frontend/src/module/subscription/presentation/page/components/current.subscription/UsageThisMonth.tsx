import type { RecruiterSubscription } from "@/module/subscription/domain/entity/RecruiterSubscription.entity";

interface UsageThisMonthProps {
  subscription: RecruiterSubscription;
}

interface MiniBarProps {
  label: string;
  used: number;
  limit: number;
  color: string;
}

function MiniBar({ label, used, limit, color }: MiniBarProps) {
  const pct = Math.round((used / limit) * 100);
  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-2">
        <span className="text-slate-600">{label}</span>
        <span className="text-slate-900 font-semibold">{pct}%</span>
      </div>
      <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function UsageThisMonth({ subscription }: UsageThisMonthProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <h3 className="text-lg font-bold text-slate-900 mb-6">
        Usage This Month
      </h3>
      <div className="space-y-4">
        <MiniBar
          label="Job Posts"
          used={subscription.jobPostsUsed}
          limit={subscription.jobPostsLimit}
          color="bg-blue-600"
        />
        <MiniBar
          label="Screening"
          used={subscription.screeningUsed}
          limit={subscription.screeningLimit}
          color="bg-emerald-600"
        />
        <MiniBar
          label="Parsing"
          used={subscription.resumeUsed}
          limit={subscription.resumeLimit}
          color="bg-purple-600"
        />
      </div>
    </div>
  );
}
