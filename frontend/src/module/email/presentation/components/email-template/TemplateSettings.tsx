import { Settings2, Lock, Zap, AtSign } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { EmailTemplateForm } from "../../validaton/emailTemplate.schema";

interface TemplateSettingsProps {
  form: EmailTemplateForm;
  setForm: React.Dispatch<React.SetStateAction<EmailTemplateForm>>;
  isEdit: boolean;
  events: Array<{ value: string; label: string }>;
}

interface FieldWrapperProps {
  label: string;
  required?: boolean;
  locked?: boolean;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}

function FieldWrapper({ label, required, locked, hint, children, className }: FieldWrapperProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-600 uppercase tracking-widest flex items-center gap-1.5">
          {label}
          {required && <span className="text-rose-400 text-sm leading-none">*</span>}
        </label>
        {locked && (
          <span className="flex items-center gap-1 text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
            <Lock className="w-2.5 h-2.5" />
            Locked
          </span>
        )}
      </div>
      {children}
      {hint && (
        <p className="text-[11px] text-slate-400 italic">{hint}</p>
      )}
    </div>
  );
}

export function TemplateSettings({ form, setForm, isEdit, events }: TemplateSettingsProps) {
  return (
    <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-lg shadow-slate-200/50">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
        <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center shadow-sm">
          <Settings2 className="w-4 h-4 text-white" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-slate-900 leading-none">Template Settings</h2>
          <p className="text-[11px] text-slate-400 mt-0.5">Name, trigger event & subject line</p>
        </div>
      </div>

      {/* Fields */}
      <div className="p-6 grid md:grid-cols-2 gap-6">
        {/* Template Name */}
        <FieldWrapper
          label="Template Name"
          required
          locked={isEdit}
          hint={isEdit ? "Template name cannot be changed after creation." : undefined}
        >
          <div className="relative">
            <Input
              placeholder="e.g. Interview Invitation – Technical Round"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              disabled={isEdit}
              className={cn(
                "h-11 pr-10 text-sm font-medium placeholder:font-normal placeholder:text-slate-300",
                "border-slate-200 focus-visible:ring-1 focus-visible:ring-slate-900 focus-visible:border-slate-900",
                isEdit && "bg-slate-50 text-slate-500 cursor-not-allowed"
              )}
            />
            {isEdit && (
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300" />
            )}
          </div>
        </FieldWrapper>

        {/* Trigger Event */}
        <FieldWrapper
          label="Trigger Event"
          required
          locked={isEdit}
          hint={isEdit ? "Event type is fixed after creation." : undefined}
        >
          <div className="relative">
            <Select
              value={form.event}
              onValueChange={(v) => setForm((p) => ({ ...p, event: v }))}
              disabled={isEdit}
            >
              <SelectTrigger
                className={cn(
                  "h-11 text-sm font-medium",
                  "border-slate-200 focus:ring-1 focus:ring-slate-900 focus:border-slate-900",
                  isEdit && "bg-slate-50 text-slate-500 cursor-not-allowed",
                  !form.event && "text-slate-300"
                )}
              >
                <div className="flex items-center gap-2">
                  <Zap className={cn("w-3.5 h-3.5 flex-shrink-0", form.event ? "text-amber-500" : "text-slate-300")} />
                  <SelectValue placeholder="Choose when this email is sent" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {events.map((ev) => (
                  <SelectItem key={ev.value} value={ev.value} className="text-sm">
                    <div className="flex items-center gap-2">
                      <Zap className="w-3 h-3 text-amber-400" />
                      {ev.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </FieldWrapper>

        {/* Subject Line — full width */}
        <FieldWrapper
          label="Subject Line"
          required
          className="md:col-span-2"
        >
          <div className="relative">
            <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
            <Input
              placeholder='e.g. Your interview with {{companyName}} is confirmed!'
              value={form.subject}
              onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
              className={cn(
                "h-11 pl-9 text-sm font-medium placeholder:font-normal placeholder:text-slate-300",
                "border-slate-200 focus-visible:ring-1 focus-visible:ring-slate-900 focus-visible:border-slate-900"
              )}
            />
            {/* Live variable highlight count */}
            {form.subject?.match(/\{\{[^}]+\}\}/g)?.length ? (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono bg-indigo-50 text-indigo-600 border border-indigo-200 px-1.5 py-0.5 rounded-full">
                {form.subject.match(/\{\{[^}]+\}\}/g)!.length} var{form.subject.match(/\{\{[^}]+\}\}/g)!.length > 1 ? "s" : ""}
              </span>
            ) : null}
          </div>
          <p className="text-[11px] text-slate-400">
            Use <code className="font-mono bg-slate-100 px-1 rounded text-slate-600 text-[10px]">{"{{variable}}"}</code> syntax for personalization
          </p>
        </FieldWrapper>
      </div>

      {/* Footer stripe */}
      {isEdit && (
        <div className="px-6 py-3 bg-amber-50/60 border-t border-amber-100 flex items-center gap-2">
          <Lock className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
          <p className="text-[11px] text-amber-700">
            Some fields are locked because this template has already been used.
          </p>
        </div>
      )}
    </div>
  );
}