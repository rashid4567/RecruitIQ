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

const PRIMARY_DURATIONS = [
  { label: "30 min", value: 30 },
  { label: "45 min", value: 45 },
  { label: "1 hour", value: 60 },
  { label: "1.5 hours", value: 90 },
];

const TIME_GROUPS: { label: string; slots: [string, string][] }[] = [
  {
    label: "Morning",
    slots: [
      ["09", "00"],
      ["09", "30"],
      ["10", "00"],
      ["10", "30"],
      ["11", "00"],
      ["11", "30"],
    ],
  },
  {
    label: "Afternoon",
    slots: [
      ["12", "00"],
      ["12", "30"],
      ["13", "00"],
      ["13", "30"],
      ["14", "00"],
      ["14", "30"],
      ["15", "00"],
      ["15", "30"],
      ["16", "00"],
      ["16", "30"],
    ],
  },
  {
    label: "Evening",
    slots: [
      ["17", "00"],
      ["17", "30"],
      ["18", "00"],
      ["18", "30"],
    ],
  },
];

// Minimum lead time between "now" and the interview start. Keeps recruiters
// from scheduling something that's already effectively in the past.
const MIN_LEAD_MINUTES = 5;

function formatTimeLabel(hour: string, minute: string) {
  const d = new Date();
  d.setHours(Number(hour), Number(minute), 0, 0);
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function parseScheduledDateTime(
  date: string,
  hour: string,
  minute: string,
): Date | null {
  if (!date || !hour || !minute) return null;
  const d = new Date(
    `${date}T${hour.padStart(2, "0")}:${minute.padStart(2, "0")}:00`,
  );
  return Number.isNaN(d.getTime()) ? null : d;
}

/**
 * Returns a human-readable error if the given date/time is in the past or
 * inside the minimum lead-time window, otherwise undefined.
 */
function getScheduleTimeError(
  date: string,
  hour: string,
  minute: string,
): string | undefined {
  const start = parseScheduledDateTime(date, hour, minute);
  if (!start) return undefined;

  const now = Date.now();
  if (start.getTime() < now) {
    return "This time has already passed. Please choose a future date and time.";
  }

  const minAllowed = now + MIN_LEAD_MINUTES * 60 * 1000;
  if (start.getTime() < minAllowed) {
    return `Please choose a time at least ${MIN_LEAD_MINUTES} minutes from now.`;
  }

  return undefined;
}

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
  const [showMoreDurations, setShowMoreDurations] = useState(false);
  const [showCustomTime, setShowCustomTime] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
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
    setShowMoreDurations(false);
    setShowCustomTime(false);
    setShowDatePicker(false);

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

  function setTime(hour: string, minute: string) {
    if (isReschedule) {
      setRescheduleField("hour", hour);
      setRescheduleField("minute", minute);
    } else {
      setScheduleField("hour", hour);
      setScheduleField("minute", minute);
    }
  }

  function setDate(value: string) {
    if (isReschedule) setRescheduleField("date", value);
    else setScheduleField("date", value);
  }

  function handleCustomTimeChange(value: string) {
    const [hour, minute] = value.split(":");
    if (!hour || !minute) return;
    setTime(hour, minute);
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

  // Which step index holds the date/time picker, per flow.
  const dateTimeStepIndex = isReschedule ? 0 : 2;

  const timeWindowError = useMemo(
    () => getScheduleTimeError(activeDate, activeHour, activeMinute),
    [activeDate, activeHour, activeMinute],
  );

  function validateStep(s: number): Record<string, string | undefined> {
    let errs: Record<string, string | undefined> = {};

    if (isReschedule) {
      const parsed = rescheduleInterviewSchema.safeParse(rescheduleForm);
      if (!parsed.success) {
        const relevant = new Set<string>(rescheduleStepFields[s] ?? []);
        for (const issue of parsed.error.issues) {
          const key = issue.path[0] as string;
          if (relevant.has(key) && !errs[key]) errs[key] = issue.message;
        }
      }
    } else {
      const parsed = scheduleInterviewSchema.safeParse(scheduleForm);
      if (!parsed.success) {
        const relevant = new Set<string>(scheduleStepFields[s] ?? []);
        for (const issue of parsed.error.issues) {
          const key = issue.path[0] as string;
          if (relevant.has(key) && !errs[key]) errs[key] = issue.message;
        }
      }
    }

    // Layer on the "not in the past / min lead time" check for the
    // date & time step — schema validation alone doesn't know "now".
    if (s === dateTimeStepIndex && timeWindowError) {
      errs = { ...errs, scheduledAt: timeWindowError };
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
      if (!parsed.success || timeWindowError) {
        const fieldErrors: Record<string, string | undefined> = {};
        if (!parsed.success) {
          for (const issue of parsed.error.issues) {
            const key = issue.path[0] as string;
            if (!fieldErrors[key]) fieldErrors[key] = issue.message;
          }
        }
        if (timeWindowError) fieldErrors.scheduledAt = timeWindowError;
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
    if (!parsed.success || timeWindowError) {
      const fieldErrors: Record<string, string | undefined> = {};
      if (!parsed.success) {
        for (const issue of parsed.error.issues) {
          const key = issue.path[0] as string;
          if (!fieldErrors[key]) fieldErrors[key] = issue.message;
        }
      }
      if (timeWindowError) fieldErrors.scheduledAt = timeWindowError;
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

  const quickDates = useMemo(() => {
    return Array.from({ length: 4 }, (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() + index);
      return {
        value: date.toLocaleDateString("en-CA"),
        day:
          index === 0
            ? "Today"
            : index === 1
              ? "Tomorrow"
              : date.toLocaleDateString("en-US", { weekday: "short" }),
        dateNum: date.getDate(),
      };
    });
  }, []);

  const isQuickDate = quickDates.some((d) => d.value === activeDate);
  const isSlotTime = TIME_GROUPS.some((g) =>
    g.slots.some(([h, m]) => h === activeHour && m === activeMinute),
  );
  const isPrimaryDuration = PRIMARY_DURATIONS.some(
    (d) => d.value === activeDuration,
  );
  const customTimePanelOpen = showCustomTime || !isSlotTime;
  const durationPanelOpen = showMoreDurations || !isPrimaryDuration;
  const datePickerOpen =
    showDatePicker || (Boolean(activeDate) && !isQuickDate);

  const schedulePreview = useMemo(() => {
    if (!activeDate) return null;
    const start = new Date(
      `${activeDate}T${activeHour.padStart(2, "0")}:${activeMinute.padStart(2, "0")}:00`,
    );
    if (Number.isNaN(start.getTime())) return null;
    const end = new Date(start.getTime() + activeDuration * 60 * 1000);

    return {
      full: start.toLocaleString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      date: start.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      }),
      start: start.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }),
      end: end.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }),
    };
  }, [activeDate, activeHour, activeMinute, activeDuration]);

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
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/60 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="flex h-[95dvh] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:h-auto sm:max-h-[90dvh] sm:w-full sm:max-w-2xl sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-600">
              {isReschedule ? (
                <RefreshCw size={13} className="text-white" />
              ) : (
                <span className="text-xs font-bold text-white">R</span>
              )}
            </div>
            <span className="truncate text-sm font-semibold text-slate-900">
              {isReschedule ? "Reschedule Interview" : "Schedule Interview"}
            </span>
            {candidateName && (
              <>
                <span className="hidden text-slate-300 min-[400px]:inline">
                  ·
                </span>
                <span className="hidden truncate text-sm text-slate-500 min-[400px]:inline">
                  {candidateName}
                </span>
              </>
            )}
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-4 pb-0 pt-4 sm:px-6 sm:pt-5">
          <div className="sm:hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-blue-600">
                  Step {step + 1} of {STEPS.length}
                </p>
                <p className="mt-0.5 text-sm font-semibold text-slate-900">
                  {STEPS[step]}
                </p>
              </div>
              <span className="text-xs text-slate-400">
                {Math.round(((step + 1) / STEPS.length) * 100)}%
              </span>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-blue-600 transition-all"
                style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Full labeled stepper — sm and up */}
          <div className="hidden items-center gap-0 sm:flex">
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

        <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6">
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
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3">
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
                <div className="grid grid-cols-1 gap-2.5 min-[400px]:grid-cols-2 sm:gap-3">
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
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field
                    label="Address"
                    error={errors.location}
                    required
                    className="sm:col-span-2"
                  >
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
              title={isReschedule ? "Pick a new time" : "Pick a date & time"}
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

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">
                  Select date
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {quickDates.map((item) => {
                    const selected = activeDate === item.value;
                    return (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => {
                          setDate(item.value);
                          setShowDatePicker(false);
                        }}
                        className={`flex min-h-16 flex-col items-center justify-center rounded-xl border transition-all ${
                          selected
                            ? "border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-100"
                            : "border-slate-200 bg-white text-slate-600 hover:border-blue-300"
                        }`}
                      >
                        <span className="text-[10px] font-semibold uppercase">
                          {item.day}
                        </span>
                        <span className="mt-1 text-lg font-bold">
                          {item.dateNum}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {!datePickerOpen && (
                  <button
                    type="button"
                    onClick={() => setShowDatePicker(true)}
                    className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700"
                  >
                    <Calendar size={13} />
                    Choose another date
                  </button>
                )}

                {datePickerOpen && (
                  <div className="mt-3">
                    <Field
                      label="Choose another date"
                      error={errors.date}
                      icon={<Calendar size={14} />}
                    >
                      <Input
                        name="date"
                        type="date"
                        value={activeDate}
                        onChange={(e) => setDate(e.target.value)}
                        min={todayStr}
                        error={!!errors.date}
                      />
                    </Field>
                  </div>
                )}
              </div>

              <div className="mt-5">
                <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">
                  Select time
                </label>
                <div className="space-y-4">
                  {TIME_GROUPS.map((group) => (
                    <div key={group.label}>
                      <p className="mb-1.5 text-xs font-semibold text-slate-400">
                        {group.label}
                      </p>
                      <div className="grid grid-cols-2 gap-2 min-[400px]:grid-cols-3 sm:grid-cols-4">
                        {group.slots.map(([h, m]) => {
                          const selected =
                            activeHour === h && activeMinute === m;
                          return (
                            <button
                              key={`${h}-${m}`}
                              type="button"
                              onClick={() => {
                                setTime(h, m);
                                setShowCustomTime(false);
                              }}
                              className={`min-h-11 rounded-xl border px-3 py-2 text-sm font-semibold transition-all ${
                                selected
                                  ? "border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-100"
                                  : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:bg-blue-50/40"
                              }`}
                            >
                              {formatTimeLabel(h, m)}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {!customTimePanelOpen ? (
                  <button
                    type="button"
                    onClick={() => setShowCustomTime(true)}
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700"
                  >
                    <Clock size={13} />
                    Can't find your time? Choose custom time
                  </button>
                ) : (
                  <div className="mt-3">
                    <Field
                      label="Custom time"
                      error={errors.hour}
                      icon={<Clock size={14} />}
                    >
                      <Input
                        type="time"
                        step={300}
                        value={`${activeHour}:${activeMinute}`}
                        onChange={(e) => handleCustomTimeChange(e.target.value)}
                      />
                    </Field>
                  </div>
                )}

                {timeWindowError && (
                  <p className="flex items-center gap-1.5 mt-3 text-xs font-medium text-red-600">
                    <AlertCircle size={12} className="shrink-0" />
                    {timeWindowError}
                  </p>
                )}
              </div>

              {/* Duration */}
              <div className="mt-5">
                <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">
                  Duration
                </label>
                <div className="flex flex-wrap gap-2">
                  {PRIMARY_DURATIONS.map((d) => (
                    <button
                      key={d.value}
                      type="button"
                      onClick={() => {
                        isReschedule
                          ? setRescheduleField("durationInMinutes", d.value)
                          : setScheduleField("durationInMinutes", d.value);
                        setShowMoreDurations(false);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        activeDuration === d.value
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-slate-200 text-slate-600 hover:border-slate-300 bg-white"
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setShowMoreDurations((v) => !v)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border border-dashed border-slate-300 text-slate-500 hover:border-slate-400 hover:text-slate-700 transition-all"
                  >
                    More
                    <ChevronDown
                      size={12}
                      className={`transition-transform ${durationPanelOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                </div>

                {durationPanelOpen && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {DURATIONS.filter(
                      (d) =>
                        !PRIMARY_DURATIONS.some((p) => p.value === d.value),
                    ).map((d) => (
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
                )}
              </div>

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
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field
                    label="Address"
                    error={errors.location}
                    required
                    className="sm:col-span-2"
                  >
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

              {schedulePreview &&
                (timeWindowError ? (
                  <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
                        <AlertCircle size={18} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-red-500">
                          Invalid time selected
                        </p>
                        <p className="mt-1 text-sm font-bold text-red-700">
                          {timeWindowError}
                        </p>
                        <p className="mt-1 text-xs text-red-400">
                          {schedulePreview.date} · {schedulePreview.start} –{" "}
                          {schedulePreview.end}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                        <CalendarClock size={18} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-blue-500">
                          {isReschedule
                            ? "New interview time"
                            : "Interview scheduled for"}
                        </p>
                        <p className="mt-1 text-sm font-bold text-slate-900">
                          {schedulePreview.date}
                        </p>
                        <p className="mt-0.5 text-sm font-semibold text-blue-700">
                          {schedulePreview.start} – {schedulePreview.end}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {durationLabel} ·{" "}
                          {activeMode === "ONLINE"
                            ? "Online interview"
                            : "In-person interview"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
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
                    value: schedulePreview
                      ? `${schedulePreview.date} · ${schedulePreview.start} – ${schedulePreview.end}`
                      : "—",
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

        <div className="shrink-0 border-t border-slate-100 bg-white px-3 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:bg-slate-50/50 sm:px-6 sm:py-4">
          <div className="flex items-center gap-2 sm:justify-between">
            <button
              type="button"
              onClick={step === 0 ? handleClose : prevStep}
              disabled={loading}
              className="shrink-0 px-4 py-2.5 sm:py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {step === 0 ? "Cancel" : "← Back"}
            </button>

            <div className="hidden items-center gap-1 sm:flex">
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
                disabled={
                  loading ||
                  (step === 0 && missingApplicationContext) ||
                  (step === dateTimeStepIndex && Boolean(timeWindowError))
                }
                className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm shadow-blue-200 transition-colors hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed sm:flex-none sm:min-h-0 sm:py-2 sm:font-medium"
              >
                Continue
                <ArrowRight size={14} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading || submitSuccess || Boolean(timeWindowError)}
                className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm shadow-blue-200 transition-colors hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed sm:flex-none sm:min-h-0 sm:py-2"
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