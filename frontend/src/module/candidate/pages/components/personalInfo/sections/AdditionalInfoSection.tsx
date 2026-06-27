import { useState, useRef, useCallback, type KeyboardEvent } from "react";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Award,
  MapPin,
  AlertCircle,
  CheckCircle2,
  X,
  FileText,
  Upload,
} from "lucide-react";
import { SectionHeader } from "../common/SectionHeader";
import {
  GenderEnum,
  type ProfileFormData,
} from "@/module/candidate/validators/profileValidation";
import { useResume } from "@/module/resume/hook/useResume";
import { Resume } from "@/module/resume/domain/entity/Resume.entity";
import { ResumeUploadModal } from "../modal/Resumeuploadmodal";

interface AdditionalInfoSectionProps {
  isEditing: boolean;
  profile: {
    gender?: string | null;
    skills?: string[];
    preferredJobLocations?: string[];
    resume?: Resume | null;
  };
  editData: Partial<ProfileFormData>;
 
  onInputChange: <K extends keyof ProfileFormData>(
    key: K,
    value: ProfileFormData[K],
  ) => void;
  onFieldBlur: (field: keyof ProfileFormData) => void;
  getFieldError: (field: keyof ProfileFormData) => string | undefined;
  isFieldValid: (field: keyof ProfileFormData) => boolean;
}

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  onBlur: () => void;
  placeholder: string;
  error?: string;
  valid?: boolean;
  icon: React.ReactNode;
  tagColor: "amber" | "purple";
}


function FieldError({ message, id }: { message?: string; id?: string }) {
  if (!message) return null;
  return (
    <p
      id={id}
      className="flex items-center gap-1 text-xs text-red-500 mt-1.5 animate-in fade-in slide-in-from-top-1 duration-150"
    >
      <AlertCircle className="h-3 w-3 shrink-0" />
      {message}
    </p>
  );
}

function selectClass(error?: string, valid?: boolean) {
  const base =
    "w-full p-3 pl-10 h-12 rounded-lg border bg-white appearance-none cursor-pointer transition-colors focus:outline-none text-sm";
  if (error)
    return `${base} border-red-400 focus:border-red-500 ring-2 ring-red-500/20 bg-red-50/30`;
  if (valid)
    return `${base} border-green-400 focus:border-green-500 ring-2 ring-green-500/20`;
  return `${base} border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20`;
}

function formatGender(gender?: string | null): string {
  if (!gender) return "Not specified";
  return gender.charAt(0).toUpperCase() + gender.slice(1);
}


function TagInput({
  tags,
  onChange,
  onBlur,
  placeholder,
  error,
  valid,
  icon,
  tagColor,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const tagStyles = {
    amber:
      "bg-amber-100 text-amber-800 border border-amber-200 hover:bg-amber-200",
    purple:
      "bg-purple-100 text-purple-800 border border-purple-200 hover:bg-purple-200",
  };

  const ringStyles = {
    amber: "focus-within:border-amber-500 focus-within:ring-amber-500/20",
    purple: "focus-within:border-purple-500 focus-within:ring-purple-500/20",
  };

  function commitValue(raw: string) {
    const trimmed = raw.trim();
    if (!trimmed) return;
    if (tags.some((t) => t.toLowerCase() === trimmed.toLowerCase())) {
      setInputValue("");
      return;
    }
    onChange([...tags, trimmed]);
    setInputValue("");
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      commitValue(inputValue);
    } else if (e.key === "Backspace" && inputValue === "" && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  }

  function handleBlur() {
    commitValue(inputValue);
    onBlur();
  }

  function removeTag(index: number) {
    onChange(tags.filter((_, i) => i !== index));
  }

  const borderClass = error
    ? "border-red-400 ring-2 ring-red-500/20 bg-red-50/30"
    : valid
      ? "border-green-400 ring-2 ring-green-500/20"
      : `border-slate-200 focus-within:ring-2 ${ringStyles[tagColor]}`;

  return (
    <div
      className={`min-h-12 w-full rounded-lg border bg-white px-3 py-2 transition-colors cursor-text ${borderClass}`}
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex flex-wrap gap-1.5 items-center">
        <span className="text-slate-400 shrink-0">{icon}</span>
        {tags.map((tag, i) => (
          <span
            key={i}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${tagStyles[tagColor]}`}
          >
            {tag}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeTag(i);
              }}
              className="rounded-full hover:bg-black/10 p-0.5 transition-colors"
              aria-label={`Remove ${tag}`}
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          placeholder={tags.length === 0 ? placeholder : ""}
          className="flex-1 min-w-24 bg-transparent text-sm outline-none placeholder:text-slate-400 py-0.5"
          aria-invalid={!!error}
        />
        {error ? (
          <AlertCircle className="h-5 w-5 text-red-500 shrink-0 ml-auto" />
        ) : valid ? (
          <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 ml-auto" />
        ) : null}
      </div>
      {tags.length === 0 && !inputValue && (
        <p className="text-xs text-slate-400 mt-1.5 ml-7">
          Type and press{" "}
          <kbd className="px-1 py-0.5 bg-slate-100 rounded text-xs">Enter</kbd>{" "}
          or <kbd className="px-1 py-0.5 bg-slate-100 rounded text-xs">,</kbd>{" "}
          to add
        </p>
      )}
    </div>
  );
}


function useAdditionalInfo({
  profile,
  editData,
  onInputChange,
  onFieldBlur,
  getFieldError,
  isFieldValid,
}: Pick<
  AdditionalInfoSectionProps,
  | "profile"
  | "editData"
  | "onInputChange"
  | "onFieldBlur"
  | "getFieldError"
  | "isFieldValid"
>) {
  const err = useCallback(
    (f: keyof ProfileFormData) => getFieldError(f),
    [getFieldError],
  );

  const valid = useCallback(
    (f: keyof ProfileFormData) => isFieldValid(f),
    [isFieldValid],
  );

  const currentSkills = editData.skills ?? profile.skills ?? [];
  const currentLocations =
    editData.preferredJobLocations ?? profile.preferredJobLocations ?? [];
  const currentGender = editData.gender ?? profile.gender ?? "";

  const handleGenderChange = useCallback(
    (value: string) => {
      if (value === "") {
        onInputChange("gender", undefined);
        return;
      }
      const result = GenderEnum.safeParse(value as "male" | "female" | "other");
      if (result.success) onInputChange("gender", result.data);
    },
    [onInputChange],
  );

  const handleSkillsChange = useCallback(
    (tags: string[]) => onInputChange("skills", tags),
    [onInputChange],
  );

  const handleLocationsChange = useCallback(
    (tags: string[]) => onInputChange("preferredJobLocations", tags),
    [onInputChange],
  );

  const handleGenderBlur = useCallback(
    () => onFieldBlur("gender"),
    [onFieldBlur],
  );

  const handleSkillsBlur = useCallback(
    () => onFieldBlur("skills"),
    [onFieldBlur],
  );

  const handleLocationsBlur = useCallback(
    () => onFieldBlur("preferredJobLocations"),
    [onFieldBlur],
  );

  return {
    currentSkills,
    currentLocations,
    currentGender,
    err,
    valid,
    handleGenderChange,
    handleSkillsChange,
    handleLocationsChange,
    handleGenderBlur,
    handleSkillsBlur,
    handleLocationsBlur,
  };
}


export function AdditionalInfoSection({
  isEditing,
  profile,
  editData,
 
  onInputChange,
  onFieldBlur,
  getFieldError,
  isFieldValid,
}: AdditionalInfoSectionProps) {
  const [resumeModalOpen, setResumeModalOpen] = useState(false);

  // Issue 7: profile.resume may be a plain API object, not a Resume entity.
  // Normalise it before passing to useResume so entity methods are available.
  const initialResume = profile.resume
    ? profile.resume instanceof Resume
      ? profile.resume
      : Resume.create(profile.resume)
    : null;

  const {
    resume,
    isUploading,
    uploadProgress,
    isDeleting,
    isDownloading,
    error: resumeError,
    uploadResume,
    downloadResume,
    deleteResume,
    clearError,
  } = useResume(initialResume);

  const {
    currentSkills,
    currentLocations,
    currentGender,
    err,
    valid,
    handleGenderChange,
    handleSkillsChange,
    handleLocationsChange,
    handleGenderBlur,
    handleSkillsBlur,
    handleLocationsBlur,
  } = useAdditionalInfo({
    profile,
    editData,
    onInputChange,
    onFieldBlur,
    getFieldError,
    isFieldValid,
  });

  return (
    <>
      <div className="space-y-6">
        <SectionHeader
          icon={<User />}
          title="Additional Information"
          iconBgColor="bg-amber-100"
          iconColor="text-amber-600"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Gender */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <User className="h-4 w-4 text-amber-500" />
              Gender
            </label>

            {isEditing ? (
              <>
                <div className="relative group">
                  <select
                    value={currentGender}
                    onChange={(e) => handleGenderChange(e.target.value)}
                    onBlur={handleGenderBlur}
                    aria-invalid={!!err("gender")}
                    aria-describedby={
                      err("gender") ? "gender-error" : undefined
                    }
                    className={selectClass(err("gender"), valid("gender"))}
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  <User className="absolute left-3 top-3.5 h-5 w-5 text-slate-400 group-hover:text-amber-500 transition-colors pointer-events-none" />
                  {err("gender") ? (
                    <AlertCircle className="absolute right-8 top-3.5 h-5 w-5 text-red-500 pointer-events-none" />
                  ) : valid("gender") ? (
                    <CheckCircle2 className="absolute right-8 top-3.5 h-5 w-5 text-green-500 pointer-events-none" />
                  ) : null}
                </div>
                <FieldError message={err("gender")} id="gender-error" />
              </>
            ) : (
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-900 text-sm">
                {formatGender(profile.gender)}
              </div>
            )}
          </div>

          {/* Resume */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <FileText className="h-4 w-4 text-amber-500" />
              Resume
            </label>

            {isEditing ? (
              <button
                type="button"
                onClick={() => setResumeModalOpen(true)}
                className={`
                  w-full h-12 px-4 rounded-lg border text-sm text-left flex items-center gap-3 transition-colors
                  ${resume
                    ? "border-green-300 bg-green-50 text-green-800 hover:bg-green-100"
                    : "border-slate-200 bg-white text-slate-500 hover:border-amber-400 hover:text-amber-600 hover:bg-amber-50/40"
                  }
                `}
              >
                {resume ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                    {/* Issue 3: was resume.name, now resume.getFileName() */}
                    <span className="flex-1 truncate font-medium">
                      {resume.getFileName()}
                    </span>
                    {/* Issue 4 & 5: resume.size removed; show upload date instead */}
                    <span className="text-xs text-green-600 shrink-0">
                      {new Date(resume.getUploadedAt()).toLocaleDateString()}
                    </span>
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 shrink-0" />
                    <span>Upload resume</span>
                  </>
                )}
              </button>
            ) : (
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-sm">
                {resume ? (
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-amber-500 shrink-0" />
                    {/* Issue 3: was resume.name, now resume.getFileName() */}
                    <span className="text-slate-900 truncate flex-1">
                      {resume.getFileName()}
                    </span>
                    {/* Issue 4 & 5: resume.size removed; show upload date instead */}
                    <span className="text-xs text-slate-400 shrink-0">
                      {new Date(resume.getUploadedAt()).toLocaleDateString()}
                    </span>
                  </div>
                ) : (
                  <span className="text-slate-400">No resume uploaded</span>
                )}
              </div>
            )}
          </div>

          {/* Skills */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <Award className="h-4 w-4 text-amber-500" />
              Skills
            </label>

            {isEditing ? (
              <>
                <TagInput
                  tags={currentSkills}
                  onChange={handleSkillsChange}
                  onBlur={handleSkillsBlur}
                  placeholder="React, TypeScript, Node.js…"
                  error={err("skills")}
                  valid={valid("skills")}
                  icon={<Award className="h-5 w-5" />}
                  tagColor="amber"
                />
                <FieldError message={err("skills")} id="skills-error" />
              </>
            ) : (
              <div className="flex flex-wrap gap-2">
                {currentSkills.length > 0 ? (
                  currentSkills.map((skill, i) => (
                    <Badge
                      key={i}
                      className="bg-amber-100 text-amber-800 border-amber-200 px-3 py-1.5"
                    >
                      {skill}
                    </Badge>
                  ))
                ) : (
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-400 w-full text-sm">
                    No skills added
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Preferred Job Locations */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-amber-500" />
              Preferred Job Locations
            </label>

            {isEditing ? (
              <>
                <TagInput
                  tags={currentLocations}
                  onChange={handleLocationsChange}
                  onBlur={handleLocationsBlur}
                  placeholder="New York, London, Remote…"
                  error={err("preferredJobLocations")}
                  valid={valid("preferredJobLocations")}
                  icon={<MapPin className="h-5 w-5" />}
                  tagColor="purple"
                />
                <FieldError
                  message={err("preferredJobLocations")}
                  id="preferredJobLocations-error"
                />
              </>
            ) : (
              <div className="flex flex-wrap gap-2">
                {currentLocations.length > 0 ? (
                  currentLocations.map((loc, i) => (
                    <Badge
                      key={i}
                      className="bg-purple-100 text-purple-800 border-purple-200 px-3 py-1.5"
                    >
                      {loc}
                    </Badge>
                  ))
                ) : (
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-400 w-full text-sm">
                    No preferred locations added
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Resume Upload Modal — Issue 9: now imported, not duplicated inline */}
      <ResumeUploadModal
        open={resumeModalOpen}
        onClose={() => setResumeModalOpen(false)}
        resume={resume}
        isUploading={isUploading}
        uploadProgress={uploadProgress}
        isDeleting={isDeleting}
        isDownloading={isDownloading}
        error={resumeError}
        onUpload={uploadResume}
        onDelete={deleteResume}
        onDownload={downloadResume}
        clearError={clearError}
      />
    </>
  );
}