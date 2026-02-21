import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

import Sidebar from "@/components/admin/sideBar";
import type { EmailTemplate } from "@/module/admin/domain/entities/email-template.entity";
import { useEmailTemplateManagement } from "../hooks/useEmailTemplateManagement";

import { TemplateHeader } from "../components/email-template.managment/TemplateHeader";
import { TemplateSidebar } from "../components/email-template.managment/TemplateSidebar";
import { TemplateList } from "../components/email-template.managment/TemplateList";
import { TemplatePagination } from "../components/email-template.managment/TemplatePagination";
import { TemplateDialogs } from "../components/email-template.managment/TemplateDialogs";
import { ErrorState } from "../components/email-template.managment/ErrorState";

export default function EmailTemplateManagement() {
  const navigate = useNavigate();

  const {
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
  } = useEmailTemplateManagement();

  const handleTestEmail = (template: EmailTemplate) => {
    const email = prompt("Test recipient email:", "test@example.com");
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email");
      return;
    }

    sendTestEmail(template.getId(), email);
  };

  const handleView = (id: string) => {
    navigate(`/admin/email-templates/${id}`);
  };

  const handleEdit = (id: string) => {
    navigate(`/admin/email-templates/edit/${id}`);
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setPagination((p) => ({ ...p, page: 1 }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/20 flex">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <TemplateHeader />

        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-screen-2xl mx-auto space-y-6">
            {error && <ErrorState error={error} onRetry={fetchTemplates} />}

            {!error && (
              <div className="grid lg:grid-cols-12 gap-7">
                {/* Categories */}
                <div className="lg:col-span-3">
                  <TemplateSidebar
                    activeCategory={activeCategory}
                    onCategoryChange={handleCategoryChange}
                  />
                </div>

                {/* Main area */}
                <div className="lg:col-span-9 space-y-6">
                  <TemplateList
                    loading={loading}
                    templates={paginatedTemplates}
                    search={search}
                    onSearchChange={setSearch}
                    pagination={pagination}
                    onPaginationChange={setPagination}
                    onView={handleView}
                    onEdit={handleEdit}
                    onTestEmail={handleTestEmail}
                    onToggle={setToggleTemplate}
                    onDelete={setDeleteId}
                  />

                  <TemplatePagination
                    currentPage={pagination.page}
                    totalPages={totalPages}
                    totalItems={filteredTemplates.length}
                    pageSize={pagination.limit}
                    onPageChange={changePage}
                  />
                </div>
              </div>
            )}
          </div>
        </main>

        <TemplateDialogs
          deleteId={deleteId}
          toggleTemplate={toggleTemplate}
          onDeleteClose={() => setDeleteId(null)}
          onToggleClose={() => setToggleTemplate(null)}
          onDeleteConfirm={executeDelete}
          onToggleConfirm={executeToggle}
        />
      </div>
    </div>
  );
}