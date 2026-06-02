import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp } from "lucide-react";
import type { RecruiterSubscription } from "@/module/subscription/domain/entity/RecruiterSubscription.entity";
import type { PlanType } from "@/module/subscription/domain/constant/subscription.constants";
import { UsageMetricRow } from "./UsageMetricRow";

interface CurrentUsageCardProps {
  subscription: RecruiterSubscription | undefined;
  nextBillingDate: string;
  daysRemaining: number;
}

function isYearlyPlan(planType: PlanType | undefined): boolean {
  return planType === "yearly";
}

export function CurrentUsageCard({
  subscription,
  nextBillingDate,
  daysRemaining,
}: CurrentUsageCardProps) {
  return (
    <Card className="border-slate-200/50 shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-slate-900">Current Usage</CardTitle>
            <CardDescription>
              Your current plan usage and limits
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <UsageMetricRow
            label="Job Posts"
            used={subscription?.jobPostsUsed ?? 0}
            limit={subscription?.jobPostsLimit ?? 5}
            colorClass="text-blue-600"
            progressBgClass="bg-blue-100"
            unit="posts"
          />
          <UsageMetricRow
            label="Screening Credits"
            used={subscription?.screeningUsed ?? 0}
            limit={subscription?.screeningLimit ?? 0}
            colorClass="text-emerald-600"
            progressBgClass="bg-emerald-100"
            unit="credits"
          />
          <UsageMetricRow
            label="Resume Parsing"
            used={subscription?.resumeUsed ?? 0}
            limit={subscription?.resumeLimit ?? 0}
            colorClass="text-amber-600"
            progressBgClass="bg-amber-100"
            unit="parses"
          />
          <UsageMetricRow
            label="AI Scoring"
            used={subscription?.aiScoreUsed ?? 0}
            limit={subscription?.aiScoreLimit ?? 0}
            colorClass="text-violet-600"
            progressBgClass="bg-violet-100"
            unit="scores"
          />
        </div>
      </CardContent>

      <CardFooter className="pt-6 border-t border-slate-200">
        <div className="w-full space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-slate-900">Billing Cycle</h4>
              <p className="text-sm text-slate-500">
                {isYearlyPlan(subscription?.planType)
                  ? "Annual billing"
                  : "Monthly billing"}{" "}
                • Next billing date: {nextBillingDate}
                {daysRemaining > 0 && ` (${daysRemaining} days remaining)`}
              </p>
            </div>
            <Button variant="outline" className="border-slate-200">
              Change Billing Date
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}