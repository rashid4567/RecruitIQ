import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import type { JobFormData } from "@/module/recruiter/presentation/types/jobForm.types"; 
import { Input } from "@/components/ui/input";

interface Step2DescriptionProps {
  formData: JobFormData;
  setFormData: (updater: (prev: JobFormData) => JobFormData) => void;
}

export default function Step2Description({ formData, setFormData }: Step2DescriptionProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Job Description</h2>
        <p className="text-gray-500">Describe the role and responsibilities</p>
      </div>

      <div className="space-y-6">
        <div>
          <Label>Role Overview</Label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
            className="min-h-[160px]"
            placeholder="Write a compelling job description..."
          />
        </div>

        <div>
          <Label>Key Responsibilities</Label>
          <div className="space-y-3 mt-2">
            {formData.responsibilities.map((item, i) => (
              <div key={i} className="flex gap-3">
                <Input
                  value={item}
                  onChange={(e) => {
                    const newArr = [...formData.responsibilities];
                    newArr[i] = e.target.value;
                    setFormData((p) => ({ ...p, responsibilities: newArr }));
                  }}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    setFormData((p) => ({
                      ...p,
                      responsibilities: p.responsibilities.filter((_, idx) => idx !== i),
                    }))
                  }
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}

            <Button
              variant="outline"
              onClick={() =>
                setFormData((p) => ({
                  ...p,
                  responsibilities: [...p.responsibilities, ""],
                }))
              }
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Responsibility
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}