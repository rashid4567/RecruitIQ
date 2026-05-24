import { Mail, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function TemplateHeader() {
  const navigate = useNavigate();

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-slate-200/70 sticky top-0 z-40 px-6 py-4 shadow-sm">
      <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-linear-to-br from-indigo-600 to-violet-600 rounded-xl shadow-md">
            <Mail className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Email Templates
            </h1>
            <p className="text-sm text-slate-500">
              Manage notification & automation email content
            </p>
          </div>
        </div>

        <Button
          size="sm"
          className="h-9 bg-indigo-600 hover:bg-indigo-700 gap-1.5 shadow-sm"
          onClick={() => navigate("/admin/email-templates/create")}
        >
          <Plus className="h-4 w-4" />
          New Template
        </Button>
      </div>
    </header>
  );
}