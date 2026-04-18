import { Label } from "@/components/ui/label";
import TagInput from "./TagInput";
import type { JobFormData } from "@/module/recruiter/presentation/types/jobForm.types"; 

interface Step3RequirementsProps {
  formData: JobFormData;
  setFormData: (updater: (prev: JobFormData) => JobFormData) => void;
}

export default function Step3Requirements({ formData, setFormData }: Step3RequirementsProps) {
  const skillSuggestions = ["React", "Node.js", "Python", "TypeScript", "AWS", "Docker", "PostgreSQL", "MongoDB", "GraphQL", "Next.js", "Kubernetes"];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Requirements & Skills</h2>
        <p className="text-gray-500 mt-1">Define what candidates should have</p>
      </div>

      <div className="space-y-6">
        <div>
          <Label>Required Skills</Label>
          <TagInput
            tags={formData.requiredSkills}
            setTags={(tags) => setFormData((p) => ({ ...p, requiredSkills: tags }))}
            placeholder="Add required skills"
            suggestions={skillSuggestions}
          />
        </div>

        <div>
          <Label>Preferred Skills</Label>
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