"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { useParams } from "react-router-dom";

import Sidebar from "@/components/admin/sideBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Save, Send, ArrowLeft, AlertCircle } from "lucide-react";

import {
  CreateEmailTemplateUC,
  UpdateEmailTemplateUC,
  GetEmailTemplateUC,
  sendTestEmailUC,
} from "../di/email-template.di";

/* ---------------- EVENTS ---------------- */
const EMAIL_EVENTS = [
  { value: "ACCOUNT_CREATED", label: "Account Created" },
  { value: "JOB_APPLIED", label: "Job Applied" },
  { value: "INTERVIEW_SCHEDULED", label: "Interview Scheduled" },
  { value: "SELECTED", label: "Candidate Selected" },
  { value: "REJECTED", label: "Candidate Rejected" },
  { value: "SUBSCRIPTION_EXPIRING", label: "Subscription Expiring" },
  { value: "SUBSCRIPTION_EXPIRED", label: "Subscription Expired" },
];

/* ---------------- VARIABLES ---------------- */
const VARIABLES = [
  "candidateName",
  "jobTitle",
  "companyName",
  "interviewDate",
  "interviewTime",
  "interviewLink",
  "recruiterName",
];

/* ---------------- SAMPLE DATA ---------------- */
const SAMPLE_DATA: Record<string, string> = {
  candidateName: "Aisha Sharma",
  jobTitle: "Senior Product Designer",
  companyName: "GrowEasy",
  interviewDate: "18 March 2026",
  interviewTime: "3:00 PM IST",
  interviewLink: "https://meet.google.com/xyz-abcd-efgh",
  recruiterName: "Rahul Menon",
};

export default function EmailTemplateEditor() {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [form, setForm] = useState({
    id: "",
    name: "",
    event: "",
    subject: "",
    body: "",
  });

  const [testEmail, setTestEmail] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isEdit) return;

    (async () => {
      try {
        const list = await GetEmailTemplateUC.execute();
        const found = list.find((t) => t.getId() === id);
        if (found) {
          setForm({
            id: found.getId(),
            name: found.getName(),
            event: found.getEvent(),
            subject: found.getSubject(),
            body: found.getBody(),
          });
        }
      } catch {
        toast.error("Failed to load template");
      }
    })();
  }, [id, isEdit]);

  const insertVariable = (variable: string) => {
    const ta = textareaRef.current;
    if (!ta) return;

    const start = ta.selectionStart ?? 0;
    const end = ta.selectionEnd ?? start;

    const newValue =
      form.body.slice(0, start) +
      `{{${variable}}}` +
      form.body.slice(end);

    setForm((prev) => ({ ...prev, body: newValue }));

    // Restore cursor position
    setTimeout(() => {
      ta.focus();
      const pos = start + variable.length + 4;
      ta.setSelectionRange(pos, pos);
    }, 0);
  };

  const renderPreview = () => {
    let html = (form.body || "").replace(/\n/g, "<br>");
    Object.entries(SAMPLE_DATA).forEach(([key, value]) => {
      html = html.replace(new RegExp(`{{${key}}}`, "g"), value);
    });
    return html || '<p class="text-gray-400 italic">Preview will appear here...</p>';
  };

  const canSave = form.name.trim() && form.event && form.subject.trim() && form.body.trim();

  const handleSave = async () => {
    if (!canSave) {
      toast.error("Please fill all required fields");
      return;
    }

    setShowConfirm(false);
    setIsSaving(true);

    try {
      if (isEdit) {
        await UpdateEmailTemplateUC.execute(form.id, {
          subject: form.subject,
          body: form.body,
        });
      } else {
        const created = await CreateEmailTemplateUC.execute(form);
        setForm((prev) => ({ ...prev, id: created.getId() }));
      }
      toast.success("Template saved successfully");
    } catch (err) {
      toast.error("Failed to save template");
    } finally {
      setIsSaving(false);
    }
  };

  const handleTest = async () => {
    if (!form.id) {
      toast.error("Please save the template first");
      return;
    }
    if (!testEmail.trim() || !testEmail.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      await sendTestEmailUC.execute(form.id, testEmail.trim());
      toast.success("Test email sent!");
    } catch {
      toast.error("Failed to send test email");
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b px-8 py-5 flex items-center justify-between shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEdit ? "Edit Email Template" : "Create Email Template"}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Design professional automated emails for candidates and users
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 md:p-8 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-8">

            {/* Basic Info */}
            <Card className="shadow-md border-gray-200">
              <CardHeader className="pb-4">
                <CardTitle>Template Information</CardTitle>
                <CardDescription>
                  Basic settings — name, trigger event and subject line
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Template Name *</Label>
                  <Input
                    placeholder="e.g. Interview Confirmation – Developer Role"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Trigger Event *</Label>
                  <Select
                    value={form.event}
                    onValueChange={(v) => setForm({ ...form, event: v })}
                    disabled={isEdit}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select when this email is sent" />
                    </SelectTrigger>
                    <SelectContent>
                      {EMAIL_EVENTS.map((event) => (
                        <SelectItem key={event.value} value={event.value}>
                          {event.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-1">
                  <Label>Email Subject *</Label>
                  <Input
                    placeholder="e.g. Your interview with {{companyName}} is confirmed!"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Editor + Variables + Preview */}
            <div className="grid lg:grid-cols-12 gap-6">

              {/* Variables */}
              <Card className="lg:col-span-3 shadow-md border-gray-200 h-fit lg:sticky lg:top-6">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Variables</CardTitle>
                  <CardDescription>Click to insert</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {VARIABLES.map((v) => (
                      <Badge
                        key={v}
                        variant="secondary"
                        className="cursor-pointer hover:bg-indigo-100 hover:text-indigo-800 transition px-3 py-1.5 text-sm"
                        onClick={() => insertVariable(v)}
                      >
                        {`{{${v}}}`}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Editor & Preview */}
              <div className="lg:col-span-9 space-y-6">

                {/* Editor */}
                <Card className="shadow-md border-gray-200">
                  <CardHeader className="pb-3">
                    <CardTitle>Email Body</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      ref={textareaRef}
                      value={form.body}
                      onChange={(e) => setForm({ ...form, body: e.target.value })}
                      placeholder="Dear {{candidateName}},\n\nWe are excited to invite you..."
                      rows={18}
                      className="min-h-[380px] font-mono text-sm resize-y shadow-inner"
                    />
                  </CardContent>
                </Card>

                {/* Preview */}
                <Card className="shadow-md border-gray-200 overflow-hidden">
                  <CardHeader className="bg-gray-50 border-b">
                    <CardTitle className="text-lg">Live Preview</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div
                      className="prose prose-sm sm:prose max-w-none p-8 bg-white min-h-[420px]"
                      dangerouslySetInnerHTML={{ __html: renderPreview() }}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Action Bar */}
        <div className="border-t bg-white px-6 md:px-8 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-[0_-2px_10px_rgba(0,0,0,0.07)]">
          <div className="flex items-center gap-4 flex-1">
            <Input
              placeholder="Send test to (your@email.com)"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              className="max-w-xs"
            />
            <Button
              variant="outline"
              onClick={handleTest}
              disabled={!form.id || !testEmail.trim()}
              className="gap-2"
            >
              <Send className="h-4 w-4" />
              Send Test
            </Button>
          </div>

          <Button
            size="lg"
            onClick={() => setShowConfirm(true)}
            disabled={!canSave || isSaving}
            className="gap-2 bg-indigo-600 hover:bg-indigo-700 min-w-[160px]"
          >
            <Save className="h-4 w-4" />
            {isSaving ? "Saving..." : "Save Template"}
          </Button>
        </div>
      </div>

      {/* Save Confirmation Dialog */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              Save Template?
            </DialogTitle>
            <DialogDescription>
              {isEdit
                ? "This will update the existing template."
                : "This will create a new email template."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-3 sm:gap-0">
            <Button variant="outline" onClick={() => setShowConfirm(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {isSaving ? "Saving..." : "Confirm & Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}