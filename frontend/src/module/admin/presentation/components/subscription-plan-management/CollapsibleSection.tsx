import React, { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
  titleClassName?: string;
  contentClassName?: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  onToggle?: (isOpen: boolean) => void;
}

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  children,
  defaultOpen = true,
  className = "",
  titleClassName = "",
  contentClassName = "",
  icon,
  badge,
  onToggle,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggle = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    onToggle?.(newState);
  };

  return (
    <div
      className={`rounded-2xl border border-zinc-200 bg-white overflow-hidden ${className}`}
    >
      {/* Header */}
      <button
        onClick={toggle}
        className={`
          w-full flex items-center justify-between px-6 py-4
          hover:bg-zinc-50 transition-colors duration-150
          focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-inset
          ${titleClassName}
        `}
      >
        <div className="flex items-center gap-3">
          {/* Custom Icon or Default Chevron */}
          {icon ? (
            <div className="text-zinc-400">{icon}</div>
          ) : (
            <div className="text-zinc-400">
              {isOpen ? (
                <ChevronDown className="h-5 w-5" />
              ) : (
                <ChevronRight className="h-5 w-5" />
              )}
            </div>
          )}
          
          {/* Title */}
          <h3 className="font-semibold text-zinc-900">{title}</h3>
          
          {/* Badge */}
          {badge && <div className="ml-2">{badge}</div>}
        </div>

        {/* Optional: Additional indicator */}
        <div className="text-zinc-400">
          {isOpen ? (
            <ChevronDown className="h-5 w-5" />
          ) : (
            <ChevronRight className="h-5 w-5" />
          )}
        </div>
      </button>

      {/* Content */}
      <div
        className={`
          transition-all duration-200 ease-in-out
          ${isOpen ? "visible opacity-100" : "hidden opacity-0"}
        `}
      >
        <div className={`px-6 pb-6 ${contentClassName}`}>{children}</div>
      </div>
    </div>
  );
};

// Optional: Alternative Styling Variants
export const CollapsibleSectionCard: React.FC<CollapsibleSectionProps> = (props) => {
  return (
    <CollapsibleSection
      {...props}
      className="bg-white rounded-xl shadow-sm border border-zinc-100"
      titleClassName="border-b border-zinc-100"
    />
  );
};

export const CollapsibleSectionSimple: React.FC<CollapsibleSectionProps> = (props) => {
  return (
    <CollapsibleSection
      {...props}
      className="border-0 rounded-none bg-transparent"
      titleClassName="border-b border-zinc-100 bg-transparent px-0"
      contentClassName="px-0"
    />
  );
};