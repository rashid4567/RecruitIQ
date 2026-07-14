import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Crown } from "lucide-react";
import type { SubscriptionPlan } from "@/module/subscription/types/subscription-plan.types";
import { PlanCard } from "./PlanCard";

interface PlansComparisonCardProps {
  plans: SubscriptionPlan[];
  currentPlanName: string | undefined;
  onUpgrade: (planId: string) => void;
}

export function PlansComparisonCard({
  plans,
  currentPlanName,
  onUpgrade,
}: PlansComparisonCardProps) {
  return (
    <Card className="border-slate-200/50 shadow-lg overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-emerald-500 to-emerald-600" />
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-linear-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
            <Crown className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-slate-900">Plans & Pricing</CardTitle>
            <CardDescription>
              Choose the perfect plan for your hiring needs
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isCurrentPlan={currentPlanName === plan.name}
              onUpgrade={onUpgrade}
            />
          ))}
        </div>

        <div className="mt-8 p-6 rounded-xl bg-linear-to-r from-slate-50 to-slate-100/30 border border-slate-200/50">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-slate-900">
                Need a custom plan?
              </h4>
              <p className="text-sm text-slate-600">
                Contact our sales team for enterprise solutions with custom
                features.
              </p>
            </div>
            <Button variant="outline" className="border-slate-200">
              Contact Sales
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}