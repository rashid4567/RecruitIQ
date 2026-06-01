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
  File,
  Trash2,
  Download,
} from "lucide-react";
import { SectionHeader } from "../common/SectionHeader";
import {
  GenderEnum,
  type ProfileFormData,
} from "@/module/candidate/presentation/validators/profileValidation";
import { useResume } from "@/module/resume/presentation/hook/resume.hooks";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AdditionalInfoSectionProps {
  isEditing: boolean;
  profile: {
    gender?: string | null;
    skills?: string[];
    preferredJobLocations?: string[];
    resume?: { name: string; size: number; uploadedAt: Date } | null;
  };
  editData: Partial<ProfileFormData>;
  validationErrors: Record<string, string>;
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ─── TagInput ─────────────────────────────────────────────────────────────────

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

// ─── Resume Upload Modal ──────────────────────────────────────────────────────

interface ResumeUploadModalProps {
  open: boolean;
  onClose: () => void;
  resume: { name: string; size: number; uploadedAt: Date } | null;
  isUploading: boolean;
  uploadProgress: number;
  isDeleting: boolean;
  isDownloading: boolean;
  error: string | null;
  onUpload: (file: File) => void;
  onDelete: () => void;
  onDownload: () => void;
  clearError: () => void;
}

function ResumeUploadModal({
  open,
  onClose,
  resume,
  isUploading,
  uploadProgress,
  isDeleting,
  isDownloading,
  error,
  onUpload,
  onDelete,
  onDownload,
  clearError,
}: ResumeUploadModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];

      if (file) {
        onUpload(file);
      }

      e.target.value = "";
    },
    [onUpload],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files?.[0];
      if (file) onUpload(file);
    },
    [onUpload],
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => e.preventDefault(),
    [],
  );

  const handleClose = useCallback(() => {
    if (isUploading) return;
    clearError();
    onClose();
  }, [isUploading, clearError, onClose]);

  if (!open) return null;

  const ACCEPT =
    ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-150"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="resume-modal-title"
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-md animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="flex items-start justify-between p-6 pb-4">
            <div>
              <h2
                id="resume-modal-title"
                className="text-base font-semibold text-slate-900"
              >
                Upload resume
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">
                PDF or Word document · max 5 MB
              </p>
            </div>
            <button
              onClick={handleClose}
              disabled={isUploading}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-40"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="px-6 pb-6 space-y-4">
            {/* Drop zone */}
            {!isUploading && !resume && (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center cursor-pointer hover:border-amber-400 hover:bg-amber-50/40 transition-colors group"
              >
                <div className="w-12 h-12 rounded-full bg-slate-100 group-hover:bg-amber-100 flex items-center justify-center mx-auto mb-3 transition-colors">
                  <Upload className="h-5 w-5 text-slate-400 group-hover:text-amber-500 transition-colors" />
                </div>
                <p className="text-sm font-medium text-slate-700 mb-1">
                  Drag & drop your file here
                </p>
                <p className="text-sm text-slate-400 mb-3">or</p>
                <span className="inline-block px-4 py-1.5 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                  Browse files
                </span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={ACCEPT}
                  onChange={handleFileChange}
                  className="hidden"
                  aria-label="Select resume file"
                />
              </div>
            )}

            {/* Upload progress */}
            {isUploading && (
              <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-3 border border-slate-200">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
                  <File className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate mb-1.5">
                    Uploading…
                  </p>
                  <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
                <span className="text-xs text-slate-500 shrink-0 w-9 text-right">
                  {Math.round(uploadProgress)}%
                </span>
              </div>
            )}

            {/* Uploaded file */}
            {resume && !isUploading && (
              <>
                <div className="flex items-center gap-3 bg-green-50 rounded-xl p-3 border border-green-200">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-green-900 truncate">
                      {resume.name}
                    </p>
                    <p className="text-xs text-green-700 mt-0.5">
                      {formatBytes(resume.size)} ·{" "}
                      {resume.uploadedAt.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={onDownload}
                      disabled={isDownloading}
                      className="p-1.5 rounded-lg text-green-700 hover:bg-green-100 transition-colors disabled:opacity-40"
                      aria-label="Download resume"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                    <button
                      onClick={onDelete}
                      disabled={isDeleting}
                      className="p-1.5 rounded-lg text-green-700 hover:bg-red-100 hover:text-red-600 transition-colors disabled:opacity-40"
                      aria-label="Delete resume"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Replace */}
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2 rounded-lg border border-dashed border-slate-200 text-sm text-slate-500 hover:border-amber-400 hover:text-amber-600 hover:bg-amber-50/40 transition-colors text-center cursor-pointer"
                >
                  Replace with a different file
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={ACCEPT}
                  onChange={handleFileChange}
                  className="hidden"
                  aria-label="Replace resume file"
                />
              </>
            )}

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 bg-red-50 rounded-lg px-3 py-2.5 border border-red-200">
                <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Footer */}
            <div className="flex gap-3 pt-1">
              <button
                onClick={handleClose}
                disabled={isUploading}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-40"
              >
                {resume ? "Done" : "Cancel"}
              </button>
              {!resume && !isUploading && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium transition-colors"
                >
                  Choose file
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

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

// ─── Main Component ───────────────────────────────────────────────────────────

export function AdditionalInfoSection({
  isEditing,
  profile,
  editData,
  validationErrors,
  onInputChange,
  onFieldBlur,
  getFieldError,
  isFieldValid,
}: AdditionalInfoSectionProps) {
  const [resumeModalOpen, setResumeModalOpen] = useState(false);

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
  } = useResume(profile.resume);

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
                  ${
                    resume
                      ? "border-green-300 bg-green-50 text-green-800 hover:bg-green-100"
                      : "border-slate-200 bg-white text-slate-500 hover:border-amber-400 hover:text-amber-600 hover:bg-amber-50/40"
                  }
                `}
              >
                {resume ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                    <span className="flex-1 truncate font-medium">
                      {resume.name}
                    </span>
                    <span className="text-xs text-green-600 shrink-0">
                      {formatBytes(resume.size)}
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
                    <span className="text-slate-900 truncate flex-1">
                      {resume.name}
                    </span>
                    <span className="text-xs text-slate-400 shrink-0">
                      {formatBytes(resume.size)}
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

      {/* Resume Upload Modal */}
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
