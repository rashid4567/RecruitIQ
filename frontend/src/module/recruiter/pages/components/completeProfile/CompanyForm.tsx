import {
  Building,
  Globe,
  Users,
  Briefcase,
  MapPin,
  FileText,
  type LucideIcon,
} from "lucide-react";

export interface CompanyFormData {
  companyName: string;
  companyWebsite: string;
  companySize: "" | "1-10" | "11-50" | "51-200" | "201-500" | "501+";
  industry:
    | ""
    | "Technology"
    | "Finance"
    | "Healthcare"
    | "Retail"
    | "Manufacturing"
    | "Education"
    | "Marketing"
    | "Consulting"
    | "Other";
  designation: string;
  location: string;
  bio: string;
}

export interface CompanyFormErrors {
  companyName?: string;
  companyWebsite?: string;
  industry?: string;
  designation?: string;
  location?: string;
  bio?: string;
}

type FormChangeEvent = React.ChangeEvent<
  HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
>;
interface FormFieldProps {
  label: string;
  icon: LucideIcon;
  name: keyof CompanyFormData;
  value: string;
  onChange: (e: FormChangeEvent) => void;
  error?: string;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
}

interface SelectOption {
  value: string;
  label: string;
}

interface FormFieldSelectProps {
  label: string;
  icon: LucideIcon;
  name: keyof CompanyFormData;
  value: string;
  onChange: (e: FormChangeEvent) => void;
  error?: string;
  options: SelectOption[];
}

interface CompanyFormProps {
  formData: CompanyFormData;
  errors: CompanyFormErrors;
  onChange: (e: FormChangeEvent) => void;
}

export function CompanyForm({ formData, errors, onChange }: CompanyFormProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-slate-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Company Name *"
          icon={Building}
          name="companyName"
          value={formData.companyName}
          onChange={onChange}
          error={errors.companyName}
          placeholder="Acme Corporation"
        />

        <FormField
          label="Company Website"
          icon={Globe}
          name="companyWebsite"
          value={formData.companyWebsite}
          onChange={onChange}
          error={errors.companyWebsite}
          placeholder="https://www.acmecorp.com"
          type="url"
        />
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-500" />
            Company Size
          </label>
          <select
            name="companySize"
            value={formData.companySize}
            onChange={onChange}
            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select company size</option>
            <option value="1-10">1–10 employees</option>
            <option value="11-50">11–50 employees</option>
            <option value="51-200">51–200 employees</option>
            <option value="201-500">201–500 employees</option>
            <option value="501+">501+ employees</option>
          </select>
        </div>

        <FormFieldSelect
          label="Industry *"
          icon={Briefcase}
          name="industry"
          value={formData.industry}
          onChange={onChange}
          error={errors.industry}
          options={[
            { value: "", label: "Select industry" },
            { value: "Technology", label: "Technology" },
            { value: "Finance", label: "Finance" },
            { value: "Healthcare", label: "Healthcare" },
            { value: "Retail", label: "Retail" },
            { value: "Manufacturing", label: "Manufacturing" },
            { value: "Education", label: "Education" },
            { value: "Marketing", label: "Marketing" },
            { value: "Consulting", label: "Consulting" },
            { value: "Other", label: "Other" },
          ]}
        />

        <FormField
          label="Your Designation *"
          icon={Briefcase}
          name="designation"
          value={formData.designation}
          onChange={onChange}
          error={errors.designation}
          placeholder="Talent Acquisition Lead"
        />

        <FormField
          label="Location"
          icon={MapPin}
          name="location"
          value={formData.location}
          onChange={onChange}
          error={errors.location}
          placeholder="San Francisco, CA or Remote"
        />
      </div>

      <div className="mt-8 space-y-3">
        <label className="text-sm font-semibold text-slate-900 flex items-center gap-2">
          <FileText className="h-4 w-4 text-blue-500" />
          About Your Company *
        </label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={onChange}
          rows={5}
          placeholder="Tell us about your company culture, mission, and what makes you unique..."
          className={`w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 resize-none ${
            errors.bio
              ? "border-red-300 focus:ring-red-500"
              : "border-slate-300 focus:ring-blue-500"
          }`}
        />
        <div className="flex justify-between text-sm">
          {errors.bio && <p className="text-red-600">{errors.bio}</p>}
          <span
            className={
              formData.bio.length > 500 ? "text-red-500" : "text-slate-500"
            }
          >
            {formData.bio.length}/500
          </span>
        </div>
      </div>
    </div>
  );
}

function FormField({
  label,
  icon: Icon,
  name,
  value,
  onChange,
  error,
  placeholder,
  type = "text",
}: FormFieldProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-semibold text-slate-900 flex items-center gap-2">
        <Icon className="h-4 w-4 text-blue-500" />
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
          error
            ? "border-red-300 focus:ring-red-500"
            : "border-slate-300 focus:ring-blue-500"
        }`}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}

function FormFieldSelect({
  label,
  icon: Icon,
  name,
  value,
  onChange,
  error,
  options,
}: FormFieldSelectProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-semibold text-slate-900 flex items-center gap-2">
        <Icon className="h-4 w-4 text-blue-500" />
        {label}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
          error
            ? "border-red-300 focus:ring-red-500"
            : "border-slate-300 focus:ring-blue-500"
        }`}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
