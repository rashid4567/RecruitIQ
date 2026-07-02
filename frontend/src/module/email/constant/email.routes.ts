export const EMAIL_ROUTES = {
  EMAIL_TEMPLATES: "/admin/email-templates",
  EMAIL_TEMPLATE: (id: string) =>
    `/admin/email-templates/${id}`,
  TOGGLE_EMAIL_TEMPLATE: (id: string) =>
    `/admin/email-templates/${id}/toggle`,
  TEST_EMAIL_TEMPLATE: (id: string) =>
    `/admin/email-templates/${id}/test`,
  EMAIL_LOGS: "/admin/email-logs",
} as const;