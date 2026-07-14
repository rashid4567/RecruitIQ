import { MoreVertical } from "lucide-react";
import type { RecruiterSubscription } from "@/module/subscription/types/RecruiterSubscription.types";
import { useMemo } from "react";
interface SubscriptionOverviewProps {
  subscription: RecruiterSubscription;
  overallUsage: number;
}

export default function SubscriptionOverview({
  subscription,
  overallUsage,
}: SubscriptionOverviewProps) {
  const startDate = subscription.startDate
    ? new Date(subscription.startDate)
    : null;

  const today = useMemo(() => new Date(), []);

  const subscriptionDays = startDate
    ? Math.floor(
        (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
      )
    : 0;

  return (
    <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6">
      <div className="grid gap-6 md:grid-cols-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Current Plan
          </p>

          <h2 className="text-2xl font-bold text-slate-900">
            {subscription.planName}
          </h2>

          <p className="mt-2 text-sm text-slate-600">
            {subscription.planType} plan
          </p>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Subscription Since
          </p>

          <h2 className="text-2xl font-bold text-slate-900">
            {startDate
              ? startDate.toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })
              : "—"}
          </h2>

          <p className="mt-2 text-sm text-slate-600">{subscriptionDays} days</p>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Overall Usage
          </p>

          <h2 className="text-2xl font-bold text-blue-600">{overallUsage}%</h2>

          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full bg-linear-to-r from-blue-600 to-blue-500"
              style={{ width: `${overallUsage}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-end">
          <button className="rounded-lg bg-slate-100 p-3 text-slate-600 transition-colors hover:bg-slate-200 hover:text-slate-900">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
