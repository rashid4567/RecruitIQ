import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { FileText, Plus, X } from "lucide-react";
import type { JobFormData } from "@/module/recruiter/presentation/types/jobForm.types";

interface Props {
  formData: JobFormData;
  setFormData: (updater: (prev: JobFormData) => JobFormData) => void;
  errors: Record<string, string>;
}

function ErrorMsg({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1.5 font-medium">
      <span className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center text-red-500 shrink-0 text-[10px] font-bold">!</span>
      {msg}
    </p>
  );
}

interface ListEditorProps {
  items: string[];
  onAdd: () => void;
  onUpdate: (i: number, v: string) => void;
  onRemove: (i: number) => void;
  placeholder: string;
  dotColor: string;
  addLabel: string;
  error?: string;
}

function ListEditor({ items, onAdd, onUpdate, onRemove, placeholder, dotColor, addLabel, error }: ListEditorProps) {
  return (
    <div className="space-y-2.5">
      {items.map((item, i) => (
        <div
          key={i}
          className="flex items-center gap-3 group"
          style={{ animation: "fadeSlideIn 0.15s ease-out" }}
        >
          <div className={`w-7 h-7 rounded-lg ${dotColor} flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm`}>
            {i + 1}
          </div>
          <Input
            value={item}
            onChange={(e) => onUpdate(i, e.target.value)}
            placeholder={placeholder}
            className="flex-1 h-11 rounded-xl border-2 border-gray-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 text-sm transition-all duration-200 placeholder:text-gray-300"
          />
          <button
            type="button"
            onClick={() => onRemove(i)}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all duration-150 opacity-0 group-hover:opacity-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={onAdd}
        className="w-full h-11 flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 text-sm font-medium hover:border-indigo-400 hover:text-indigo-500 hover:bg-indigo-50/30 transition-all duration-200 group"
      >
        <Plus className="w-4 h-4 group-hover:scale-110 transition-transform duration-150" />
        {addLabel}
      </button>

      <ErrorMsg msg={error} />

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default function Step2Description({ formData, setFormData, errors }: Props) {
  const addItem = (field: "responsibilities" | "requirements") => {
    setFormData((p) => ({ ...p, [field]: [...p[field], ""] }));
  };

  const updateItem = (field: "responsibilities" | "requirements", index: number, value: string) => {
    const arr = [...formData[field]];
    arr[index] = value;
    setFormData((p) => ({ ...p, [field]: arr }));
  };

  const removeItem = (field: "responsibilities" | "requirements", index: number) => {
    setFormData((p) => ({ ...p, [field]: p[field].filter((_, i) => i !== index) }));
  };

  const charCount = formData.description.length;
  const charTarget = 200;
  const charPercent = Math.min((charCount / charTarget) * 100, 100);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-xl bg-violet-100 flex items-center justify-center">
            <FileText className="w-4 h-4 text-violet-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Job Description</h2>
        </div>
        <p className="text-gray-500 text-sm ml-10">Describe the role in a way that attracts the right talent</p>
      </div>

      <div className="space-y-8">
        {/* Role Overview */}
        <div>
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-1 mb-2">
            Role Overview <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
              placeholder="Write a compelling overview of this role — what you're building, the impact this person will have, and what makes this opportunity unique..."
              className={`min-h-40 rounded-xl border-2 text-sm resize-none transition-all duration-200 focus:ring-4 focus:ring-indigo-50 placeholder:text-gray-300 leading-relaxed ${
                errors.description
                  ? "border-red-400 bg-red-50/50 focus:border-red-400"
                  : "border-gray-200 focus:border-indigo-500"
              }`}
            />
          </div>

          {/* Character counter with progress bar */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2 flex-1">
              <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    charCount === 0 ? "w-0" : charCount < charTarget ? "bg-amber-400" : "bg-emerald-500"
                  }`}
                  style={{ width: `${charPercent}%` }}
                />
              </div>
              <span className={`text-xs font-medium ${
                charCount === 0 ? "text-gray-400" : charCount < charTarget ? "text-amber-600" : "text-emerald-600"
              }`}>
                {charCount} / {charTarget}+ chars
              </span>
            </div>
            <ErrorMsg msg={errors.description} />
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Lists</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        {/* Responsibilities */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
              Key Responsibilities <span className="text-red-400">*</span>
            </label>
            <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
              {formData.responsibilities.length} added
            </span>
          </div>
          <ListEditor
            items={formData.responsibilities}
            onAdd={() => addItem("responsibilities")}
            onUpdate={(i, v) => updateItem("responsibilities", i, v)}
            onRemove={(i) => removeItem("responsibilities", i)}
            placeholder="e.g., Design and build scalable backend services"
            dotColor="bg-indigo-500"
            addLabel="Add Responsibility"
            error={errors.responsibilities}
          />
        </div>

        {/* Requirements */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
              Requirements <span className="text-red-400">*</span>
            </label>
            <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
              {formData.requirements.length} added
            </span>
          </div>
          <ListEditor
            items={formData.requirements}
            onAdd={() => addItem("requirements")}
            onUpdate={(i, v) => updateItem("requirements", i, v)}
            onRemove={(i) => removeItem("requirements", i)}
            placeholder="e.g., 3+ years of experience with Node.js"
            dotColor="bg-amber-500"
            addLabel="Add Requirement"
            error={errors.requirements}
          />
        </div>
      </div>
    </div>
  );
}