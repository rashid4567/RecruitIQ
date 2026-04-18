import type { JobFormData } from "@/module/recruiter/presentation/types/jobForm.types"; 

interface Step5PreviewProps {
  formData: JobFormData;
}

export default function Step5Preview({ formData }: Step5PreviewProps) {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Preview Your Job Post</h2>

      <div className="border rounded-2xl p-8 bg-white shadow-sm">
        <h3 className="text-2xl font-bold text-gray-900">{formData.title || "Job Title"}</h3>
        <p className="text-gray-600 mt-6 whitespace-pre-wrap leading-relaxed">
          {formData.description || "Job description will appear here..."}
        </p>

        {formData.requiredSkills.length > 0 && (
          <div className="mt-8">
            <p className="font-medium text-gray-700 mb-2">Required Skills</p>
            <div className="flex flex-wrap gap-2">
              {formData.requiredSkills.map((skill, i) => (
                <span key={i} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}