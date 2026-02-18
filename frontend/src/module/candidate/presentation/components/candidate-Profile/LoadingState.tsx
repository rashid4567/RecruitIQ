"use client";

import { Loader2 } from "lucide-react";

export function LoadingState() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50/30 flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="relative">
          <div className="h-20 w-20 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin"></div>
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 absolute inset-0 m-auto" />
        </div>
        <div className="space-y-2">
          <p className="text-gray-700 font-medium">Loading your profile...</p>
          <p className="text-sm text-gray-500">
            This will just take a moment
          </p>
        </div>
      </div>
    </div>
  );
}