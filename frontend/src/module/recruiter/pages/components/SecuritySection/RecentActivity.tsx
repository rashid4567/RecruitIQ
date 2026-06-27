"use client";

import { Badge } from "@/components/ui/badge";
import { History, Smartphone, Fingerprint } from "lucide-react";

interface RecentActivityProps {
  lastPasswordChange?: string;
  is2FAEnabled?: boolean;
}

export function RecentActivity({ 
  lastPasswordChange = "28 days ago", 
  is2FAEnabled = false 
}: RecentActivityProps) {
  return (
    <div className="mt-8 p-5 bg-slate-50 rounded-xl border border-slate-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
          <History className="h-4 w-4 text-blue-600" />
        </div>
        <h4 className="text-sm font-semibold text-slate-900">
          Recent Security Activity
        </h4>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-3">
            <Smartphone className="h-4 w-4 text-slate-400" />
            <span className="text-slate-600">Last password change</span>
          </div>
          <span className="text-slate-900 font-medium">{lastPasswordChange}</span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-3">
            <Fingerprint className="h-4 w-4 text-slate-400" />
            <span className="text-slate-600">Two-factor authentication</span>
          </div>
          <Badge 
            variant="outline" 
            className={is2FAEnabled 
              ? "text-emerald-600 border-emerald-200 bg-emerald-50"
              : "text-amber-600 border-amber-200 bg-amber-50"
            }
          >
            {is2FAEnabled ? "Enabled" : "Not enabled"}
          </Badge>
        </div>
      </div>
    </div>
  );
}