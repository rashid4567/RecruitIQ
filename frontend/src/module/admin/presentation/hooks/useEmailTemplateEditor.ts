import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";

import {
  CreateEmailTemplateUC,
  UpdateEmailTemplateUC,
  GetEmailTemplateUC,
  sendTestEmailUC,
} from "../di/email-template.di";

import {
  emailTemplateFormSchema,
  sendTestEmailSchema,
  type EmailTemplateForm,
} from "../../presentation/validaton/emailTemplate.schema";

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
  const [cooldown , setCooldown] = useState(0)

  useEffect(() => {
    if (!isEdit) return;

    const loadTemplate = async () => {
      setLoading(true);

      try {
        const list = await GetEmailTemplateUC.execute();
        const found = list.find((t) => t.getId() === id);

        if (!found) {
          toast.error("Template not found");
          return;
        }

        setForm({
          id: found.getId(),
          name: found.getName(),
          event: found.getEvent(),
          subject: found.getSubject(),
          body: found.getBody(),
        });
      } catch {
        toast.error("Failed to load template");
      } finally {
        setLoading(false);
      }
    };

    loadTemplate();
  }, [id, isEdit]);


  useEffect(()=>{
    const timer = setInterval(()=>{
      setCooldown((prev)=> prev - 1);
    },1000);

    return()=> clearInterval(timer)
  },[cooldown]);

  const insertVariable = (variable: string) => {
    const ta = textareaRef.current;
    if (!ta) return;

    const start = ta.selectionStart ?? 0;
    const end = ta.selectionEnd ?? start;

    const newValue =
      form.body.slice(0, start) + `{{${variable}}}` + form.body.slice(end);

    setForm((prev: any) => ({ ...prev, body: newValue }));

    setTimeout(() => {
      ta.focus();
      const pos = start + variable.length + 4;
      ta.setSelectionRange(pos, pos);
    }, 0);
  };

  const previewHtml = () => {
    if (!form.body?.trim()) {
      return `<p class="text-gray-400 italic">Preview will appear here...</p>`;
    }

    return form.body.replace(/\n/g, "<br>");
  };

  const saveTemplate = async () => {
    const result = emailTemplateFormSchema.safeParse(form);

    if (!result.success) {
      toast.error(
        result.error.issues.map((e: { message: any }) => e.message).join("\n"),
      );
      return;
    }

    setIsSaving(true);

    try {
      if (isEdit) {
        await UpdateEmailTemplateUC.execute(result.data.id!, {
          subject: result.data.subject,
          body: result.data.body,
        });
      } else {
        const created = await CreateEmailTemplateUC.execute(result.data);
        setForm((prev: any) => ({ ...prev, id: created.getId() }));
      }

      toast.success("Template saved successfully");
    } catch {
      toast.error("Failed to save template");
    } finally {
      setIsSaving(false);
    }
  };

  const sendTest = async () => {
    if(cooldown > 30){
      toast.error(`Please wait ${cooldown}s before sending the again`);
      return
    }
    const result = sendTestEmailSchema.safeParse({
      templateId: form.id,
      email: testEmail,
    });

    if (!result.success) {
      toast.error(
        result.error.issues.map((e: { message: any }) => e.message).join("\n"),
      );
      return;
    }

    try {
      await sendTestEmailUC.execute(result.data.templateId, result.data.email);
      setCooldown(30)
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
