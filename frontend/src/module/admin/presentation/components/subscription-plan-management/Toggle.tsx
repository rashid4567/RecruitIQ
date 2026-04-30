"use client";

import React from "react";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  label?: string;
  description?: string;
}

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  disabled = false,
  size = "md",
  label,
  description,
}) => {
  const sizeClasses = {
    sm: {
      toggle: "w-8 h-4",
      dot: "h-3 w-3",
      translate: "translate-x-4",
    },
    md: {
      toggle: "w-11 h-6",
      dot: "h-5 w-5",
      translate: "translate-x-5",
    },
    lg: {
      toggle: "w-14 h-7",
      dot: "h-6 w-6",
      translate: "translate-x-7",
    },
  };

  const currentSize = sizeClasses[size];

  return (
    <div className="flex items-center justify-between">
      {(label || description) && (
        <div>
          {label && (
            <span className="block text-sm font-medium text-zinc-700">
              {label}
            </span>
          )}
          {description && (
            <span className="block text-xs text-zinc-500">{description}</span>
          )}
        </div>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`
          relative inline-flex shrink-0 cursor-pointer rounded-full
          border-2 border-transparent transition-colors duration-200 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
          ${checked ? "bg-indigo-600" : "bg-zinc-200"}
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          ${currentSize.toggle}
        `}
      >
        <span
          className={`
            pointer-events-none inline-block transform rounded-full
            bg-white shadow-lg ring-0 transition duration-200 ease-in-out
            ${checked ? currentSize.translate : "translate-x-0"}
            ${currentSize.dot}
          `}
        />
      </button>
    </div>
  );
};