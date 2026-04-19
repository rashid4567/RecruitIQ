// Step2Description.tsx
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, X, FileText, ListChecks } from "lucide-react";
import type { JobFormData } from "@/module/recruiter/presentation/types/jobForm.types";
import { Input } from "@/components/ui/input";

interface Step2DescriptionProps {
  formData: JobFormData;
  setFormData: (updater: (prev: JobFormData) => JobFormData) => void;
}

export default function Step2Description({ formData, setFormData }: Step2DescriptionProps) {
  const addItem = (field: 'responsibilities' | 'requirements') => {
    setFormData((p) => ({ ...p, [field]: [...p[field], ""] }));
  };

  const updateItem = (field: 'responsibilities' | 'requirements', index: number, value: string) => {
    const newArr = [...formData[field]];
    newArr[index] = value;
    setFormData((p) => ({ ...p, [field]: newArr }));
  };

  const removeItem = (field: 'responsibilities' | 'requirements', index: number) => {
    setFormData((p) => ({ ...p, [field]: p[field].filter((_, i) => i !== index) }));
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Job Description</h2>
        <p className="text-gray-500">Describe the role, responsibilities, and requirements</p>
      </div>

      <div className="space-y-8">
        {/* Role Overview */}
        <div>
          <Label className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Role Overview <span className="text-red-500">*</span>
          </Label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
            className="min-h-40 mt-2"
            placeholder="Write a compelling job description including the role's purpose, impact, and what makes this opportunity exciting..."
          />
          <p className="text-xs text-gray-400 mt-1">
            {formData.description.length} characters
          </p>
        </div>

        {/* Key Responsibilities */}
        <div>
          <Label className="flex items-center gap-2">
            <ListChecks className="w-4 h-4" />
            Key Responsibilities
          </Label>
          <div className="space-y-3 mt-2">
            {formData.responsibilities.map((item, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold mt-2">
                  {i + 1}
                </div>
                <Input
                  value={item}
                  onChange={(e) => updateItem('responsibilities', i, e.target.value)}
                  placeholder="e.g., Design and implement scalable backend services"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem('responsibilities', i)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={() => addItem('responsibilities')}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Responsibility
            </Button>
          </div>
        </div>

        {/* Requirements */}
        <div>
          <Label className="flex items-center gap-2">
            <ListChecks className="w-4 h-4" />
            Requirements
          </Label>
          <div className="space-y-3 mt-2">
            {formData.requirements.map((item, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs font-bold mt-2">
                  {i + 1}
                </div>
                <Input
                  value={item}
                  onChange={(e) => updateItem('requirements', i, e.target.value)}
                  placeholder="e.g., Bachelor's degree in Computer Science or related field"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem('requirements', i)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={() => addItem('requirements')}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Requirement
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}