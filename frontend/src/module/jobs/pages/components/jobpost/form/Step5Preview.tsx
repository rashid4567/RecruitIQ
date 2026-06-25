import {
  Calendar, MapPin, Briefcase, DollarSign, 
  Users, Link as LinkIcon, Wifi, CheckCircle2, AlertTriangle,
} from "lucide-react";
import type { JobFormData } from "@/module/recruiter/presentation/types/jobForm.types";

interface Props {
  formData: JobFormData;
}

const formatDate = (s: string) => {
  if (!s) return "Not set";
  return new Date(s).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });
};

const formatSalary = (min: number, max: number, currency: string) => {
  const sym = currency === "INR" ? "₹" : currency === "USD" ? "$" : currency === "EUR" ? "€" : "£";
  if (!min && !max) return null;
  if (min && max) return `${sym}${min.toLocaleString()} – ${sym}${max.toLocaleString()} / yr`;
  if (min) return `${sym}${min.toLocaleString()}+ / yr`;
  return `Up to ${sym}${max.toLocaleString()} / yr`;
};

const formatExp = (min: number, max: number) => {
  if (!min && !max) return null;
  if (min === max && min > 0) return `${min}+ yrs`;
  if (min && max) return `${min}–${max} yrs`;
  if (min) return `${min}+ yrs`;
  return `Up to ${max} yrs`;
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
        <div className="w-1 h-4 bg-indigo-500 rounded-full" />
        {title}
      </h4>
      {children}
    </div>
  );
}

export default function Step5Preview({ formData }: Props) {
  const salary = formatSalary(formData.salary.min, formData.salary.max, formData.salary.currency);
  const exp = formatExp(formData.experienceMin, formData.experienceMax);

  const missing: string[] = [];
  if (!formData.title) missing.push("Job Title");
  if (!formData.description) missing.push("Description");
  if (formData.requiredSkills.length === 0) missing.push("Required Skills");
  if (!formData.expiresAt) missing.push("Application Deadline");


  return (
    <div className="space-y-6">

      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4 text-amber-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Preview & Publish</h2>
        </div>
        <p className="text-gray-500 text-sm ml-10">This is how your job post will appear to candidates</p>
      </div>

      {missing.length > 0 && (
        <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800">Almost there!</p>
            <p className="text-xs text-amber-600 mt-0.5">
              Missing: {missing.join(" · ")}
            </p>
          </div>
        </div>
      )}

      <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm">

        <div className="bg-linear-to-r from-indigo-600 to-violet-600 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-white">
                {formData.title || "Untitled Position"}
              </h3>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-sm capitalize`}>
                  {formData.jobType.replace("-", " ")}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-sm">
                  {formData.department || "General"}
                </span>
                {formData.isRemote ? (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-400/30 text-emerald-100 backdrop-blur-sm flex items-center gap-1">
                    <Wifi className="w-3 h-3" /> Remote
                  </span>
                ) : formData.location.city ? (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-sm flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {[formData.location.city, formData.location.state].filter(Boolean).join(", ")}
                  </span>
                ) : null}
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 divide-x divide-gray-100 bg-gray-50 border-b border-gray-100">
          {[
            { icon: Briefcase, label: "Experience", value: exp || "Any level" },
            { icon: DollarSign, label: "Salary", value: salary || "Not specified" },
            { icon: Users, label: "Openings", value: `${formData.positions} ${formData.positions === 1 ? "seat" : "seats"}` },
            { icon: Calendar, label: "Deadline", value: formatDate(formData.expiresAt) },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex flex-col items-center p-4 text-center">
              <Icon className="w-4 h-4 text-gray-400 mb-1" />
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
              <p className="text-sm font-bold text-gray-800 mt-0.5">{value}</p>
            </div>
          ))}
        </div>


        <div className="p-6 space-y-6 bg-white">
          {formData.description && (
            <Section title="About the Role">
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                {formData.description}
              </p>
            </Section>
          )}

          {formData.responsibilities.filter(Boolean).length > 0 && (
            <Section title="Key Responsibilities">
              <ul className="space-y-2">
                {formData.responsibilities.filter(Boolean).map((item, i) => (
                  <li key={i} className="flex gap-3 text-sm text-gray-600">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {formData.requirements.filter(Boolean).length > 0 && (
            <Section title="Requirements">
              <ul className="space-y-2">
                {formData.requirements.filter(Boolean).map((item, i) => (
                  <li key={i} className="flex gap-2.5 text-sm text-gray-600">
                    <span className="text-amber-500 shrink-0 mt-0.5">◆</span>
                    {item}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {formData.requiredSkills.length > 0 && (
            <Section title="Required Skills">
              <div className="flex flex-wrap gap-2">
                {formData.requiredSkills.map((skill, i) => (
                  <span key={i} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-semibold border border-indigo-100">
                    {skill}
                  </span>
                ))}
              </div>
            </Section>
          )}

          {formData.preferredSkills.length > 0 && (
            <Section title="Preferred Skills">
              <div className="flex flex-wrap gap-2">
                {formData.preferredSkills.map((skill, i) => (
                  <span key={i} className="px-3 py-1.5 bg-violet-50 text-violet-700 rounded-xl text-xs font-semibold border border-violet-100">
                    {skill}
                  </span>
                ))}
              </div>
            </Section>
          )}

          {formData.externalLink && (
            <div className="pt-4 border-t border-gray-100 flex items-center gap-2 text-sm text-gray-500">
              <LinkIcon className="w-4 h-4 shrink-0" />
              <span>Apply via:</span>
              <a
                href={formData.externalLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-800 hover:underline font-medium truncate"
              >
                {formData.externalLink}
              </a>
            </div>
          )}
        </div>
      </div>

      {missing.length === 0 && (
        <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          <p className="text-sm font-semibold text-emerald-800">
            Everything looks great! Ready to publish this job post.
          </p>
        </div>
      )}
    </div>
  );
}