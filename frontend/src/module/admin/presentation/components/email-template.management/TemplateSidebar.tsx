import { Mail, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { label: "All Templates", icon: Mail, value: "all" },
  { label: "Application Status", icon: Send, value: "application_status" },
  { label: "Interview Related", icon: Send, value: "interview_related" },
  { label: "Account Related", icon: Send, value: "account_related" },
  { label: "Subscription Related", icon: Send, value: "subscription_related" },
];

interface TemplateSidebarProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export function TemplateSidebar({ activeCategory, onCategoryChange }: TemplateSidebarProps) {
  return (
    <Card className="border-slate-200/70 shadow-sm sticky top-20">
      <CardHeader className="pb-3 border-b">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          Categories
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => onCategoryChange(cat.value)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
                activeCategory === cat.value
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-700 hover:bg-indigo-50/60 hover:text-indigo-700"
              )}
            >
              <cat.icon className="h-4 w-4" />
              {cat.label}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}