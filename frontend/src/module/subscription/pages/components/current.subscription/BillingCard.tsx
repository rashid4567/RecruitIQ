import { CreditCard, Download, Wifi } from "lucide-react";
import type { RecruiterSubscription } from "@/module/subscription/types/RecruiterSubscription.types";

interface BillingCardProps {
  subscription: RecruiterSubscription;
}

export default function BillingCard({ subscription }: BillingCardProps) {
  const endDate = subscription.endDate ? new Date(subscription.endDate) : null;

  const startDate = subscription.startDate
    ? new Date(subscription.startDate)
    : null;

  const daysUntilEnd = endDate
    ? Math.ceil((endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
      <div className="bg-linear-to-r from-blue-600 to-blue-700 px-6 py-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm font-medium mb-1">Plan Price</p>

            <h2 className="text-4xl font-bold text-white">
              ₹{subscription.planPrice.toLocaleString()}
            </h2>

            <p className="text-blue-100 text-sm mt-2">
              {subscription.planType}
            </p>
          </div>

          <CreditCard className="h-12 w-12 text-blue-200 opacity-50" />
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">
              Start Date
            </p>

            <p className="text-lg font-bold text-slate-900">
              {startDate
                ? startDate.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "—"}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">
              End Date
            </p>

            <p className="text-lg font-bold text-slate-900">
              {endDate
                ? endDate.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "—"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 p-3">
          <Wifi className="h-4 w-4 text-blue-600" />

          <span className="text-sm text-slate-700">
            Status:{" "}
            <span className="font-semibold text-blue-700">
              {subscription.status}
            </span>
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">Days remaining</span>

          <span className="text-lg font-bold text-blue-600">
            {daysUntilEnd} days
          </span>
        </div>

        <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-100 px-4 py-3 font-medium text-slate-700 transition-colors hover:bg-slate-200">
          <Download className="h-4 w-4" />
          Download Invoice
        </button>
      </div>
    </div>
  );
}
