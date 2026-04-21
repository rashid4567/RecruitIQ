import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, X, FileText, ListChecks } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { JobFormData } from "@/module/recruiter/presentation/types/jobForm.types";

interface Props {
  formData: JobFormData;
  setFormData: (updater: (prev: JobFormData) => JobFormData) => void;
  errors: Record<string, string>;
}

export default function Step2Description({ formData, setFormData, errors }: Props) {
  const addItem = (field: "responsibilities" | "requirements") => {
    setFormData((p) => ({ ...p, [field]: [...p[field], ""] }));
  };

  const updateItem = (field: "responsibilities" | "requirements", index: number, value: string) => {
    const newArr = [...formData[field]];
    newArr[index] = value;
    setFormData((p) => ({ ...p, [field]: newArr }));
  };

  const removeItem = (field: "responsibilities" | "requirements", index: number) => {
    setFormData((p) => ({ ...p, [field]: p[field].filter((_, i) => i !== index) }));
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Job Description</h2>
        <p className="text-gray-500 mt-1">Describe the role clearly</p>
      </div>

      <div className="space-y-8">
        {/* Role Overview */}
        <div>
          <Label>Role Overview <span className="text-red-500">*</span></Label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
            className={`min-h-40 mt-2 ${errors.description ? "border-red-500" : ""}`}
            placeholder="Write a compelling overview of the role..."
          />
          <div className="flex justify-between text-xs mt-1">
            <p className="text-gray-400">{formData.description.length} characters</p>
            {errors.description && <p className="text-red-500">{errors.description}</p>}
          </div>
        </div>

        {/* Responsibilities */}
        <div>
          <Label>Key Responsibilities <span className="text-red-500">*</span></Label>
          <div className="space-y-3 mt-3">
            {formData.responsibilities.map((item, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold mt-2">
                  {i + 1}
                </div>
                <Input
                  value={item}
                  onChange={(e) => updateItem("responsibilities", i, e.target.value)}
                  placeholder="e.g., Build scalable backend systems"
                  className="flex-1"
                />
                <Button type="button" variant="ghost" size="icon" onClick={() => removeItem("responsibilities", i)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={() => addItem("responsibilities")} className="w-full">
              <Plus className="w-4 h-4 mr-2" /> Add Responsibility
            </Button>
            {errors.responsibilities && <p className="text-red-500 text-sm mt-2">{errors.responsibilities}</p>}
          </div>
        </div>

        {/* Requirements */}
        <div>
          <Label>Requirements <span className="text-red-500">*</span></Label>
          <div className="space-y-3 mt-3">
            {formData.requirements.map((item, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs font-bold mt-2">
                  {i + 1}
                </div>
                <Input
                  value={item}
                  onChange={(e) => updateItem("requirements", i, e.target.value)}
                  placeholder="e.g., 3+ years of experience in React"
                  className="flex-1"
                />
                <Button type="button" variant="ghost" size="icon" onClick={() => removeItem("requirements", i)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={() => addItem("requirements")} className="w-full">
              <Plus className="w-4 h-4 mr-2" /> Add Requirement
            </Button>
            {errors.requirements && <p className="text-red-500 text-sm mt-2">{errors.requirements}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}