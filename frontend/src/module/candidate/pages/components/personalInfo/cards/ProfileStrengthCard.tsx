import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

interface ProfileStrengthCardProps {
  completionPercentage: number;
  completionMessage: string;
}

export function ProfileStrengthCard({
  completionPercentage,
  completionMessage,
}: ProfileStrengthCardProps) {
  return (
    <Card className="border border-slate-200/60 bg-white/50 backdrop-blur-sm">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-4 w-4 text-amber-500" />
          <span className="text-sm font-medium text-slate-700">
            Profile Strength
          </span>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Completion</span>
            <span className="font-semibold text-slate-900">
              {completionPercentage}%
            </span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-blue-500 to-indigo-500 transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 mt-2">{completionMessage}</p>
        </div>
      </CardContent>
    </Card>
  );
}
