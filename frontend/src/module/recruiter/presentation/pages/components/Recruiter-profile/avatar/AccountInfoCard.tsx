import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Mail, 
  ChevronRight, 
  FileText, 
  Sparkles 
} from "lucide-react";

interface AccountInfoCardProps {
  email: string;
  jobPostsUsed?: number;
  subscriptionStatus?: string;
  onEmailUpdateClick: () => void;
}

export function AccountInfoCard({ 
  email, 
  jobPostsUsed = 0, 
  subscriptionStatus = 'free',
  onEmailUpdateClick 
}: AccountInfoCardProps) {
  const formatSubscriptionStatus = (status?: string) => {
    if (!status) return "Free";
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  return (
    <Card className="border-slate-200/50 shadow-sm">
      <CardContent className="p-6">
        <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5 text-emerald-500" />
          Account Information
        </h4>
        
        <div className="space-y-4">
          {/* Email Card */}
          <div
            onClick={onEmailUpdateClick}
            className="group cursor-pointer p-4 rounded-xl border border-slate-200 hover:border-blue-200 hover:bg-blue-50/30 transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <Mail className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900 text-sm">Email Address</p>
                  <p className="text-xs text-slate-500 truncate max-w-45" title={email}>
                    {email}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs border-blue-200">Update</Badge>
                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <FileText className="h-4 w-4 text-emerald-600" />
                </div>
                <span className="text-xs text-slate-500">Used</span>
              </div>
              <p className="text-lg font-semibold text-slate-900">{jobPostsUsed ?? 0}</p>
              <p className="text-xs text-slate-500">Job posts</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-purple-600" />
                </div>
                <span className="text-xs text-slate-500">Plan</span>
              </div>
              <p className="text-lg font-semibold text-slate-900 capitalize">
                {formatSubscriptionStatus(subscriptionStatus)}
              </p>
              <p className="text-xs text-slate-500">Subscription</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}