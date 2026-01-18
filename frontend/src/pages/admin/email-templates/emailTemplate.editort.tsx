"use client";

import { useState, useEffect } from "react";
import {
  LogOut,
  Settings,
  Mail,
  FileText,
  Users,
  UserCheck,
  BarChart3,
  LogIn,
  Grid3x3,
  Bold,
  Italic,
  List,
  Link,
  Plus,
  Eye,
  Download,
  RotateCcw,
  Copy,
  Send,
  ChevronRight,
  ArrowLeft,
  Save,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate, useParams } from "react-router-dom";
import { emailTemplateService } from "../../../services/admin/admin.emailTemplate.service";
import type {
  EmailTemplate,
  createEmailTemplatePayload,
  UpdateEmailTemplatePayload,
  ToggleEmailInputPayload,
} from "../../../types/admin/email-template.types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-hot-toast";

export default function EmailTemplateEditor() {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  const [template, setTemplate] = useState<EmailTemplate>({
    id: "",
    name: "",
    event: "JOB_APPLIED",
    subject: "",
    body: "",
    isActive: true,
    createdAt: new Date().toISOString(),
  });

  const [companySignature, setCompanySignature] = useState(
    "Best regards, The RecruitFlow Team"
  );
  const [socialLinks, setSocialLinks] = useState(
    "https://linkedin.com/company/recruitflow"
  );
  const [unsubscribeLink, setUnsubscribeLink] = useState(
    "https://recruitflow.com/unsubscribe?user_id=123"
  );
  const [testEmail, setTestEmail] = useState("");
  const [showVariablesDropdown, setShowVariablesDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSaving, setIsSaving] = useState(false);
  const [isSendingTest, setIsSendingTest] = useState(false);

  const navigate = useNavigate();

  const events = [
    { value: "JOB_APPLIED", label: "Job Applied" },
    { value: "INTERVIEW_SCHEDULED", label: "Interview Scheduled" },
    { value: "SELECTED", label: "Candidate Selected" },
    { value: "REJECTED", label: "Candidate Rejected" },
    { value: "ACCOUNT_CREATED", label: "Account Created" },
    { value: "SUBSCRIPTION_EXPIRING", label: "Subscription Expiring" },
    { value: "SUBSCRIPTION_EXPIRED", label: "Subscription Expired" },
  ];

  const variables = [
    { value: "{{candidateName}}", label: "Candidate Name" },
    { value: "{{jobTitle}}", label: "Job Title" },
    { value: "{{companyName}}", label: "Company Name" },
    { value: "{{interviewDate}}", label: "Interview Date" },
    { value: "{{interviewTime}}", label: "Interview Time" },
    { value: "{{interviewLink}}", label: "Interview Link" },
    { value: "{{recruiterName}}", label: "Recruiter Name" },
    { value: "{{applicationId}}", label: "Application ID" },
    { value: "{{position}}", label: "Position" },
    { value: "{{salary}}", label: "Salary" },
  ];

  useEffect(() => {
    if (isEditMode && id) {
      fetchTemplate(id);
    }
  }, [id]);

  const fetchTemplate = async (templateId: string) => {
    try {
      setIsLoading(true);
      const allTemplates = await emailTemplateService.getAll();
      const foundTemplate = allTemplates.find((t) => t.id === templateId);

      if (foundTemplate) {
        setTemplate(foundTemplate);
      } else {
        toast.error("Template not found");
        setTimeout(() => navigate("/email-templates"), 1500);
      }
    } catch (error) {
      toast.error("Failed to load template");
      setTimeout(() => navigate("/email-templates"), 1500);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (activate: boolean = false) => {
    if (!template.name || !template.subject || !template.body) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setIsSaving(true);

      if (isEditMode) {
        const updatePayload: UpdateEmailTemplatePayload = {
          subject: template.subject,
          body: template.body,
        };
        await emailTemplateService.update(template.id, updatePayload);

        // If activating, call toggle endpoint
        if (activate && !template.isActive) {
          const togglePayload: ToggleEmailInputPayload = { isActive: true };
          await emailTemplateService.toggle(template.id, togglePayload);
          toast.success("Template updated and activated successfully!");
        } else {
          toast.success("Template updated successfully!");
        }
      } else {
        const createPayload: createEmailTemplatePayload = {
          name: template.name,
          event: template.event,
          subject: template.subject,
          body: template.body,
        };
        const newTemplate = await emailTemplateService.create(createPayload);

        // If activating, call toggle endpoint
        if (activate) {
          const togglePayload: ToggleEmailInputPayload = { isActive: true };
          await emailTemplateService.toggle(newTemplate.id, togglePayload);
          toast.success("Template created and activated successfully!");
        } else {
          toast.success("Template created successfully!");
        }
      }

      // Show success toast for 2 seconds, then navigate back
      setTimeout(() => {
        navigate("/email-templates");
      }, 2000);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        (isEditMode
          ? "Failed to update template"
          : "Failed to create template");
      toast.error(errorMessage);
      setIsSaving(false);
    }
  };

  const handleInsertVariable = (variable: string) => {
    const textarea = document.querySelector("textarea") as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newText =
        template.body.substring(0, start) +
        variable +
        template.body.substring(end);
      setTemplate({ ...template, body: newText });

      // Focus back on textarea
      setTimeout(() => {
        textarea.focus();
        textarea.selectionStart = textarea.selectionEnd =
          start + variable.length;
      }, 0);
    }
  };

  const handleResetToDefault = () => {
    const defaultTemplate: EmailTemplate = {
      id: template.id,
      name: template.name,
      event: template.event,
      subject: "",
      body: "",
      isActive: template.isActive,
      createdAt: template.createdAt,
    };
    setTemplate(defaultTemplate);
    toast.success("Reset to default");
  };

  const handleDuplicateTemplate = async () => {
    try {
      const createPayload: createEmailTemplatePayload = {
        name: `${template.name} (Copy)`,
        event: template.event,
        subject: template.subject,
        body: template.body,
      };
      const duplicatedTemplate = await emailTemplateService.create(
        createPayload
      );
      toast.success("Template duplicated successfully!");

      // Navigate to edit page after toast is visible
      setTimeout(() => {
        navigate(`/email-templates/edit/${duplicatedTemplate.id}`);
      }, 1500);
    } catch (error) {
      toast.error("Failed to duplicate template");
    }
  };

  const handleSendTestEmail = async () => {
  if (!testEmail) {
    toast.error("Please enter a test email address");
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(testEmail)) {
    toast.error("Please enter a valid email address");
    return;
  }

  try {
    setIsSendingTest(true);

    if (!template.id) {
      const createPayload: createEmailTemplatePayload = {
        name: template.name || "Untitled Template",
        event: template.event,
        subject: template.subject,
        body: template.body,
      };

      const newTemplate = await emailTemplateService.create(createPayload);
      setTemplate(newTemplate);

      await emailTemplateService.sendTestEmail(newTemplate.id, {
        email: testEmail,
      });

      toast.success("Template saved and test email sent successfully!");
    } else {
      await emailTemplateService.sendTestEmail(template.id, {
        email: testEmail,
      });

      toast.success("Test email sent successfully!");
    }

    setTestEmail("");
  } catch (error: any) {
    toast.error(
      error.response?.data?.message || "Failed to send test email"
    );
  } finally {
    setIsSendingTest(false);
  }
};


  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-56 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">R</span>
            </div>
            <span className="font-semibold text-gray-900">RecruitIQ</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          <div className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer">
            <Grid3x3 size={20} />
            <span className="text-sm font-medium">Dashboard</span>
          </div>
          <div className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer">
            <FileText size={20} />
            <span className="text-sm font-medium">Activity Logs</span>
          </div>
          <div className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer">
            <UserCheck size={20} />
            <span className="text-sm font-medium">Recruiter Management</span>
          </div>
          <div className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer">
            <Users size={20} />
            <span className="text-sm font-medium">Candidate Management</span>
          </div>
          <div className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer">
            <LogIn size={20} />
            <span className="text-sm font-medium">Subscribers</span>
          </div>
          <div className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer">
            <BarChart3 size={20} />
            <span className="text-sm font-medium">Plans Overview</span>
          </div>
          <div
            className="flex items-center gap-3 px-3 py-2 text-indigo-600 bg-indigo-50 rounded-lg cursor-pointer font-medium"
            onClick={() => navigate("/email-templates")}
          >
            <Mail size={20} />
            <span className="text-sm">Email Template Management</span>
          </div>
          <div className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer">
            <FileText size={20} />
            <span className="text-sm font-medium">Email logs</span>
          </div>
          <div className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer">
            <Settings size={20} />
            <span className="text-sm font-medium">Settings</span>
          </div>
        </nav>

        {/* Log Out */}
        <div className="p-3 border-t border-gray-200">
          <div className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer">
            <LogOut size={20} />
            <span className="text-sm font-medium">Log Out</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/email-templates")}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft size={16} />
              Back to Templates
            </Button>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <ChevronRight size={16} />
              <span>
                {isEditMode ? "Edit Template" : "Create New Template"}
              </span>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-blue-500"></div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            {/* Title */}
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                {isEditMode ? "Edit Email Template" : "Create Email Template"}
              </h1>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => navigate("/email-templates")}
                  disabled={isSaving}
                >
                  <X size={18} className="mr-2" />
                  Cancel
                </Button>
                <Button
                  className="bg-gray-600 hover:bg-gray-700 text-white flex items-center gap-2"
                  onClick={() => handleSave(false)}
                  disabled={isSaving}
                >
                  <Save size={18} />
                  {isSaving ? "Saving..." : "Save Draft"}
                </Button>
                <Button
                  className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2"
                  onClick={() => handleSave(true)}
                  disabled={isSaving}
                >
                  <span>✓</span>
                  {isSaving ? "Saving..." : "Save & Activate"}
                </Button>
              </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-2 gap-8">
              {/* Left Column - Email Preview */}
              <div>
                <div className="mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 mb-1">
                    Email Preview
                  </h2>
                  <p className="text-sm text-gray-500">
                    See how your email will look to recipients.
                  </p>
                </div>
                <Card className="bg-white border-gray-200 p-6 h-full min-h-[400px] overflow-y-auto">
                  <div className="space-y-3 text-sm text-gray-700 leading-relaxed">
                    <div>
                      <span className="font-semibold">Subject:</span>{" "}
                      {template.subject}
                    </div>
                    <div className="pt-3 border-t border-gray-200">
                      <div className="whitespace-pre-wrap text-xs">
                        {template.body}
                      </div>
                    </div>
                    <div className="pt-3 border-t border-gray-200">
                      <div className="text-xs text-gray-600">
                        {companySignature}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Right Column - Template Editor */}
              <div>
                <div className="mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 mb-1">
                    Template Editor
                  </h2>
                  <p className="text-sm text-gray-500">
                    Customize your email template content and settings.
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Template Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Template Name *
                    </label>
                    <Input
                      value={template.name}
                      onChange={(e) =>
                        setTemplate({ ...template, name: e.target.value })
                      }
                      className="bg-white border-gray-200"
                      placeholder="Enter template name"
                    />
                  </div>

                  {/* Event Type */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Event Type *
                    </label>
                    <Select
                      value={template.event}
                      onValueChange={(value) =>
                        setTemplate({ ...template, event: value as any })
                      }
                    >
                      <SelectTrigger className="bg-white border-gray-200">
                        <SelectValue placeholder="Select event type" />
                      </SelectTrigger>
                      <SelectContent>
                        {events.map((event) => (
                          <SelectItem key={event.value} value={event.value}>
                            {event.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Subject Line */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Subject Line *
                    </label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        value={template.subject}
                        onChange={(e) =>
                          setTemplate({ ...template, subject: e.target.value })
                        }
                        className="flex-1 bg-white border-gray-200"
                        placeholder="Enter email subject"
                      />
                      <Button
                        className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1 px-3"
                        onClick={() =>
                          setShowVariablesDropdown(!showVariablesDropdown)
                        }
                      >
                        <Plus size={16} />
                        Variables
                      </Button>
                    </div>
                  </div>

                  {/* Email Body */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Email Body *
                    </label>
                    <div className="bg-white border border-gray-200 rounded-lg mb-2">
                      <div className="border-b border-gray-200 bg-gray-50 p-3 flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-2 h-8 w-8"
                        >
                          <Bold size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-2 h-8 w-8"
                        >
                          <Italic size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-2 h-8 w-8"
                        >
                          <List size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-2 h-8 w-8"
                        >
                          <Link size={16} />
                        </Button>
                      </div>
                      <Textarea
                        value={template.body}
                        onChange={(e) =>
                          setTemplate({ ...template, body: e.target.value })
                        }
                        className="w-full p-4 text-sm border-none focus:outline-none min-h-48 font-sans resize-none"
                        placeholder="Enter email body content"
                      />
                    </div>

                    <div className="flex gap-2 mb-4">
                      <Button
                        className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 text-sm"
                        onClick={() =>
                          setShowVariablesDropdown(!showVariablesDropdown)
                        }
                      >
                        <Plus size={16} />
                        Insert Variable
                      </Button>
                      <Button className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 text-sm">
                        <Eye size={16} />
                        Insert Button Component
                      </Button>
                      <Button className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 text-sm">
                        <Download size={16} />
                        Add Image
                      </Button>
                    </div>

                    {/* Variables Dropdown */}
                    {showVariablesDropdown && (
                      <div className="mb-4 p-4 bg-white border border-gray-200 rounded-lg">
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">
                          Available Variables
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                          {variables.map((variable) => (
                            <Button
                              key={variable.value}
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleInsertVariable(variable.value)
                              }
                              className="justify-start text-xs"
                            >
                              {variable.label}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Email Footer Settings */}
                  <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">
                      Email Footer Settings
                    </h3>
                    <p className="text-xs text-gray-500 mb-4">
                      Configure the standard footer included in all emails.
                    </p>

                    <div className="space-y-4">
                      {/* Company Signature */}
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Company Signature
                        </label>
                        <Input
                          value={companySignature}
                          onChange={(e) => setCompanySignature(e.target.value)}
                          className="bg-white border-gray-200 text-sm"
                        />
                      </div>

                      {/* Social Links */}
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Social Links (URL)
                        </label>
                        <Input
                          value={socialLinks}
                          onChange={(e) => setSocialLinks(e.target.value)}
                          className="bg-white border-gray-200 text-sm"
                          placeholder="https://linkedin.com/company/recruitflow"
                        />
                      </div>

                      {/* Unsubscribe Link */}
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                          Unsubscribe Link (URL)
                        </label>
                        <Input
                          value={unsubscribeLink}
                          onChange={(e) => setUnsubscribeLink(e.target.value)}
                          className="bg-white border-gray-200 text-sm"
                          placeholder="https://recruitflow.com/unsubscribe?user_id=123"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Secondary Actions */}
                  <div className="flex gap-3 text-sm">
                    <button
                      className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
                      onClick={handleResetToDefault}
                    >
                      <RotateCcw size={16} />
                      Reset to Default
                    </button>
                    <button
                      className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
                      onClick={handleDuplicateTemplate}
                    >
                      <Copy size={16} />
                      Duplicate Template
                    </button>
                  </div>

                  {/* Test Email Section */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6 mt-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">
                      Send Test Email
                    </h3>
                    <p className="text-xs text-gray-500 mb-4">
                      Send a test email to ensure everything looks correct
                      before activation.
                    </p>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Recipient Email
                      </label>
                      <Input
                        type="email"
                        value={testEmail}
                        onChange={(e) => setTestEmail(e.target.value)}
                        placeholder="john.doe@example.com"
                        className="bg-white border-gray-200"
                      />
                    </div>

                    <Button
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center gap-2"
                      onClick={handleSendTestEmail}
                      disabled={!testEmail || isSendingTest}
                    >
                      {isSendingTest ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send size={16} />
                          Send Test Email
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white border-t border-gray-200 px-8 py-4 text-center text-sm text-gray-500">
          © 2025 RecruitFlow Admin. All rights reserved.
        </div>
      </div>
    </div>
  );
}
