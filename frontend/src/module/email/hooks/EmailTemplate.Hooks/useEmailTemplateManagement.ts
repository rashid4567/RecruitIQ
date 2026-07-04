import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import type { EmailTemplate } from "../../types/email.types";
import {
  deleteEmailTemplate,
  getEmailTemplates,
  sendTestEmail,
  toggleEmailTemplate,
} from "../../api/email.api";

import {
  deleteTemplateSchema,
  testEmailSchema,
  toggleTemplateSchema,
} from "../../validaton/emailTemplateManagement.schema";

const EVENT_CATEGORY_MAP: Record<string, string> = {
  // Account
  ACCOUNT_CREATED: "account_related",
  PASSWORD_RESET: "account_related",
  PASSWORD_CHANGED: "account_related",
  EMAIL_VERIFICATION: "account_related",

  // Applications
  JOB_APPLIED: "application_status",
  APPLICATION_REJECTED: "application_status",
  APPLICATION_SELECTED: "application_status",
  APPLICATION_SHORTLISTED: "application_status",

  // Interviews
  INTERVIEW_SCHEDULED: "interview_related",
  INTERVIEW_RESCHEDULED: "interview_related",
  INTERVIEW_CANCELLED: "interview_related",
  INTERVIEW_REMINDER: "interview_related",

  // Subscription
  SUBSCRIPTION_CREATED: "subscription_related",
  SUBSCRIPTION_RENEWED: "subscription_related",
  SUBSCRIPTION_EXPIRED: "subscription_related",
  SUBSCRIPTION_CANCELLED: "subscription_related",
};

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
  const [toggleTemplate, setToggleTemplate] =
    useState<EmailTemplate | null>(null);

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getEmailTemplates();
      setTemplates(data ?? []);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to load templates";

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
      const nameMatch = t.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const category =
        EVENT_CATEGORY_MAP[t.event.toUpperCase()] ?? "other";

      const categoryMatch =
        activeCategory === "all" || category === activeCategory;

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

    setPagination((prev) => ({
      ...prev,
      page,
    }));
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
      await deleteEmailTemplate(result.data.templateId);

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
      templateId: toggleTemplate.id,
      active: !toggleTemplate.isActive,
    });

    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }

    try {
      await toggleEmailTemplate(
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

  const handleSendTestEmail = async (
    templateId: string,
    email: string,
  ) => {
    const result = testEmailSchema.safeParse({
      templateId,
      email,
    });

    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }

    toast.promise(
      sendTestEmail(result.data.templateId, result.data.email),
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
    sendTestEmail: handleSendTestEmail,
  };
}