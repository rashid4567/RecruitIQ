"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { CreditCard, Crown, TrendingUp, Download, Star, Check } from "lucide-react"
import type { RecruiterProfileResponse } from "../../../types/recruiter/recruiter.profile.type"

interface BillingSectionProps {
  profile?: RecruiterProfileResponse | null
}

export function BillingSection({ profile }: BillingSectionProps) {
  const [billingHistory] = useState([
    { id: 1, date: "Jan 15, 2024", plan: "Free Plan", amount: "$0.00", status: "paid" },
    { id: 2, date: "Dec 15, 2023", plan: "Free Plan", amount: "$0.00", status: "paid" },
    { id: 3, date: "Nov 15, 2023", plan: "Free Plan", amount: "$0.00", status: "paid" },
  ])

  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "/month",
      description: "Perfect for getting started",
      features: [
        "Up to 5 job posts",
        "Basic analytics dashboard",
        "Email support",
        "100 applications/month",
        "Standard templates",
      ],
      current: profile?.subscriptionStatus === "free",
      linear: "from-blue-500 to-blue-600",
      buttonText: "Current Plan",
      buttonVariant: "outline" as const,
    },
    {
      name: "Professional",
      price: "$49",
      period: "/month",
      description: "For growing teams",
      features: [
        "Unlimited job posts",
        "Advanced analytics",
        "Priority support",
        "Unlimited applications",
        "AI-powered matching",
        "Custom branding",
        "Team collaboration",
      ],
      popular: true,
      current: profile?.subscriptionStatus === "active",
      linear: "from-emerald-500 to-emerald-600",
      buttonText: "Upgrade Now",
      buttonVariant: "default" as const,
    },
    {
      name: "Enterprise",
      price: "$199",
      period: "/month",
      description: "For large organizations",
      features: [
        "Everything in Professional",
        "Dedicated account manager",
        "Custom integrations",
        "SLA guarantee",
        "Advanced security",
        "Custom workflows",
        "Onboarding support",
      ],
      current: false,
      linear: "from-violet-500 to-violet-600",
      buttonText: "Contact Sales",
      buttonVariant: "outline" as const,
    },
  ]

  return (
    <div className="space-y-8">
      {/* Plans Comparison Card */}
      <Card className="border-slate-200/50 shadow-lg overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-emerald-500 to-emerald-600" />
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-linear-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <Crown className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-slate-900">Plans & Pricing</CardTitle>
              <CardDescription>Choose the perfect plan for your hiring needs</CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl border-2 p-6 transition-all duration-300 hover:scale-[1.02] ${
                  plan.current
                    ? "border-blue-300 bg-linear-to-br from-blue-50 to-blue-100/30"
                    : plan.popular
                    ? "border-emerald-300 bg-linear-to-br from-emerald-50 to-emerald-100/30"
                    : "border-slate-200 bg-white"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-linear-to-r from-emerald-500 to-emerald-600 text-white border-0 shadow-lg shadow-emerald-500/25 px-4 py-1">
                      <Star className="h-3 w-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center mb-2">
                    <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                    <span className="text-slate-500 ml-1">{plan.period}</span>
                  </div>
                  <p className="text-sm text-slate-500">{plan.description}</p>
                </div>

                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className={`h-5 w-5 rounded-full flex items-center justify-center ${
                        plan.current
                          ? "bg-linear-to-br from-blue-500 to-blue-600"
                          : plan.popular
                          ? "bg-linear-to-br from-emerald-500 to-emerald-600"
                          : "bg-slate-200"
                      }`}>
                        <Check className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-sm text-slate-700">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button
                  variant={plan.buttonVariant}
                  className={`w-full h-12 ${
                    plan.popular
                      ? "bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg shadow-emerald-500/25"
                      : plan.current
                      ? "border-blue-300 text-blue-600 hover:bg-blue-50"
                      : "border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {plan.buttonText}
                </Button>
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 rounded-xl bg-linear-to-r from-slate-50 to-slate-100/30 border border-slate-200/50">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-slate-900">Need a custom plan?</h4>
                <p className="text-sm text-slate-600">
                  Contact our sales team for enterprise solutions with custom features.
                </p>
              </div>
              <Button variant="outline" className="border-slate-200">
                Contact Sales
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Usage Card */}
      <Card className="border-slate-200/50 shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-slate-900">Current Usage</CardTitle>
              <CardDescription>Your current plan usage and limits</CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">Job Posts</span>
                  <span className="text-sm font-bold text-blue-600">{profile?.jobPostsUsed || 0}/5</span>
                </div>
                <Progress value={((profile?.jobPostsUsed || 0) / 5) * 100} className="h-2" />
              </div>
              <div className="text-sm text-slate-600">
                {5 - (profile?.jobPostsUsed || 0)} posts remaining
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">Applications</span>
                  <span className="text-sm font-bold text-emerald-600">24/100</span>
                </div>
                <Progress value={24} className="h-2 bg-emerald-100" />
              </div>
              <div className="text-sm text-slate-600">
                76 applications remaining this month
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">Team Members</span>
                  <span className="text-sm font-bold text-amber-600">1/1</span>
                </div>
                <Progress value={100} className="h-2 bg-amber-100" />
              </div>
              <div className="text-sm text-slate-600">
                Upgrade to add more team members
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">Storage</span>
                  <span className="text-sm font-bold text-violet-600">0.5/5 GB</span>
                </div>
                <Progress value={10} className="h-2 bg-violet-100" />
              </div>
              <div className="text-sm text-slate-600">
                4.5 GB storage available
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="pt-6 border-t border-slate-200">
          <div className="w-full space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-slate-900">Billing Cycle</h4>
                <p className="text-sm text-slate-500">Next billing date: Feb 15, 2024</p>
              </div>
              <Button variant="outline" className="border-slate-200">
                Change Billing Date
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>

      {/* Billing History Card */}
      <Card className="border-slate-200/50 shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-linear-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/25">
              <CreditCard className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-slate-900">Billing History</CardTitle>
              <CardDescription>View and download your past invoices</CardDescription>
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
                <div key={invoice.id} className="grid grid-cols-4 gap-4 p-4 hover:bg-slate-50/30 transition-colors">
                  <div className="text-sm text-slate-900">{invoice.date}</div>
                  <div className="text-sm text-slate-700">{invoice.plan}</div>
                  <div className="text-sm font-medium text-slate-900">{invoice.amount}</div>
                  <div>
                    <Badge className={
                      invoice.status === "paid"
                        ? "bg-linear-to-r from-emerald-500 to-emerald-600 text-white border-0"
                        : "bg-linear-to-r from-amber-500 to-amber-600 text-white border-0"
                    }>
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
                    <p className="text-sm font-medium text-blue-900">Visa ending in 4242</p>
                    <p className="text-xs text-blue-700">Expires 12/25</p>
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
                <h4 className="font-medium text-slate-900">Need help with billing?</h4>
                <p className="text-sm text-slate-500">Contact our support team for billing questions</p>
              </div>
              <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                Contact Support
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}