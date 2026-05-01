import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import Sidebar from "@/components/admin/sideBar";
import type { EmailTemplate } from "@/module/admin/domain/entities/email-template.entity";
import { useEmailTemplateManagement } from "../hooks/EmailTemplate.Hooks/useEmailTemplateManagement"
import { TemplateHeader } from "../components/email-template.management/TemplateHeader";
import { TemplateSidebar } from "../components/email-template.management/TemplateSidebar";
import { TemplateList } from "../components/email-template.management/TemplateList";
import { TemplatePagination } from "../components/email-template.management/TemplatePagination";
import { TemplateDialogs } from "../components/email-template.management/TemplateDialogs";
import { ErrorState } from "../components/email-template.management/ErrorState";
import { TestEmailModal } from "../components/email-template.management/TestEmailModal"; 

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

  const [testModalOpen, setTestModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [testEmail, setTestEmail] = useState("");
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testError, setTestError] = useState("");

  
  const handleTestEmail = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setTestEmail("");       
    setTestError("");
    setTestModalOpen(true);
  };


  const handleSendTestEmail = async () => {
    if (!selectedTemplate || !testEmail.trim()) return;

    setIsSendingTest(true);
    setTestError("");

    try {
      await sendTestEmail(selectedTemplate.getId(), testEmail.trim());
      
      toast.success(`Test email sent successfully to ${testEmail}`);
      setTestModalOpen(false);
      
    
      setTestEmail("");
    } catch (err: any) {
      const message = err?.message || "Failed to send test email. Please try again.";
      setTestError(message);
      toast.error(message);
    } finally {
      setIsSendingTest(false);
    }
  };

  const handleView = (id: string) => {
    navigate(`/admin/email-templates/${id}`);
  };

  const handleEdit = (id: string) => {
    console.log("handle edit :-", id ? id : "no id found")
    navigate(`/admin/email-templates/edit/${id}`);
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setPagination((p) => ({ ...p, page: 1 }));
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-indigo-50/30 to-purple-50/20 flex">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <TemplateHeader />

        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-screen-2xl mx-auto space-y-6">
            {error && <ErrorState error={error} onRetry={fetchTemplates} />}

            {!error && (
              <div className="grid lg:grid-cols-12 gap-7">
           
                <div className="lg:col-span-3">
                  <TemplateSidebar
                    activeCategory={activeCategory}
                    onCategoryChange={handleCategoryChange}
                  />
                </div>

         
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
        <TestEmailModal
          isOpen={testModalOpen}
          onClose={() => {
            setTestModalOpen(false);
            setTestEmail("");
            setTestError("");
          }}
          templateName={selectedTemplate?.getName() || ""}
          testEmail={testEmail}
          setTestEmail={setTestEmail}
          onSendTest={handleSendTestEmail}
          isSending={isSendingTest}
          error={testError}
          setError={setTestError}
        />
      </div>
    </div>
  );
}