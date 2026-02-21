"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Lock, Key, ShieldCheck, AlertCircle } from "lucide-react";

interface PasswordFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  error?: string;
  touched?: boolean;
  disabled?: boolean;
  required?: boolean;
  icon?: "lock" | "key" | "shield";
}

const iconMap = {
  lock: Lock,
  key: Key,
  shield: ShieldCheck,
};

export function PasswordField({
  id,
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  touched,
  disabled,
  required,
  icon = "lock",
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const Icon = iconMap[icon];

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-medium text-slate-700 flex items-center justify-between">
        <span>
          {label} {required && <span className="text-red-500">*</span>}
        </span>
        {touched && error && (
          <span className="text-xs text-red-500 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {error}
          </span>
        )}
      </Label>
      
      <div className="relative group">
        <Input
          id={id}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          className={`h-12 pl-11 pr-11 text-base transition-all ${
            touched && error
              ? "border-red-300 focus-visible:ring-red-500/20"
              : "border-slate-200 focus-visible:ring-rose-500/20"
          }`}
          placeholder={placeholder}
          disabled={disabled}
        />
        
        <Icon className="absolute left-3 top-3.5 h-5 w-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
        
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 h-8 w-8 hover:bg-slate-100"
          onClick={() => setShowPassword(!showPassword)}
          disabled={disabled}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4 text-slate-500" />
          ) : (
            <Eye className="h-4 w-4 text-slate-500" />
          )}
        </Button>
      </div>
    </div>
  );
}