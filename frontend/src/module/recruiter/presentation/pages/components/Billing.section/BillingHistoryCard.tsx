import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Download } from "lucide-react";
import type { RecruiterSubscription } from "@/module/subscription/domain/entity/RecruiterSubscription.entity";

interface BillingRecord {
  id: number;
  date: string;
  plan: string;
  amount: string;
  status: "paid" | "pending";
}

interface BillingHistoryCardProps {
  billingHistory: BillingRecord[];
  subscription: RecruiterSubscription | undefined;
}

export function BillingHistoryCard({
  billingHistory,
  subscription,
}: BillingHistoryCardProps) {
  return (
    <Card className="border-slate-200/50 shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-linear-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/25">
            <CreditCard className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-slate-900">Billing History</CardTitle>
            <CardDescription>
              View and download your past invoices
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="rounded-xl border border-slate-200/50 overflow-hidden">
          <div className="grid grid-cols-4 gap-4 p-4 bg-slate-50/50 border-b border-slate-200/50">
            <div className="text-sm font-medium text-slate-700">Date</div>
            <div className="text-sm font-medium text-slate-700">Plan</div>
            <div className="text-sm font-medium text-slate-700">Amount</div>
            <div className="text-sm font-medium text-slate-700">Status</div>
          </div>

          <div className="divide-y divide-slate-200/50">
            {billingHistory.map((invoice) => (
              <div
                key={invoice.id}
                className="grid grid-cols-4 gap-4 p-4 hover:bg-slate-50/30 transition-colors"
              >
                <div className="text-sm text-slate-900">{invoice.date}</div>
                <div className="text-sm text-slate-700">{invoice.plan}</div>
                <div className="text-sm font-medium text-slate-900">
                  {invoice.amount}
                </div>
                <div>
                  <Badge
                    className={
                      invoice.status === "paid"
                        ? "bg-linear-to-r from-emerald-500 to-emerald-600 text-white border-0"
                        : "bg-linear-to-r from-amber-500 to-amber-600 text-white border-0"
                    }
                  >
                    {invoice.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 p-6 rounded-xl bg-linear-to-r from-blue-50 to-blue-100/30 border border-blue-200/50">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="font-semibold text-blue-900">Payment Method</h4>
              <div className="flex items-center gap-3">
                <div className="h-10 w-16 rounded-lg bg-linear-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    {subscription?.paymentReferenceId
                      ? `Payment ID: ${subscription.paymentReferenceId.slice(-4)}`
                      : "No payment method on file"}
                  </p>
                  <p className="text-xs text-blue-700">
                    {subscription?.autoRenew
                      ? "Auto-renewal enabled"
                      : "Manual renewal"}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="border-slate-200">
                Update Card
              </Button>
              <Button variant="outline" className="border-slate-200">
                <Download className="h-4 w-4 mr-2" />
                All Invoices
              </Button>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-6 border-t border-slate-200">
        <div className="w-full space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-slate-900">
                Need help with billing?
              </h4>
              <p className="text-sm text-slate-500">
                Contact our support team for billing questions
              </p>
            </div>
            <Button
              variant="outline"
              className="border-blue-200 text-blue-600 hover:bg-blue-50"
            >
              Contact Support
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}