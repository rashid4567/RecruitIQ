"use client";

import { Shield, Check, Clock, Fingerprint, History } from "lucide-react";

export function SecurityTips() {
  return (
    <div className="p-5 bg-linear-to-br from-indigo-50/50 to-purple-50/50 rounded-xl border border-indigo-100">
      <h4 className="text-sm font-semibold text-indigo-900 flex items-center gap-2 mb-3">
        <Shield className="h-4 w-4" />
        Security Tips
      </h4>
      <ul className="space-y-2 text-xs text-indigo-700">
        <li className="flex items-start gap-2">
          <Check className="h-3.5 w-3.5 mt-0.5 shrink-0" />
          <span>Use a unique password you don't use elsewhere</span>
        </li>
        <li className="flex items-start gap-2">
          <Clock className="h-3.5 w-3.5 mt-0.5 shrink-0" />
          <span>Change password every 90 days</span>
        </li>
        <li className="flex items-start gap-2">
          <Fingerprint className="h-3.5 w-3.5 mt-0.5 shrink-0" />
          <span>Enable 2FA for additional security</span>
        </li>
        <li className="flex items-start gap-2">
          <History className="h-3.5 w-3.5 mt-0.5 shrink-0" />
          <span>Don't reuse old passwords</span>
        </li>
      </ul>
    </div>
  );
}