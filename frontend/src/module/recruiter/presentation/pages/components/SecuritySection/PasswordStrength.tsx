"use client";

import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from "lucide-react";

interface PasswordValidation {
  length: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  special: boolean;
}

interface PasswordStrengthProps {
  validation: PasswordValidation;
  strength: {
    strength: "Weak" | "Fair" | "Good" | "Strong";
    color: string;
    bg: string;
    score: number;
  };
}

export function PasswordStrength({ validation, strength }: PasswordStrengthProps) {
  const requirements = [
    { key: 'length' as const, label: '8+ characters' },
    { key: 'uppercase' as const, label: 'Uppercase letter' },
    { key: 'lowercase' as const, label: 'Lowercase letter' },
    { key: 'number' as const, label: 'Number' },
    { key: 'special' as const, label: 'Special character' },
  ];

  return (
    <div className="p-5 bg-slate-50 rounded-xl border border-slate-200">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-slate-700">
          Password Strength
        </span>
        <Badge className={`${strength.color} bg-opacity-10 border-none`}>
          {strength.strength}
        </Badge>
      </div>
      
      {/* Progress Bar */}
      <div className="h-2 bg-slate-200 rounded-full overflow-hidden mb-4">
        <div
          className={`h-full ${strength.bg} transition-all duration-500`}
          style={{ width: `${strength.score}%` }}
        />
      </div>

      {/* Requirements List */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-slate-500 mb-2">
          Password must contain:
        </p>
        <div className="grid grid-cols-2 gap-2">
          {requirements.map(({ key, label }) => (
            <div key={key} className="flex items-center gap-2 text-sm">
              {validation[key] ? (
                <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
              ) : (
                <XCircle className="h-4 w-4 text-slate-300 shrink-0" />
              )}
              <span className={
                validation[key]
                  ? "text-emerald-600 text-xs"
                  : "text-slate-400 text-xs"
              }>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}