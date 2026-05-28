import { useEffect, useState, useCallback, useMemo } from "react";
import { toast } from "sonner";

import type { EmailTemplate } from "@/module/email/domain/entity/email-template.entity";

import {
  GetEmailTemplateUC,
  DeleteEmailTemplateUC,
  ToggleEmailTempleteUC,
  sendTestEmailUC,
} from "../../di/email-template.di";
import { deleteTemplateSchema, testEmailSchema, toggleTemplateSchema } from "../../validaton/emailTemplateManagement.schema";



export function useEmailTemplateManagement() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
  });

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toggleTemplate, setToggleTemplate] = useState<EmailTemplate | null>(
    null,
  );

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    setError(null);

   try {
  const data = await GetEmailTemplateUC.execute();

  setTemplates(data ?? []);
} catch (err: unknown) {
  const msg =
    err instanceof Error
      ? err.message
      : "Failed to load templates";

  setError(msg);
  toast.error(msg);
} finally {
  setLoading(false);
}
  }, []);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const filteredTemplates = useMemo(() => {
    return templates.filter((t) => {
      const nameMatch = t
        .getName()
        .toLowerCase()
        .includes(search.toLowerCase());

      const categoryMatch =
        activeCategory === "all" ||
        t.getEvent().toLowerCase().includes(activeCategory.toLowerCase());

      return nameMatch && categoryMatch;
    });
  }, [templates, search, activeCategory]);

  const totalPages = Math.ceil(filteredTemplates.length / pagination.limit);

  const paginatedTemplates = useMemo(() => {
    const start = (pagination.page - 1) * pagination.limit;
    return filteredTemplates.slice(start, start + pagination.limit);
  }, [filteredTemplates, pagination]);

  const changePage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setPagination((p) => ({ ...p, page }));
  };

  const executeDelete = async () => {
    if (!deleteId) return;

    const result = deleteTemplateSchema.safeParse({
      templateId: deleteId,
    });

    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }

    try {
      await DeleteEmailTemplateUC.execute(result.data.templateId);
      toast.success("Template deleted");
      fetchTemplates();
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeleteId(null);
    }
  };

  const executeToggle = async () => {
    if (!toggleTemplate) return;

    const result = toggleTemplateSchema.safeParse({
      templateId: toggleTemplate.getId(),
      active: !toggleTemplate.isActive(),
    });

    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }

    try {
      await ToggleEmailTempleteUC.execute(
        result.data.templateId,
        result.data.active,
      );

      toast.success("Template updated");
      fetchTemplates();
    } catch {
      toast.error("Status update failed");
    } finally {
      setToggleTemplate(null);
    }
  };

  const sendTestEmail = async (templateId: string, email: string) => {
    const result = testEmailSchema.safeParse({
      templateId,
      email,
    });

    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }

    toast.promise(
      sendTestEmailUC.execute(result.data.templateId, result.data.email),
      {
        loading: "Sending test email...",
        success: "Test email sent!",
        error: "Failed to send test email",
      },
    );
  };

  return {
    templates,
    loading,
    error,
    search,
    setSearch,
    activeCategory,
    setActiveCategory,
    pagination,
    setPagination,
    changePage,
    totalPages,
    filteredTemplates,
    paginatedTemplates,
    deleteId,
    setDeleteId,
    executeDelete,
    toggleTemplate,
    setToggleTemplate,
    executeToggle,
    fetchTemplates,
    sendTestEmail,
  };
}
