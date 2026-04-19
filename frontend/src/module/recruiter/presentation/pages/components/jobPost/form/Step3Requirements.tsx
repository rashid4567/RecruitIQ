// Step3Requirements.tsx
import { Label } from "@/components/ui/label";
import TagInput from "./TagInput";
import { Input } from "@/components/ui/input";
import { Briefcase, Code, Star } from "lucide-react";
import type { JobFormData } from "@/module/recruiter/presentation/types/jobForm.types";

interface Step3RequirementsProps {
  formData: JobFormData;
  setFormData: (updater: (prev: JobFormData) => JobFormData) => void;
}

export default function Step3Requirements({ formData, setFormData }: Step3RequirementsProps) {
  const skillSuggestions = [
    "React", "Node.js", "Python", "TypeScript", "AWS", "Docker", 
    "PostgreSQL", "MongoDB", "GraphQL", "Next.js", "Kubernetes",
    "Java", "C++", "Go", "Ruby", "PHP", "Vue.js", "Angular",
    "Redis", "Kafka", "Jenkins", "Git", "CI/CD", "Terraform"
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Skills & Experience</h2>
        <p className="text-gray-500 mt-1">Define what candidates should have</p>
      </div>

      <div className="space-y-6">
        {/* Experience Range */}
        <div className="p-4 bg-blue-50 rounded-xl">
          <Label className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-blue-600" />
            Experience Required <span className="text-red-500">*</span>
          </Label>
          <div className="grid grid-cols-2 gap-4 mt-3">
            <div>
              <Label className="text-sm">Minimum Years</Label>
              <Input
                type="number"
                min={0}
                max={30}
                value={formData.experienceMin}
                onChange={(e) => setFormData((p) => ({ ...p, experienceMin: parseInt(e.target.value) || 0 }))}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-sm">Maximum Years</Label>
              <Input
                type="number"
                min={0}
                max={30}
                value={formData.experienceMax}
                onChange={(e) => setFormData((p) => ({ ...p, experienceMax: parseInt(e.target.value) || 0 }))}
                className="mt-1"
              />
            </div>
          </div>
          {formData.experienceMin > formData.experienceMax && formData.experienceMax > 0 && (
            <p className="text-red-500 text-sm mt-2">Minimum experience cannot exceed maximum experience</p>
          )}
        </div>

        {/* Required Skills */}
        <div>
          <Label className="flex items-center gap-2">
            <Code className="w-4 h-4" />
            Required Skills <span className="text-red-500">*</span>
          </Label>
          <div className="mt-2">
            <TagInput
              tags={formData.requiredSkills}
              setTags={(tags) => setFormData((p) => ({ ...p, requiredSkills: tags }))}
              placeholder="Add required skills"
              suggestions={skillSuggestions}
            />
          </div>
          <p className="text-xs text-gray-400 mt-1">Press Enter to add a skill</p>
        </div>

        {/* Preferred Skills */}
        <div>
          <Label className="flex items-center gap-2">
            <Star className="w-4 h-4" />
            Preferred Skills (Nice to have)
          </Label>
          <div className="mt-2">
            <TagInput
              tags={formData.preferredSkills}
              setTags={(tags) => setFormData((p) => ({ ...p, preferredSkills: tags }))}
              placeholder="Add preferred skills"
              suggestions={skillSuggestions}
            />
          </div>
        </div>
      </div>
    </div>
  );
}