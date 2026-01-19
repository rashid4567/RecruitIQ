"use client";

import { useState, useEffect } from "react";
import {
  Mail,
  Bold,
  Italic,
  List,
  Link,
  Plus,
  Eye,
  RotateCcw,
  Copy,
  Send,
  ArrowLeft,
  Save,
  X,
  RefreshCw,
  Zap,
  MailIcon,
  ChevronLeft,
  Type,
  Image,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import Sidebar from "../../../components/admin/sideBar";

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
    "Best regards, The RecruitIQ Team"
  );
  const [socialLinks, setSocialLinks] = useState(
    "https://linkedin.com/company/recruitiq"
  );
  const [unsubscribeLink, setUnsubscribeLink] = useState(
    "https://recruitiq.com/unsubscribe?user_id=123"
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
        setTimeout(() => navigate("/admin/email-templates"), 1500);
      }
    } catch (error) {
      toast.error("Failed to load template");
      setTimeout(() => navigate("/admin/email-templates"), 1500);
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

        if (activate) {
          const togglePayload: ToggleEmailInputPayload = { isActive: true };
          await emailTemplateService.toggle(newTemplate.id, togglePayload);
          toast.success("Template created and activated successfully!");
        } else {
          toast.success("Template created successfully!");
        }
      }

      setTimeout(() => {
        navigate("/admin/email-templates");
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

      setTimeout(() => {
        navigate(`/admin/email-templates/edit/${duplicatedTemplate.id}`);
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
      toast.error(error.response?.data?.message || "Failed to send test email");
    } finally {
      setIsSendingTest(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="text-gray-600">Loading template editor...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <button
                  onClick={() => navigate("/admin/email-templates")}
                  className="hover:text-gray-700 flex items-center gap-1"
                >
                  <ChevronLeft size={14} />
                  <span>Email Template Management</span>
                </button>
                <span>›</span>
                <span className="text-gray-900 font-medium">
                  {isEditMode ? "Edit Template" : "Create Template"}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Mail className="w-8 h-8 text-indigo-600" />
                {isEditMode ? "Edit Email Template" : "Create Email Template"}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => navigate("/admin/email-templates")}
              >
                <ArrowLeft size={18} />
                Back to List
              </Button>
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => fetchTemplate(id!)}
              >
                <RefreshCw size={18} />
                Refresh
              </Button>
              <Button
                className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
                onClick={() => handleSave(true)}
                disabled={isSaving}
              >
                <Save size={18} />
                {isSaving ? "Saving..." : "Save & Activate"}
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Editor */}
            <div className="space-y-6">
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <Type className="w-5 h-5 text-indigo-600" />
                    </div>
                    Template Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
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
                      placeholder="Enter template name"
                      className="border-gray-300"
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
                      <SelectTrigger className="border-gray-300">
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
                    <div className="flex gap-2">
                      <Input
                        value={template.subject}
                        onChange={(e) =>
                          setTemplate({ ...template, subject: e.target.value })
                        }
                        className="flex-1 border-gray-300"
                        placeholder="Enter email subject"
                      />
                      <Button
                        variant="outline"
                        className="gap-2"
                        onClick={() =>
                          setShowVariablesDropdown(!showVariablesDropdown)
                        }
                      >
                        <Plus size={16} />
                        Variables
                      </Button>
                    </div>
                  </div>

                  {/* Email Body Editor */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Email Body *
                    </label>
                    <div className="border border-gray-300 rounded-lg">
                      {/* Editor Toolbar */}
                      <div className="border-b border-gray-300 bg-gray-50 p-3 flex gap-2 rounded-t-lg">
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
                        <div className="w-px h-6 bg-gray-300 mx-2"></div>
                        <Button variant="ghost" size="sm" className="p-2 h-8">
                          <Image size={16} className="mr-2" />
                          Add Image
                        </Button>
                      </div>

                      {/* Text Area */}
                      <Textarea
                        value={template.body}
                        onChange={(e) =>
                          setTemplate({ ...template, body: e.target.value })
                        }
                        className="w-full p-4 text-sm border-none focus:outline-none min-h-64 font-sans resize-none"
                        placeholder="Write your email content here..."
                      />
                    </div>

                    {/* Variables Section */}
                    {showVariablesDropdown && (
                      <div className="mt-4 p-4 bg-gray-50 border border-gray-300 rounded-lg">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">
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
                              className="justify-start text-xs border-gray-300 hover:bg-gray-100"
                            >
                              {variable.label}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Footer Settings */}
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <MailIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    Email Footer Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Company Signature
                    </label>
                    <Input
                      value={companySignature}
                      onChange={(e) => setCompanySignature(e.target.value)}
                      className="border-gray-300 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Social Links URL
                    </label>
                    <Input
                      value={socialLinks}
                      onChange={(e) => setSocialLinks(e.target.value)}
                      className="border-gray-300 text-sm"
                      placeholder="https://linkedin.com/company/recruitiq"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Unsubscribe Link URL
                    </label>
                    <Input
                      value={unsubscribeLink}
                      onChange={(e) => setUnsubscribeLink(e.target.value)}
                      className="border-gray-300 text-sm"
                      placeholder="https://recruitiq.com/unsubscribe"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Preview & Actions */}
            <div className="space-y-6">
              {/* Preview Card */}
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Eye className="w-5 h-5 text-purple-600" />
                    </div>
                    Email Preview
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="bg-white border border-gray-300 rounded-lg p-4 min-h-96">
                    <div className="space-y-4 text-sm text-gray-700">
                      {/* Header */}
                      <div className="border-b border-gray-300 pb-3">
                        <div className="text-xs text-gray-500 mb-1">
                          TO: recipient@example.com
                        </div>
                        <div className="text-xs text-gray-500 mb-1">
                          FROM: no-reply@recruitiq.com
                        </div>
                        <div className="text-xs text-gray-500">
                          SUBJECT: {template.subject || "(No subject)"}
                        </div>
                      </div>

                      {/* Body Preview */}
                      <div className="prose prose-sm max-w-none">
                        <div className="whitespace-pre-wrap text-sm leading-relaxed">
                          {template.body ||
                            "Your email content will appear here..."}
                        </div>

                        {/* Footer */}
                        <div className="mt-8 pt-4 border-t border-gray-300">
                          <p className="text-sm text-gray-600">
                            {companySignature}
                          </p>
                          {socialLinks && (
                            <p className="text-xs text-gray-500 mt-2">
                              Connect with us:{" "}
                              <a
                                href={socialLinks}
                                className="text-blue-600 hover:underline"
                              >
                                {socialLinks}
                              </a>
                            </p>
                          )}
                          {unsubscribeLink && (
                            <p className="text-xs text-gray-400 mt-4">
                              <a
                                href={unsubscribeLink}
                                className="hover:underline"
                              >
                                Unsubscribe
                              </a>{" "}
                              from these emails
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions Card */}
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Zap className="w-5 h-5 text-green-600" />
                    </div>
                    Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  {/* Test Email */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-gray-900">
                      Send Test Email
                    </h4>
                    <Input
                      type="email"
                      value={testEmail}
                      onChange={(e) => setTestEmail(e.target.value)}
                      placeholder="recipient@example.com"
                      className="border-gray-300"
                    />
                    <Button
                      className="w-full gap-2"
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

                  {/* Secondary Actions */}
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-200">
                    <Button
                      variant="outline"
                      className="gap-2"
                      onClick={handleResetToDefault}
                    >
                      <RotateCcw size={16} />
                      Reset
                    </Button>
                    <Button
                      variant="outline"
                      className="gap-2"
                      onClick={handleDuplicateTemplate}
                    >
                      <Copy size={16} />
                      Duplicate
                    </Button>
                  </div>

                  {/* Save Actions */}
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-200">
                    <Button
                      variant="outline"
                      className="gap-2"
                      onClick={() => navigate("/admin/email-templates")}
                      disabled={isSaving}
                    >
                      <X size={16} />
                      Cancel
                    </Button>
                    <Button
                      className="gap-2 bg-indigo-600 hover:bg-indigo-700"
                      onClick={() => handleSave(true)}
                      disabled={isSaving}
                    >
                      <Save size={16} />
                      {isSaving ? "Saving..." : "Save & Activate"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
