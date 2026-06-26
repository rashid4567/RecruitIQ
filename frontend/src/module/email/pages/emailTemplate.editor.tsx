import { useParams, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import Sidebar from "@/components/admin/sideBar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEmailTemplateEditor } from "../hooks/EmailTemplate.Hooks/useEmailTemplateEditor";
import { TemplateHeader } from "./components/email-template/TemplateHeader";
import { TemplateSettings } from "./components/email-template/TemplateSettings";
import { EmailBodyEditor } from "./components/email-template/EmailBodyEditor";
import { VariablesSidebar } from "./components/email-template/VariablesSidebar";
import { AVAILABLE_VARIABLES, EVENTS } from "../constant/templateEvents";

export default function EmailTemplateEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
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
  } = useEmailTemplateEditor(id);

  if (loading) {
    return (
      <div className="min-h-screen bg-liner-to-br from-slate-50 via-indigo-50/20 to-purple-50/10 flex">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-5">
            <div className="relative">
              <Loader2 className="h-14 w-14 text-indigo-600 animate-spin" />
              <div className="absolute inset-0 rounded-full border-4 border-indigo-200 animate-pulse" />
            </div>
            <p className="text-lg font-medium text-slate-700">Loading template...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-liner-to-br from-slate-50 via-indigo-50/30 to-purple-50/20 flex">
        <Sidebar />

        <div className="flex-1 flex flex-col">
          <TemplateHeader
            isEdit={isEdit}
            isSaving={isSaving}
            canSave={canSave}
            testEmail={testEmail}
            onTestEmailChange={setTestEmail}
            formId={form.id || ""}
            onSendTest={sendTest}
            onSave={saveTemplate}
            onBack={() => navigate("/admin/email-templates")}
            cooldown={cooldown}
          />

          <main className="flex-1 p-6 lg:p-8 overflow-auto">
            <div className="max-w-screen-2xl mx-auto">
              <div className="grid lg:grid-cols-12 gap-8">
           
                <div className="lg:col-span-8 xl:col-span-9 space-y-8">
                  <TemplateSettings
                    form={form}
                    setForm={setForm}
                    isEdit={isEdit}
                    events={EVENTS}
                  />

                  <EmailBodyEditor
                    textareaRef={textareaRef as React.RefObject<HTMLTextAreaElement>}
                    form={form}
                    setForm={setForm}
                    previewHtml={previewHtml}
                  />
                </div>

              
                <div className="lg:col-span-4 xl:col-span-3">
                  <VariablesSidebar
                    variables={AVAILABLE_VARIABLES}
                    onInsertVariable={(variable) => {
                      insertVariable(variable);
                      textareaRef.current?.focus();
                    }}
                  />
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}