import { Mail, Plus, Sparkles } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface Variable {
  name: string;
  description: string;
}

interface VariablesSidebarProps {
  variables: Variable[];
  onInsertVariable: (variable: string) => void;
}

export function VariablesSidebar({ variables, onInsertVariable }: VariablesSidebarProps) {
  return (
    <Card className="border-slate-200/80 shadow-sm sticky top-24 bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl">
          <Mail className="h-5 w-5 text-indigo-600" />
          Variables
        </CardTitle>
        <CardDescription>
          Click to insert at cursor position
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {variables.map((v) => (
          <Tooltip key={v.name}>
            <TooltipTrigger asChild>
              <button
                onClick={() => onInsertVariable(v.name)}
                className={cn(
                  "w-full text-left p-3.5 rounded-xl border transition-all group",
                  "hover:border-indigo-300/70 hover:bg-indigo-50/40 hover:shadow-sm",
                  "active:scale-[0.98]"
                )}
              >
                <div className="flex items-center justify-between">
                  <code className="text-sm font-mono text-indigo-700 bg-indigo-50/70 px-2.5 py-1 rounded-md">
                    {"{{" + v.name + "}}"}
                  </code>
                  <Plus className="h-4.5 w-4.5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                </div>
                <p className="mt-1.5 text-xs text-slate-500 line-clamp-1">
                  {v.description}
                </p>
              </button>
            </TooltipTrigger>
            <TooltipContent side="left" className="max-w-64">
              <p className="text-sm font-medium">{v.description}</p>
            </TooltipContent>
          </Tooltip>
        ))}

        <Separator className="my-6" />

        <div className="p-4 bg-linear-to-br from-blue-50/70 to-indigo-50/40 rounded-xl border border-blue-100/60">
          <h4 className="text-sm font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Pro Tip
          </h4>
          <p className="text-xs leading-relaxed text-blue-800/90">
            Place cursor exactly where you want the variable → click any chip above.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}