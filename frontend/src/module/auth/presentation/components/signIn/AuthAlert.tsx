"use client";

import { X, Check } from "lucide-react";

interface AuthAlertProps {
  error: string;
  success: string;
  onClose: () => void;
}

export function AuthAlert({ error, success, onClose }: AuthAlertProps) {
  if (!error && !success) return null;

  if (error) {
    return (
      <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 animate-fade-in">
        <div className="p-1.5 bg-red-100 rounded-lg">
          <X className="w-5 h-5 text-red-600" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-red-800">Sign In Failed</p>
          <p className="text-sm text-red-600 mt-1">{error}</p>
        </div>
        <button onClick={onClose} className="text-red-400 hover:text-red-600">
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3 animate-fade-in">
      <div className="p-1.5 bg-green-100 rounded-lg">
        <Check className="w-5 h-5 text-green-600" />
      </div>
      <div className="flex-1">
        <p className="font-semibold text-green-800">Success!</p>
        <p className="text-sm text-green-600 mt-1">{success}</p>
      </div>
    </div>
  );
}