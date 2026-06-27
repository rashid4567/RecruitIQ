import { MoreVertical } from "lucide-react";
import type { RecruiterSubscription } from "@/module/subscription/domain/entity/RecruiterSubscription.entity";

interface SubscriptionOverviewProps {
  subscription: RecruiterSubscription;
  overallUsage: number;
}

export default function SubscriptionOverview({
  subscription,
  overallUsage,
}: SubscriptionOverviewProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 mb-8">
      <div className="grid md:grid-cols-4 gap-6">
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">
            Current Plan
          </p>
          <h2 className="text-2xl font-bold text-slate-900">
            {subscription.planName}
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            {subscription.planType} plan
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">
            Subscription Since
          </p>
          <h2 className="text-2xl font-bold text-slate-900">
            {new Date(subscription.startDate).toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            })}
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            {Math.floor(
              (new Date().getTime() -
                new Date(subscription.startDate).getTime()) /
                (1000 * 60 * 60 * 24),
            )}{" "}
            days
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">
            Overall Usage
          </p>
          <h2 className="text-2xl font-bold text-blue-600">{overallUsage}%</h2>
          <div className="h-2 rounded-full bg-slate-200 mt-2 overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-blue-600 to-blue-500"
              style={{ width: `${overallUsage}%` }}
            />
          </div>
        </div>
        <div className="flex items-center justify-end">
          <button className="p-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
