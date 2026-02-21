import { Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { EmailTemplateForm } from "../../validaton/emailTemplate.schema"; 

interface TemplateSettingsProps {
  form: EmailTemplateForm;
  setForm: React.Dispatch<React.SetStateAction<EmailTemplateForm>>;
  isEdit: boolean;
  events: Array<{ value: string; label: string }>;
}

export function TemplateSettings({ form, setForm, isEdit, events }: TemplateSettingsProps) {
  return (
    <Card className="border-slate-200/80 shadow-sm bg-white/70 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl">
          <Sparkles className="h-5 w-5 text-indigo-600" />
          Template Settings
        </CardTitle>
        <CardDescription>
          Define name, trigger event and default subject line
        </CardDescription>
      </CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
            Template Name <span className="text-rose-500 text-base">*</span>
          </label>
          <Input
            placeholder="e.g. Interview Invitation – Technical Round"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            disabled={isEdit}
            className="h-11"
          />
          {isEdit && (
            <p className="text-xs text-slate-500 italic">
              Name is immutable after creation
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
            Trigger Event <span className="text-rose-500 text-base">*</span>
          </label>
          <Select
            value={form.event}
            onValueChange={(v) => setForm((p) => ({ ...p, event: v }))}
            disabled={isEdit}
          >
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Choose when this email is sent" />
            </SelectTrigger>
            <SelectContent>
              {events.map((ev) => (
                <SelectItem key={ev.value} value={ev.value}>
                  {ev.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {isEdit && (
            <p className="text-xs text-slate-500 italic">
              Event type is fixed after creation
            </p>
          )}
        </div>

        <div className="md:col-span-2 space-y-2">
          <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
            Subject Line <span className="text-rose-500 text-base">*</span>
          </label>
          <Input
            placeholder="e.g. Your interview with {{companyName}} is confirmed!"
            value={form.subject}
            onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
            className="h-11"
          />
        </div>
      </CardContent>
    </Card>
  );
}