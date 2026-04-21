import { Label } from "@/components/ui/label";
import TagInput from "./TagInput";
import { Input } from "@/components/ui/input";
import { Briefcase, Code, Star } from "lucide-react";
import type { JobFormData } from "@/module/recruiter/presentation/types/jobForm.types";

interface Props {
  formData: JobFormData;
  setFormData: (updater: (prev: JobFormData) => JobFormData) => void;
  errors: Record<string, string>;
}

export default function Step3Requirements({ formData, setFormData, errors }: Props) {
  const skillSuggestions = ["React", "Node.js", "Python", "TypeScript", "AWS", "Docker", "PostgreSQL", "MongoDB", "GraphQL", "Next.js", "Kubernetes", "Java", "Go", "Redis"];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Skills & Experience</h2>
        <p className="text-gray-500 mt-1">What should the ideal candidate have?</p>
      </div>

      <div className="space-y-6">
        {/* Experience */}
        <div className="p-5 bg-blue-50 rounded-2xl">
          <Label className="flex items-center gap-2">
            <Briefcase className="w-4 h-4" /> Experience Required <span className="text-red-500">*</span>
          </Label>
          <div className="grid grid-cols-2 gap-4 mt-3">
            <div>
              <Label className="text-sm">Minimum Years</Label>
              <Input
                type="number"
                min={0}
                value={formData.experienceMin}
                onChange={(e) => setFormData((p) => ({ ...p, experienceMin: parseInt(e.target.value) || 0 }))}
                className={`mt-1 ${errors.experienceMax ? "border-red-500" : ""}`}
              />
            </div>
            <div>
              <Label className="text-sm">Maximum Years</Label>
              <Input
                type="number"
                min={0}
                value={formData.experienceMax}
                onChange={(e) => setFormData((p) => ({ ...p, experienceMax: parseInt(e.target.value) || 0 }))}
                className={`mt-1 ${errors.experienceMax ? "border-red-500" : ""}`}
              />
            </div>
          </div>
          {errors.experienceMax && <p className="text-red-500 text-sm mt-2">{errors.experienceMax}</p>}
        </div>

        {/* Required Skills */}
        <div>
          <Label>Required Skills <span className="text-red-500">*</span></Label>
          <TagInput
            tags={formData.requiredSkills}
            setTags={(tags) => setFormData((p) => ({ ...p, requiredSkills: tags }))}
            placeholder="Add required skills (Press Enter)"
            suggestions={skillSuggestions}
          />
          {errors.requiredSkills && <p className="text-red-500 text-sm mt-2">{errors.requiredSkills}</p>}
        </div>

        {/* Preferred Skills */}
        <div>
          <Label>Preferred Skills (Optional)</Label>
          <TagInput
            tags={formData.preferredSkills}
            setTags={(tags) => setFormData((p) => ({ ...p, preferredSkills: tags }))}
            placeholder="Add preferred skills"
            suggestions={skillSuggestions}
          />
        </div>
      </div>
    </div>
  );
}