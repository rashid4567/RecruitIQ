import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import type { ZodIssue } from "zod";

import {
  createEmailTemplate,
  getEmailTemplates,
  sendTestEmail,
  updateEmailTemplate,
} from "../../api/email.api";

import {
  emailTemplateFormSchema,
  sendTestEmailSchema,
  type EmailTemplateForm,
} from "../../validaton/emailTemplate.schema";

export function useEmailTemplateEditor(id?: string) {
  const isEdit = !!id;
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [form, setForm] = useState<EmailTemplateForm>({
    id: "",
    name: "",
    event: "",
    subject: "",
    body: "",
  });

  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [testEmail, setTestEmail] = useState("");
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (!isEdit) return;

    const loadTemplate = async () => {
      setLoading(true);

      try {
        const templates = await getEmailTemplates();

        const found = templates.find((t) => t.id === id);

        if (!found) {
          toast.error("Template not found");
          return;
        }

        setForm({
          id: found.id,
          name: found.name,
          event: found.event,
          subject: found.subject,
          body: found.body,
        });
      } catch {
        toast.error("Failed to load template");
      } finally {
        setLoading(false);
      }
    };

    loadTemplate();
  }, [id, isEdit]);

  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  const insertVariable = (variable: string) => {
    const textarea = textareaRef.current;

    if (!textarea) return;

    const start = textarea.selectionStart ?? 0;
    const end = textarea.selectionEnd ?? start;

    const newValue =
      form.body.slice(0, start) + `{{${variable}}}` + form.body.slice(end);

    setForm((prev) => ({
      ...prev,
      body: newValue,
    }));

    setTimeout(() => {
      textarea.focus();

      const position = start + variable.length + 4;

      textarea.setSelectionRange(position, position);
    }, 0);
  };

  const previewHtml = () => {
    if (!form.body.trim()) {
      return `<p class="text-gray-400 italic">Preview will appear here...</p>`;
    }

    return form.body.replace(/\n/g, "<br>");
  };

  const saveTemplate = async () => {
    const result = emailTemplateFormSchema.safeParse(form);

    if (!result.success) {
      toast.error(
        result.error.issues.map((e: ZodIssue) => e.message).join("\n"),
      );
      return;
    }

    setIsSaving(true);

    try {
      if (isEdit) {
        await updateEmailTemplate(result.data.id!, {
          subject: result.data.subject,
          body: result.data.body,
        });
      } else {
        const created = await createEmailTemplate(result.data);

        setForm((prev) => ({
          ...prev,
          id: created.id,
        }));
      }

      toast.success("Template saved successfully");
    } catch {
      toast.error("Failed to save template");
    } finally {
      setIsSaving(false);
    }
  };

  const sendTest = async () => {
    if (cooldown > 0) {
      toast.error(`Please wait ${cooldown}s before sending again`);
      return;
    }

    const result = sendTestEmailSchema.safeParse({
      templateId: form.id,
      email: testEmail,
    });

    if (!result.success) {
      toast.error(
        result.error.issues.map((e: ZodIssue) => e.message).join("\n"),
      );
      return;
    }

    try {
      await sendTestEmail(result.data.templateId, result.data.email);

      setCooldown(30);

      toast.success("Test email sent!");
    } catch {
      toast.error("Failed to send test email");
    }
  };

  const canSave = emailTemplateFormSchema.safeParse(form).success;

  return {
    textareaRef,
    form,
    setForm,
    loading,
    isSaving,
    canSave,
    testEmail,
    setTestEmail,
    insertVariable,
    previewHtml,
    saveTemplate,
    sendTest,
    isEdit,
    cooldown,
  };
}
