import React, { useEffect, useMemo, useState } from "react";
import {
  X,
  Mail,
  Video,
  MapPin,
  Link2,
  Clock,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronDown,
  Users,
  ArrowRight,
  Building2,
  Hash,
  FileText,
  CalendarClock,
  RefreshCw,
} from "lucide-react";
import { useScheduleInterview } from "../../hooks/recruiter/useScheduleInterview";
import { useRescheduleInterview } from "../../hooks/recruiter/useRescheduleInterview";
import { useRecruiterInterviewDetails } from "../../hooks/recruiter/useRecruiterInterviewDetails";
import type { InterviewMode } from "../../types/interview.types";
import type {
  RecruiterInterviewItem,
  GetRecruiterInterviewDetailsResponse,
} from "../../types/recruiterInterview.types";
import {
  scheduleInterviewSchema,
  rescheduleInterviewSchema,
  scheduleStepFields,
  rescheduleStepFields,
  toScheduleInterviewRequest,
  toRescheduleInterviewRequest,
  splitIsoToLocalParts,
  type ScheduleFormValues,
  type RescheduleFormValues,
} from "../../validatoion/schedule.interview.validation";

const DURATIONS = [
  { label: "15 min", value: 15 },
  { label: "30 min", value: 30 },
  { label: "45 min", value: 45 },
  { label: "1 hour", value: 60 },
  { label: "75 min", value: 75 },
  { label: "1.5 hours", value: 90 },
  { label: "2 hours", value: 120 },
  { label: "150 min", value: 150 },
  { label: "3 hours", value: 180 },
];

const SCHEDULE_STEPS = ["Candidate", "Details", "Schedule", "Confirm"] as const;
const RESCHEDULE_STEPS = ["Reschedule", "Confirm"] as const;

export interface ExistingInterviewData {
  title: string;
  round: number;
  mode: InterviewMode;
  scheduledAt: string;
  durationInMinutes: number;
  location?: string;
  roomId?: string;
  meetingLink?: string;
}

export interface ScheduleInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  interview?: RecruiterInterviewItem;
  applicationId?: string;
}

function inferMode(interview: RecruiterInterviewItem): InterviewMode {
  return interview.location ? "OFFLINE" : "ONLINE";
}

function toExistingInterviewData(
  interview: RecruiterInterviewItem,
): ExistingInterviewData {
  return {
    title:
      interview.title ??
      (interview.title
        ? `${interview.title} — Round ${interview.round ?? 1}`
        : "Interview"),
    round: interview.round ?? 1,
    mode: inferMode(interview),
    scheduledAt: interview.scheduledAt as string,
    durationInMinutes: interview.durationInMinutes ?? 60,
    location: interview.location,
    roomId: interview.roomId,
  };
}

function toExistingInterviewDataFromDetails(
  details: GetRecruiterInterviewDetailsResponse,
): ExistingInterviewData {
  return {
    title: details.title,
    round: details.round,
    mode: details.mode,
    scheduledAt: details.scheduledAt,
    durationInMinutes: details.durationInMinutes,
    location: details.location,
    roomId: details.roomId,
  };
}

function buildInitialScheduleForm(
  applicationId: string,
  jobTitle: string,
): ScheduleFormValues {
  return {
    applicationId,
    title: jobTitle ? `${jobTitle} — Round 1` : "",
    description: "",
    mode: "ONLINE",
    date: "",
    hour: "10",
    minute: "00",
    durationInMinutes: 60,
    location: "",
    roomId: "",
    meetingLink: "",
    sendEmail: true,
  };
}

function buildInitialRescheduleForm(
  existing: ExistingInterviewData,
): RescheduleFormValues {
  const { date, hour, minute } = splitIsoToLocalParts(existing.scheduledAt);
  return {
    mode: existing.mode,
    date,
    hour,
    minute,
    durationInMinutes: existing.durationInMinutes,
    location: existing.location ?? "",
    roomId: existing.roomId ?? "",
    meetingLinkOption: existing.meetingLink ? "paste" : "later",
    meetingLink: existing.meetingLink ?? "",
  };
}

const FALLBACK_EXISTING: ExistingInterviewData = {
  title: "",
  round: 1,
  mode: "ONLINE",
  scheduledAt: new Date().toISOString(),
  durationInMinutes: 60,
};

export default function ScheduleInterviewModal({
  isOpen,
  onClose,
  onSuccess,
  interview,
  applicationId: applicationIdProp,
}: ScheduleInterviewModalProps) {
  const isReschedule = Boolean(
    interview?.interviewId && interview?.scheduledAt,
  );

  const candidateName = interview?.candidateName ?? "";
  const candidateEmail = interview?.candidateEmail ?? "";
  const jobTitle = interview?.jobTitle ?? "";
  const applicationStatus = interview?.applicationStatus;
  const resolvedApplicationId =
    interview?.applicationId ?? applicationIdProp ?? "";
  const missingApplicationContext = !isReschedule && !resolvedApplicationId;
  const { submit: submitSchedule, loading: scheduleLoading } =
    useScheduleInterview();
  const { submit: submitReschedule, loading: rescheduleLoading } =
    useRescheduleInterview();
  const {
    getDetails,
    loading: detailsLoading,
    error: detailsError,
  } = useRecruiterInterviewDetails();
  const loading = isReschedule ? rescheduleLoading : scheduleLoading;
  const STEPS = isReschedule ? RESCHEDULE_STEPS : SCHEDULE_STEPS;
  const lastStep = STEPS.length - 1;
  const [step, setStep] = useState(0);
  const [scheduleForm, setScheduleForm] = useState<ScheduleFormValues>(() =>
    buildInitialScheduleForm(resolvedApplicationId, jobTitle),
  );
  const [rescheduleForm, setRescheduleForm] = useState<RescheduleFormValues>(
    () => buildInitialRescheduleForm(FALLBACK_EXISTING),
  );
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [fetchedDetails, setFetchedDetails] =
    useState<GetRecruiterInterviewDetailsResponse | null>(null);
  const existingInterview = useMemo<ExistingInterviewData | null>(() => {
    if (!isReschedule) return null;
    if (fetchedDetails)
      return toExistingInterviewDataFromDetails(fetchedDetails);
    if (interview) return toExistingInterviewData(interview);
    return null;
  }, [isReschedule, fetchedDetails, interview]);
  useEffect(() => {
    if (!isOpen) return;
    setErrors({});
    setStep(0);
    setSubmitSuccess(false);
    setFetchedDetails(null);

    if (!isReschedule) {
      setScheduleForm(
        buildInitialScheduleForm(resolvedApplicationId, jobTitle),
      );
      return;
    }
    if (interview) {
      setRescheduleForm(
        buildInitialRescheduleForm(toExistingInterviewData(interview)),
      );
    }
  }, [isOpen, isReschedule, interview?.interviewId, resolvedApplicationId]);
  useEffect(() => {
    if (!isOpen || !isReschedule || !interview?.interviewId) return;
    let cancelled = false;

    getDetails(interview.interviewId).then((result) => {
      if (cancelled || !result) return;
      setFetchedDetails(result);
      setRescheduleForm(
        buildInitialRescheduleForm(toExistingInterviewDataFromDetails(result)),
      );
    });

    return () => {
      cancelled = true;
    };
  }, [isOpen, isReschedule, interview?.interviewId]);

  useEffect(() => {
    if (isReschedule || !jobTitle) return;

    setScheduleForm((prev) => ({
      ...prev,
      title: jobTitle,
    }));
  }, [jobTitle, isReschedule]);

  const handleClose = () => onClose();

  function setScheduleField<K extends keyof ScheduleFormValues>(
    key: K,
    value: ScheduleFormValues[K],
  ) {
    setScheduleForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function setRescheduleField<K extends keyof RescheduleFormValues>(
    key: K,
    value: RescheduleFormValues[K],
  ) {
    setRescheduleForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function handleScheduleInput(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    const { name, value } = e.target;
    setScheduleField(name as keyof ScheduleFormValues, value as never);
  }

  function handleRescheduleInput(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    const { name, value } = e.target;
    setRescheduleField(name as keyof RescheduleFormValues, value as never);
  }

  function validateStep(s: number): Record<string, string | undefined> {
    if (isReschedule) {
      const parsed = rescheduleInterviewSchema.safeParse(rescheduleForm);
      if (parsed.success) return {};
      const relevant = new Set<string>(rescheduleStepFields[s] ?? []);
      const errs: Record<string, string | undefined> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as string;
        if (relevant.has(key) && !errs[key]) errs[key] = issue.message;
      }
      return errs;
    }

    const parsed = scheduleInterviewSchema.safeParse(scheduleForm);
    if (parsed.success) return {};
    const relevant = new Set<string>(scheduleStepFields[s] ?? []);
    const errs: Record<string, string | undefined> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as string;
      if (relevant.has(key) && !errs[key]) errs[key] = issue.message;
    }
    return errs;
  }

  function nextStep() {
    const errs = validateStep(step);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setStep((s) => Math.min(s + 1, lastStep));
  }

  function prevStep() {
    setErrors({});
    setStep((s) => Math.max(s - 1, 0));
  }

  async function handleSubmit() {
    if (isReschedule) {
      const parsed = rescheduleInterviewSchema.safeParse(rescheduleForm);
      if (!parsed.success) {
        const fieldErrors: Record<string, string | undefined> = {};
        for (const issue of parsed.error.issues) {
          const key = issue.path[0] as string;
          if (!fieldErrors[key]) fieldErrors[key] = issue.message;
        }
        setErrors(fieldErrors);
        return;
      }

      const payload = toRescheduleInterviewRequest(parsed.data);
      const result = await submitReschedule(
        interview!.interviewId as string,
        payload,
      );
      if (result) {
        setSubmitSuccess(true);
        setTimeout(() => {
          setSubmitSuccess(false);
          onSuccess?.();
          handleClose();
        }, 2000);
      }
      return;
    }

    const parsed = scheduleInterviewSchema.safeParse(scheduleForm);
    if (!parsed.success) {
      const fieldErrors: Record<string, string | undefined> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as string;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    const payload = toScheduleInterviewRequest(parsed.data);
    const result = await submitSchedule(payload);
    if (result) {
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        onSuccess?.();
        handleClose();
      }, 2000);
    }
  }

  const activeMode: InterviewMode = isReschedule
    ? rescheduleForm.mode
    : scheduleForm.mode;
  const activeDate = isReschedule ? rescheduleForm.date : scheduleForm.date;
  const activeHour = isReschedule ? rescheduleForm.hour : scheduleForm.hour;
  const activeMinute = isReschedule
    ? rescheduleForm.minute
    : scheduleForm.minute;
  const activeDuration = isReschedule
    ? rescheduleForm.durationInMinutes
    : scheduleForm.durationInMinutes;
  const activeLocation = isReschedule
    ? rescheduleForm.location
    : scheduleForm.location;
  const activeMeetingRoom = isReschedule
    ? rescheduleForm.roomId
    : scheduleForm.roomId;

  const previewDate = useMemo(() => {
    if (!activeDate) return null;
    return new Date(
      `${activeDate}T${activeHour.padStart(2, "0")}:${activeMinute.padStart(2, "0")}:00`,
    ).toLocaleString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }, [activeDate, activeHour, activeMinute]);

  const durationLabel =
    DURATIONS.find((d) => d.value === activeDuration)?.label ?? "—";
  const hasErrors = Object.values(errors).some(Boolean);
  const todayStr = new Date().toISOString().split("T")[0];

  const displayTitle = isReschedule
    ? (existingInterview?.title ?? "—")
    : scheduleForm.title;

  const displayRound = existingInterview?.round ?? "—";
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
              {isReschedule ? (
                <RefreshCw size={13} className="text-white" />
              ) : (
                <span className="text-white font-bold text-xs">R</span>
              )}
            </div>
            <span className="font-semibold text-slate-900 text-sm">
              {isReschedule ? "Reschedule Interview" : "Schedule Interview"}
            </span>
            {candidateName && (
              <>
                <span className="text-slate-300">·</span>
                <span className="text-slate-500 text-sm">{candidateName}</span>
              </>
            )}
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        <div className="px-6 pt-5 pb-0">
          <div className="flex items-center gap-0">
            {STEPS.map((label, i) => {
              const isActive = i === step;
              const isDone = i < step;
              return (
                <React.Fragment key={label}>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                        isDone
                          ? "bg-blue-600 text-white"
                          : isActive
                            ? "bg-blue-600 text-white ring-4 ring-blue-100"
                            : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {isDone ? <CheckCircle2 size={13} /> : i + 1}
                    </div>
                    <span
                      className={`text-xs font-medium ${isActive ? "text-slate-900" : isDone ? "text-slate-500" : "text-slate-400"}`}
                    >
                      {label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div
                      className={`flex-1 h-px mx-3 transition-colors ${i < step ? "bg-blue-300" : "bg-slate-200"}`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {!isReschedule && step === 0 && (
            <StepPanel
              title="Confirm the candidate"
              subtitle="Review the details below before setting up this interview."
            >
              {missingApplicationContext && (
                <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 flex items-start gap-2.5">
                  <AlertCircle
                    size={14}
                    className="text-red-500 shrink-0 mt-0.5"
                  />
                  <p className="text-xs text-red-600">
                    No application selected. Open this dialog from a candidate
                    row so it has an application to schedule against.
                  </p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                {candidateName && (
                  <InfoBadge
                    icon={<Users size={13} />}
                    label="Candidate"
                    value={candidateName}
                  />
                )}
                {candidateEmail && (
                  <InfoBadge
                    icon={<Mail size={13} />}
                    label="Email"
                    value={candidateEmail}
                  />
                )}
                {jobTitle && (
                  <InfoBadge
                    icon={<Building2 size={13} />}
                    label="Position"
                    value={jobTitle}
                  />
                )}
                {applicationStatus && (
                  <StatusBadge status={applicationStatus as string} />
                )}
              </div>
            </StepPanel>
          )}
          {!isReschedule && step === 1 && (
            <StepPanel
              title="Interview details"
              subtitle="Set the title, format, and location for this interview."
            >
              <Field label="Interview title" error={errors.title} required>
                <Input
                  name="title"
                  value={scheduleForm.title}
                  onChange={handleScheduleInput}
                  placeholder="e.g. Technical Interview — Round 1"
                  error={!!errors.title}
                />
              </Field>

              <Field
                label="Description"
                error={errors.description}
                className="mt-4"
              >
                <textarea
                  name="description"
                  value={scheduleForm.description}
                  onChange={handleScheduleInput}
                  placeholder="Optional notes visible to the candidate…"
                  rows={3}
                  maxLength={1000}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 resize-none transition bg-slate-50/50"
                />
                <p className="text-right text-xs text-slate-400 mt-1">
                  {(scheduleForm.description ?? "").length} / 1000
                </p>
              </Field>

              <div className="mt-4">
                <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">
                  Format
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {(["ONLINE", "OFFLINE"] as const).map((m) => {
                    const active = scheduleForm.mode === m;
                    return (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setScheduleField("mode", m)}
                        className={`relative flex items-center gap-3 p-3.5 rounded-xl border-2 text-left transition-all ${
                          active
                            ? "border-blue-500 bg-blue-50/60"
                            : "border-slate-200 hover:border-slate-300 bg-white"
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${active ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-400"}`}
                        >
                          {m === "ONLINE" ? (
                            <Video size={15} />
                          ) : (
                            <MapPin size={15} />
                          )}
                        </div>
                        <div>
                          <p
                            className={`text-sm font-semibold ${active ? "text-blue-700" : "text-slate-700"}`}
                          >
                            {m === "ONLINE" ? "Online" : "In-person"}
                          </p>
                          <p className="text-xs text-slate-400">
                            {m === "ONLINE"
                              ? "Video or phone call"
                              : "Physical location"}
                          </p>
                        </div>
                        {active && (
                          <div className="absolute top-2 right-2 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                            <CheckCircle2 size={10} className="text-white" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {scheduleForm.mode === "OFFLINE" && (
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <Field label="Address" error={errors.location} required>
                    <Input
                      name="location"
                      value={scheduleForm.location ?? ""}
                      onChange={handleScheduleInput}
                      placeholder="Floor 3, Tech Park"
                      error={!!errors.location}
                    />
                  </Field>
                  <Field label="Meeting room" error={errors.roomId}>
                    <Input
                      name="roomId"
                      value={scheduleForm.roomId ?? ""}
                      onChange={handleScheduleInput}
                      placeholder="Conference Room A"
                      error={!!errors.roomId}
                    />
                  </Field>
                </div>
              )}
            </StepPanel>
          )}

          {((!isReschedule && step === 2) || (isReschedule && step === 0)) && (
            <StepPanel
              title={isReschedule ? "Pick a new time" : "Pick a time"}
              subtitle="Times are stored in UTC and shown in the candidate's local timezone."
            >
              {isReschedule && detailsLoading && (
                <div className="mb-5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 flex items-center gap-2.5">
                  <Loader2
                    size={14}
                    className="text-slate-400 animate-spin shrink-0"
                  />
                  <p className="text-xs text-slate-500">
                    Loading the latest interview details…
                  </p>
                </div>
              )}

              {isReschedule && detailsError && !detailsLoading && (
                <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 flex items-start gap-2.5">
                  <AlertCircle
                    size={14}
                    className="text-amber-500 shrink-0 mt-0.5"
                  />
                  <p className="text-xs text-amber-700">
                    Couldn't refresh the latest interview details (
                    {detailsError}). Showing the last known values — double
                    check the format below before continuing.
                  </p>
                </div>
              )}

              {isReschedule && !detailsLoading && (
                <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 flex items-start gap-2.5">
                  <AlertCircle
                    size={14}
                    className="text-amber-500 shrink-0 mt-0.5"
                  />
                  <p className="text-xs text-amber-700">
                    You're rescheduling{" "}
                    <span className="font-semibold">{displayTitle}</span> (Round{" "}
                    {displayRound}). The interview format (
                    {activeMode === "ONLINE" ? "Online" : "In-person"}) can't be
                    changed here — cancel and create a new interview instead if
                    the format needs to change.
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <Field
                  label="Date"
                  error={errors.date}
                  required
                  icon={<Calendar size={14} />}
                >
                  <Input
                    name="date"
                    type="date"
                    value={activeDate}
                    onChange={
                      isReschedule ? handleRescheduleInput : handleScheduleInput
                    }
                    error={!!errors.date}
                    min={todayStr}
                  />
                </Field>

                <Field
                  label="Time"
                  error={errors.hour}
                  icon={<Clock size={14} />}
                >
                  <div className="flex items-center gap-2">
                    <Select
                      name="hour"
                      value={activeHour}
                      onChange={
                        isReschedule
                          ? handleRescheduleInput
                          : handleScheduleInput
                      }
                      className="flex-1"
                    >
                      {Array.from({ length: 24 }, (_, i) =>
                        i.toString().padStart(2, "0"),
                      ).map((h) => (
                        <option key={h} value={h}>
                          {h}
                        </option>
                      ))}
                    </Select>
                    <span className="text-slate-400 font-semibold text-sm select-none">
                      :
                    </span>
                    <Select
                      name="minute"
                      value={activeMinute}
                      onChange={
                        isReschedule
                          ? handleRescheduleInput
                          : handleScheduleInput
                      }
                      className="flex-1"
                    >
                      {Array.from({ length: 12 }, (_, index) =>
                        String(index * 5).padStart(2, "0"),
                      ).map((minute) => (
                        <option key={minute} value={minute}>
                          {minute}
                        </option>
                      ))}
                    </Select>
                  </div>
                </Field>
              </div>

              <Field
                label="Duration"
                required
                icon={<Clock size={14} />}
                className="mt-4"
              >
                <div className="flex flex-wrap gap-2">
                  {DURATIONS.map((d) => (
                    <button
                      key={d.value}
                      type="button"
                      onClick={() =>
                        isReschedule
                          ? setRescheduleField("durationInMinutes", d.value)
                          : setScheduleField("durationInMinutes", d.value)
                      }
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        activeDuration === d.value
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-slate-200 text-slate-600 hover:border-slate-300 bg-white"
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </Field>

              {isReschedule && activeMode === "ONLINE" && (
                <MeetingLinkPicker
                  value={rescheduleForm.meetingLinkOption}
                  meetingLink={rescheduleForm.meetingLink ?? ""}
                  error={errors.meetingLink}
                  onOptionChange={(v) =>
                    setRescheduleField("meetingLinkOption", v)
                  }
                  onLinkChange={(v) => setRescheduleField("meetingLink", v)}
                />
              )}

              {isReschedule && activeMode === "OFFLINE" && (
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <Field label="Address" error={errors.location} required>
                    <Input
                      name="location"
                      value={rescheduleForm.location ?? ""}
                      onChange={handleRescheduleInput}
                      placeholder="Floor 3, Tech Park"
                      error={!!errors.location}
                    />
                  </Field>
                  <Field label="Meeting room" error={errors.roomId}>
                    <Input
                      name="roomId"
                      value={rescheduleForm.roomId ?? ""}
                      onChange={handleRescheduleInput}
                      placeholder="Conference Room A"
                      error={!!errors.roomId}
                    />
                  </Field>
                </div>
              )}

              {previewDate && (
                <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                    <Calendar size={15} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-blue-500 font-medium">
                      {isReschedule ? "New time" : "Scheduled for"}
                    </p>
                    <p className="text-sm font-semibold text-blue-800">
                      {previewDate}
                    </p>
                  </div>
                </div>
              )}
            </StepPanel>
          )}

          {step === lastStep && (
            <StepPanel
              title={isReschedule ? "Review and confirm" : "Review and confirm"}
              subtitle={
                isReschedule
                  ? "Double-check the new time before updating the interview."
                  : "Double-check everything before sending the invite."
              }
            >
              <div className="rounded-xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
                {[
                  {
                    label: "Candidate",
                    value:
                      candidateName ||
                      (isReschedule ? "—" : scheduleForm.applicationId),
                    icon: <Users size={14} className="text-slate-400" />,
                  },
                  {
                    label: "Title",
                    value: displayTitle || "—",
                    icon: <FileText size={14} className="text-slate-400" />,
                  },
                  {
                    label: "Round",
                    value: `Round ${displayRound}`,
                    icon: <Hash size={14} className="text-slate-400" />,
                  },
                  {
                    label: isReschedule ? "New date & time" : "Date & time",
                    value: previewDate ?? "—",
                    icon: <Calendar size={14} className="text-slate-400" />,
                  },
                  {
                    label: "Duration",
                    value: durationLabel,
                    icon: <Clock size={14} className="text-slate-400" />,
                  },
                  {
                    label: "Format",
                    value: activeMode === "ONLINE" ? "Online" : "In-person",
                    icon:
                      activeMode === "ONLINE" ? (
                        <Video size={14} className="text-slate-400" />
                      ) : (
                        <MapPin size={14} className="text-slate-400" />
                      ),
                  },
                  ...(activeMode === "OFFLINE" && activeLocation
                    ? [
                        {
                          label: "Location",
                          value: activeLocation,
                          icon: <MapPin size={14} className="text-slate-400" />,
                        },
                      ]
                    : []),
                  ...(activeMode === "OFFLINE" && activeMeetingRoom
                    ? [
                        {
                          label: "Room",
                          value: activeMeetingRoom,
                          icon: (
                            <Building2 size={14} className="text-slate-400" />
                          ),
                        },
                      ]
                    : []),
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex items-start gap-3 px-4 py-3"
                  >
                    <span className="mt-0.5 shrink-0">{row.icon}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-slate-400">{row.label}</p>
                      <p className="text-sm font-medium text-slate-800 truncate">
                        {row.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {!isReschedule && (
                <div className="mt-4 flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() =>
                      setScheduleField("sendEmail", !scheduleForm.sendEmail)
                    }
                    className={`w-10 h-6 rounded-full transition-colors shrink-0 relative ${scheduleForm.sendEmail ? "bg-blue-600" : "bg-slate-300"}`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${scheduleForm.sendEmail ? "translate-x-4" : "translate-x-0"}`}
                    />
                  </button>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-700">
                      Send invite to candidate
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      An email with all interview details will be sent
                      immediately.
                    </p>
                  </div>
                  <Mail
                    size={16}
                    className={`shrink-0 ${scheduleForm.sendEmail ? "text-blue-400" : "text-slate-300"}`}
                  />
                </div>
              )}

              {hasErrors && (
                <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-red-600 mb-2">
                    <AlertCircle size={14} />
                    <p className="text-xs font-semibold">
                      Fix these before{" "}
                      {isReschedule ? "rescheduling" : "scheduling"}
                    </p>
                  </div>
                  <ul className="space-y-1">
                    {Object.values(errors)
                      .filter(Boolean)
                      .map((msg, i) => (
                        <li key={i} className="text-xs text-red-500">
                          · {msg}
                        </li>
                      ))}
                  </ul>
                </div>
              )}

              {submitSuccess && (
                <div className="mt-4 flex items-start gap-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl px-4 py-3">
                  <CheckCircle2
                    size={16}
                    className="shrink-0 mt-0.5 text-emerald-600"
                  />
                  <div>
                    <p className="text-sm font-semibold">
                      {isReschedule
                        ? "Interview rescheduled successfully"
                        : "Interview scheduled successfully"}
                    </p>
                    {!isReschedule && scheduleForm.sendEmail && (
                      <p className="text-xs text-emerald-600 mt-0.5">
                        Invitation sent to {candidateEmail || "the candidate"}.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </StepPanel>
          )}
        </div>

        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
          <button
            type="button"
            onClick={step === 0 ? handleClose : prevStep}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {step === 0 ? "Cancel" : "← Back"}
          </button>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`rounded-full transition-all ${
                    i === step
                      ? "w-4 h-1.5 bg-blue-600"
                      : i < step
                        ? "w-1.5 h-1.5 bg-blue-300"
                        : "w-1.5 h-1.5 bg-slate-200"
                  }`}
                />
              ))}
            </div>

            {step < lastStep ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={loading || (step === 0 && missingApplicationContext)}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm flex items-center gap-2 transition-colors shadow-sm shadow-blue-200 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue
                <ArrowRight size={14} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading || submitSuccess}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-sm flex items-center gap-2 transition-colors shadow-sm shadow-blue-200 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />{" "}
                    {isReschedule ? "Rescheduling…" : "Scheduling…"}
                  </>
                ) : submitSuccess ? (
                  <>
                    <CheckCircle2 size={14} />{" "}
                    {isReschedule ? "Rescheduled!" : "Scheduled!"}
                  </>
                ) : isReschedule ? (
                  "Reschedule Interview"
                ) : (
                  "Schedule Interview"
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StepPanel({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

function Field({
  label,
  error,
  required,
  children,
  className = "",
  icon,
}: {
  label?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className={className}>
      {label && (
        <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">
          {icon && <span className="text-slate-400">{icon}</span>}
          {label}
          {required && <span className="text-red-400 font-bold">*</span>}
        </label>
      )}
      {children}
      {error && (
        <p className="flex items-center gap-1 text-xs text-red-500 mt-1.5">
          <AlertCircle size={11} />
          {error}
        </p>
      )}
    </div>
  );
}

function Input({
  error,
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { error?: boolean }) {
  return (
    <input
      {...props}
      className={`w-full px-3.5 py-2.5 border rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition bg-white ${
        error
          ? "border-red-300 bg-red-50/30 focus:ring-red-400/20 focus:border-red-400"
          : "border-slate-200 hover:border-slate-300"
      } ${className}`}
    />
  );
}

function Select({
  className = "",
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <select
        {...props}
        className="w-full appearance-none px-3.5 py-2.5 border border-slate-200 hover:border-slate-300 rounded-xl text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition pr-8 cursor-pointer"
      >
        {children}
      </select>
      <ChevronDown
        size={13}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
      />
    </div>
  );
}

function InfoBadge({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5">
      <span className="text-slate-400 shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
          {label}
        </p>
        <p className="text-sm font-semibold text-slate-700 truncate">{value}</p>
      </div>
    </div>
  );
}

const STATUS_STYLES: Record<string, { bg: string; text: string; dot: string }> =
  {
    SHORTLISTED: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      dot: "bg-blue-500",
    },
    APPLIED: {
      bg: "bg-slate-100",
      text: "text-slate-600",
      dot: "bg-slate-400",
    },
    INTERVIEWING: {
      bg: "bg-violet-50",
      text: "text-violet-700",
      dot: "bg-violet-500",
    },
    OFFERED: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      dot: "bg-emerald-500",
    },
    HIRED: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      dot: "bg-emerald-500",
    },
    REJECTED: { bg: "bg-red-50", text: "text-red-600", dot: "bg-red-400" },
    WITHDRAWN: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      dot: "bg-amber-400",
    },
  };

function StatusBadge({ status }: { status: string }) {
  const key = status.toUpperCase().replace(/\s+/g, "_");
  const style = STATUS_STYLES[key] ?? {
    bg: "bg-slate-100",
    text: "text-slate-600",
    dot: "bg-slate-400",
  };
  const label =
    status.charAt(0).toUpperCase() +
    status.slice(1).toLowerCase().replace(/_/g, " ");

  return (
    <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5">
      <span className="text-slate-400 shrink-0">
        <CheckCircle2 size={13} />
      </span>
      <div className="min-w-0">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
          Status
        </p>
        <span
          className={`inline-flex items-center gap-1.5 mt-0.5 px-2 py-0.5 rounded-full text-xs font-semibold ${style.bg} ${style.text}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${style.dot}`} />
          {label}
        </span>
      </div>
    </div>
  );
}

function MeetingLinkPicker({
  value,
  meetingLink,
  error,
  onOptionChange,
  onLinkChange,
}: {
  value: "later" | "paste";
  meetingLink: string;
  error?: string;
  onOptionChange: (v: "later" | "paste") => void;
  onLinkChange: (v: string) => void;
}) {
  return (
    <div className="mt-4 space-y-2">
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide">
        Meeting link
      </label>
      {[
        {
          value: "later" as const,
          icon: <CalendarClock size={13} />,
          label: "I'll add the link later",
          sub: "You can paste the URL before the interview",
        },
        {
          value: "paste" as const,
          icon: <Link2 size={13} />,
          label: "Paste link now",
          sub: "Use your own meeting URL",
        },
      ].map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onOptionChange(opt.value)}
          className={`flex items-center gap-3 p-3 rounded-xl border w-full text-left transition-all ${
            value === opt.value
              ? "border-blue-400 bg-blue-50/50"
              : "border-slate-200 hover:border-slate-300 bg-white"
          }`}
        >
          <div
            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
              value === opt.value
                ? "border-blue-600 bg-blue-600"
                : "border-slate-300"
            }`}
          >
            {value === opt.value && (
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
            )}
          </div>
          <span
            className={value === opt.value ? "text-blue-500" : "text-slate-400"}
          >
            {opt.icon}
          </span>
          <div>
            <p
              className={`text-sm font-medium ${value === opt.value ? "text-blue-700" : "text-slate-700"}`}
            >
              {opt.label}
            </p>
            <p className="text-xs text-slate-400">{opt.sub}</p>
          </div>
        </button>
      ))}

      {value === "paste" && (
        <Field error={error} className="mt-2">
          <Input
            name="meetingLink"
            value={meetingLink}
            onChange={(e) => onLinkChange(e.target.value)}
            placeholder="https://meet.google.com/…"
            error={!!error}
          />
        </Field>
      )}
    </div>
  );
}
