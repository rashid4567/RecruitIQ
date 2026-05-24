import { ArrowLeft, Save, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface TemplateHeaderProps {
  isEdit: boolean;
  isSaving: boolean;
  canSave: boolean;
  testEmail: string;
  formId: string;
  cooldown: number;
  onTestEmailChange: (value: string) => void;
  onSendTest: () => void;
  onSave: () => void;
  onBack: () => void;
}

export function TemplateHeader({
  isEdit,
  isSaving,
  canSave,
  testEmail,
  formId,
  cooldown,
  onTestEmailChange,
  onSendTest,
  onSave,
  onBack,
}: TemplateHeaderProps) {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 px-6 py-3.5 shadow-sm">
      <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-5">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="rounded-full hover:bg-indigo-50/70"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {isEdit ? "Edit Email Template" : "Create Email Template"}
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Craft beautiful, dynamic emails with variables
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {isEdit && (
            <div className="flex items-center gap-3 bg-slate-50/80 px-4 py-1.5 rounded-full border border-slate-200">
              <Input
                placeholder="test@company.com"
                value={testEmail}
                onChange={(e) => onTestEmailChange(e.target.value)}
                className="h-9 w-64 bg-white border-0 focus-visible:ring-1"
              />
              <Button
                variant="secondary"
                size="sm"
                onClick={onSendTest}
                disabled={!formId || !testEmail.trim() || cooldown > 0}
                className="gap-2 whitespace-nowrap"
              >
                <Send className="h-4 w-4" />
                {cooldown > 0 ? `Wait ${cooldown}s to send next` : "Send Test"}
              </Button>
            </div>
          )}

          <Button
            onClick={onSave}
            disabled={!canSave || isSaving}
            className={cn(
              "min-w-35 gap-2 shadow-md transition-all",
              isSaving
                ? "bg-indigo-700"
                : "bg-linear-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800",
            )}
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Template
              </>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
