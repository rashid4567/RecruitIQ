import { useState } from "react";
import { ArrowLeft, Save, Send, Loader2, Clock, CheckCircle2, Mail, ChevronRight } from "lucide-react";
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
  const [justSaved, setJustSaved] = useState(false);

  async function handleSave() {
    onSave();
    if (!isSaving) {
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 2500);
    }
  }

  const canSendTest = !!formId && !!testEmail.trim() && cooldown === 0;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-sm shadow-slate-100">
      <div className="max-w-screen-2xl mx-auto px-6 py-0 flex items-stretch justify-between gap-4 min-h-[64px]">

        {/* ── Left: Back + breadcrumb ── */}
        <div className="flex items-center gap-0">
          <button
            onClick={onBack}
            className="flex items-center gap-2 group px-4 h-full border-r border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-200" />
            <span className="text-sm font-medium hidden sm:block">Back</span>
          </button>

          <div className="flex items-center gap-2 pl-5">
            {/* Breadcrumb */}
            <span className="text-xs text-slate-400 hidden md:flex items-center gap-1.5">
              Email Templates
              <ChevronRight className="w-3 h-3" />
            </span>
            <div>
              <h1 className="text-sm font-bold text-slate-900 leading-none">
                {isEdit ? "Edit Template" : "New Template"}
              </h1>
              <p className="text-[11px] text-slate-400 mt-0.5 hidden sm:block">
                {isEdit ? "Modify your existing email template" : "Build a dynamic email template"}
              </p>
            </div>

            {/* Mode pill */}
            <span className={cn(
              "hidden lg:flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full border",
              isEdit
                ? "bg-amber-50 text-amber-700 border-amber-200"
                : "bg-emerald-50 text-emerald-700 border-emerald-200"
            )}>
              <span className={cn(
                "w-1.5 h-1.5 rounded-full",
                isEdit ? "bg-amber-400" : "bg-emerald-400"
              )} />
              {isEdit ? "Editing" : "Creating"}
            </span>
          </div>
        </div>

        {/* ── Right: Test email + Save ── */}
        <div className="flex items-center gap-3">

          {/* Test email panel (edit mode only) */}
          {isEdit && (
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-1 pl-3 py-1">
              <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <Input
                placeholder="test@company.com"
                value={testEmail}
                onChange={(e) => onTestEmailChange(e.target.value)}
                className={cn(
                  "h-8 w-52 bg-transparent border-0 shadow-none focus-visible:ring-0 text-sm placeholder:text-slate-300",
                  "font-medium text-slate-700"
                )}
              />
              <button
                onClick={onSendTest}
                disabled={!canSendTest}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all",
                  canSendTest
                    ? "bg-slate-900 text-white hover:bg-slate-800 shadow-sm shadow-slate-900/20"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                )}
              >
                {cooldown > 0 ? (
                  <>
                    <Clock className="w-3 h-3" />
                    {cooldown}s
                  </>
                ) : (
                  <>
                    <Send className="w-3 h-3" />
                    Send test
                  </>
                )}
              </button>
            </div>
          )}

          {/* Divider */}
          {isEdit && <div className="w-px h-7 bg-slate-200" />}

          {/* Save button */}
          <button
            onClick={handleSave}
            disabled={!canSave || isSaving}
            className={cn(
              "relative flex items-center gap-2 px-5 h-10 rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm",
              !canSave || isSaving
                ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
                : justSaved
                ? "bg-emerald-600 text-white shadow-emerald-300/40 shadow-md"
                : "bg-slate-900 text-white hover:bg-slate-800 shadow-slate-900/25 hover:shadow-md hover:-translate-y-px active:translate-y-0"
            )}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving…</span>
              </>
            ) : justSaved ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save template</span>
              </>
            )}

            {/* Saving shimmer */}
            {isSaving && (
              <span className="absolute inset-0 rounded-xl overflow-hidden">
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_1.2s_infinite] -translate-x-full" />
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}