'use client';

import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import {
  X,
  Copy,
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
} from 'lucide-react';
import { useScheduleInterview } from '../../hooks/recruiter/useScheduleInterview';
import { InterviewMode } from '../../types/interview.types';

// ─── Zod schema ────────────────────────────────────────────────────────────────

export const scheduleInterviewSchema = z
  .object({
    applicationId: z.string().min(1, 'Application ID is required'),
    round: z
      .coerce.number({ error: 'Round must be a number' })
      .int('Round must be a whole number')
      .min(1, 'Round must be at least 1')
      .max(10, 'Round cannot exceed 10'),
    title: z
      .string()
      .min(3, 'Title must be at least 3 characters')
      .max(120, 'Title must be under 120 characters'),
    description: z
      .string()
      .max(1000, 'Description must be under 1000 characters')
      .optional(),
    mode: z.enum(['ONLINE', 'OFFLINE'], {
      error: 'Please select an interview mode',
    }),
    date: z.string().min(1, 'Date is required'),
    hour: z.string().min(1, 'Hour is required'),
    minute: z.string().min(1, 'Minute is required'),
    durationInMinutes: z
      .coerce.number({ error: 'Duration is required' })
      .min(15, 'Minimum duration is 15 minutes')
      .max(480, 'Maximum duration is 8 hours'),
    location: z.string().max(200, 'Location must be under 200 characters').optional(),
    meetingRoom: z.string().max(100, 'Meeting room must be under 100 characters').optional(),
    // 'later' replaces the old 'auto' — backend generates the link on its own schedule
    meetingLinkOption: z.enum(['later', 'paste']),
    meetingLink: z.string().optional(),
    sendEmail: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (data.mode === 'ONLINE' && data.meetingLinkOption === 'paste') {
      if (!data.meetingLink || data.meetingLink.trim() === '') {
        ctx.addIssue({ path: ['meetingLink'], code: z.ZodIssueCode.custom, message: 'Meeting link is required' });
      } else {
        try { new URL(data.meetingLink); } catch {
          ctx.addIssue({ path: ['meetingLink'], code: z.ZodIssueCode.custom, message: 'Please enter a valid URL' });
        }
      }
    }
    if (data.mode === 'OFFLINE' && (!data.location || data.location.trim() === '')) {
      ctx.addIssue({ path: ['location'], code: z.ZodIssueCode.custom, message: 'Location is required for in-person interviews' });
    }
    if (data.date && data.hour && data.minute) {
      const selected = new Date(`${data.date}T${data.hour.padStart(2, '0')}:${data.minute.padStart(2, '0')}:00`);
      const cutoff = new Date();
      cutoff.setMinutes(cutoff.getMinutes() + 5); // 5-minute buffer
      if (!isNaN(selected.getTime()) && selected <= cutoff) {
        ctx.addIssue({ path: ['date'], code: z.ZodIssueCode.custom, message: 'Interview must be at least 5 minutes from now' });
      }
    }
  });

type FormValues = z.infer<typeof scheduleInterviewSchema>;
type FieldErrors = Partial<Record<keyof FormValues, string>>;

// ─── constants ─────────────────────────────────────────────────────────────────

const DURATIONS = [
  { label: '15 min', value: 15 },
  { label: '30 min', value: 30 },
  { label: '45 min', value: 45 },
  { label: '1 hour', value: 60 },
  { label: '75 min', value: 75 },
  { label: '1.5 hours', value: 90 },
  { label: '2 hours', value: 120 },
  { label: '150 min', value: 150 },
  { label: '3 hours', value: 180 },
];

const STEPS = ['Candidate', 'Details', 'Schedule', 'Confirm'] as const;
type Step = 0 | 1 | 2 | 3;

// ─── props ─────────────────────────────────────────────────────────────────────

interface ScheduleInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicationId?: string;
  candidateName?: string;
  candidateEmail?: string;
  jobTitle?: string;
  applicationStatus?: string;
  onSuccess?: () => void;
}

// ─── helpers ───────────────────────────────────────────────────────────────────

function buildInitialForm(applicationId: string, jobTitle: string): FormValues {
  return {
    applicationId,
    round: 1,
    title: jobTitle ? `${jobTitle} — Round 1` : '',
    description: '',
    mode: 'ONLINE',
    date: '',
    hour: '10',
    minute: '00',
    durationInMinutes: 60,
    location: '',
    meetingRoom: '',
    meetingLinkOption: 'later',
    meetingLink: '',
    sendEmail: true,
  };
}

// ─── component ─────────────────────────────────────────────────────────────────

export default function ScheduleInterviewModal({
  isOpen,
  onClose,
  applicationId = '',
  candidateName = '',
  candidateEmail = '',
  jobTitle = '',
  applicationStatus = '',
  onSuccess,
}: ScheduleInterviewModalProps) {
  const { submit, loading } = useScheduleInterview();

  const [step, setStep] = useState<Step>(0);
  const [form, setForm] = useState<FormValues>(() => buildInitialForm(applicationId, jobTitle));
  const [errors, setErrors] = useState<FieldErrors>({});
  const [copied, setCopied] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Reset the entire form whenever the modal opens (or a different candidate is selected).
  // This is the single authoritative reset — handleClose no longer needs to duplicate it.
  useEffect(() => {
    if (isOpen) {
      setForm(buildInitialForm(applicationId, jobTitle));
      setErrors({});
      setStep(0);
      setSubmitSuccess(false);
    }
  }, [isOpen, applicationId, jobTitle]);

  // Fix 3: keep title in sync when the recruiter changes the round
  useEffect(() => {
    if (!jobTitle) return;
    setForm((prev) => ({
      ...prev,
      title: `${jobTitle} — Round ${prev.round}`,
    }));
  }, [jobTitle, form.round]);

  const handleClose = () => onClose();

  if (!isOpen) return null;

  // ── form helpers ──

  function set<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function handleInput(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    set(name as keyof FormValues, value as never);
  }

  // ── per-step validation (single source of truth — delegates to Zod) ──

  function validateStep(s: Step): FieldErrors {
    // Run the full schema and filter to the fields that belong to this step
    const parsed = scheduleInterviewSchema.safeParse(form);
    if (parsed.success) return {};

    const stepFields: Record<Step, Array<keyof FormValues>> = {
      0: ['applicationId'],
      1: ['title', 'mode', 'meetingLink', 'location'],
      2: ['date', 'hour', 'minute', 'durationInMinutes'],
      3: [], // final check runs handleSubmit's own safeParse
    };

    const relevant = new Set<string>(stepFields[s]);
    const errs: FieldErrors = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof FormValues;
      if (relevant.has(key) && !errs[key]) errs[key] = issue.message;
    }
    return errs;
  }

  function nextStep() {
    const errs = validateStep(step);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setStep((s) => Math.min(s + 1, 3) as Step);
  }

  function prevStep() {
    setErrors({});
    setStep((s) => Math.max(s - 1, 0) as Step);
  }

  async function handleSubmit() {
    const parsed = scheduleInterviewSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof FormValues;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    const { date, hour, minute } = form;
    const scheduledAt = new Date(
      `${date}T${hour.padStart(2, '0')}:${minute.padStart(2, '0')}:00`,
    ).toISOString();

    const result = await submit({
      applicationId: form.applicationId,
      round: form.round,
      title: form.title,
      description: form.description || undefined,
      mode: form.mode as InterviewMode,
      scheduledAt,
      durationInMinutes: form.durationInMinutes,
      location: form.mode === 'OFFLINE' ? form.location : undefined,
      meetingRoom: form.meetingRoom || undefined,
      meetingLink:
        form.mode === 'ONLINE' && form.meetingLinkOption === 'paste'
          ? form.meetingLink
          : undefined,
      sendEmail: form.sendEmail,
    });

    if (result) {
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        onSuccess?.();
        handleClose();
      }, 2000);
    }
  }

  function handleCopyLink() {
    if (!form.meetingLink) return;
    navigator.clipboard.writeText(form.meetingLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // ── derived ──

  const previewDate = form.date
    ? new Date(
        `${form.date}T${form.hour.padStart(2, '0')}:${form.minute.padStart(2, '0')}:00`,
      ).toLocaleString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null;

  const durationLabel =
    DURATIONS.find((d) => d.value === form.durationInMinutes)?.label ?? '—';

  const hasErrors = Object.keys(errors).length > 0;

  // ── today as YYYY-MM-DD for the date input's min ──
  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden max-h-[90vh]">

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">R</span>
            </div>
            <span className="font-semibold text-slate-900 text-sm">Schedule Interview</span>
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

        {/* ── Step indicator ── */}
        <div className="px-6 pt-5 pb-0">
          <div className="flex items-center gap-0">
            {STEPS.map((label, i) => {
              const isActive = i === step;
              const isDone = i < step;
              return (
                <React.Fragment key={label}>
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                      isDone ? 'bg-blue-600 text-white' :
                      isActive ? 'bg-blue-600 text-white ring-4 ring-blue-100' :
                      'bg-slate-100 text-slate-400'
                    }`}>
                      {isDone ? <CheckCircle2 size={13} /> : i + 1}
                    </div>
                    <span className={`text-xs font-medium ${isActive ? 'text-slate-900' : isDone ? 'text-slate-500' : 'text-slate-400'}`}>
                      {label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`flex-1 h-px mx-3 transition-colors ${i < step ? 'bg-blue-300' : 'bg-slate-200'}`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto px-6 py-5">

          {/* ── Step 0: Candidate summary ── */}
          {step === 0 && (
            <StepPanel
              title="Confirm the candidate"
              subtitle="Review the details below before setting up this interview."
            >
              <div className="grid grid-cols-2 gap-3">
                {candidateName && (
                  <InfoBadge icon={<Users size={13} />} label="Candidate" value={candidateName} />
                )}
                {candidateEmail && (
                  <InfoBadge icon={<Mail size={13} />} label="Email" value={candidateEmail} />
                )}
                {jobTitle && (
                  <InfoBadge icon={<Building2 size={13} />} label="Position" value={jobTitle} />
                )}
                {applicationStatus && (
                  <StatusBadge status={applicationStatus} />
                )}
              </div>

              {/* Round selector — surfaced here so recruiters set it early */}
              <div className="mt-5">
                <Field label="Round" error={errors.round} required icon={<Hash size={14} />}>
                  <div className="flex gap-2 flex-wrap">
                    {[1, 2, 3, 4, 5].map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => set('round', r)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                          form.round === r
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-slate-200 text-slate-600 hover:border-slate-300 bg-white'
                        }`}
                      >
                        Round {r}
                      </button>
                    ))}
                  </div>
                </Field>
              </div>
            </StepPanel>
          )}

          {/* ── Step 1: Details ── */}
          {step === 1 && (
            <StepPanel title="Interview details" subtitle="Set the title, format, and location for this interview.">
              <Field label="Interview title" error={errors.title} required>
                <Input
                  name="title"
                  value={form.title}
                  onChange={handleInput}
                  placeholder="e.g. Technical Interview — Round 1"
                  error={!!errors.title}
                />
              </Field>

              <Field label="Description" error={errors.description} className="mt-4">
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleInput}
                  placeholder="Optional notes visible to the candidate…"
                  rows={3}
                  maxLength={1000}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 resize-none transition bg-slate-50/50"
                />
                <p className="text-right text-xs text-slate-400 mt-1">
                  {(form.description ?? '').length} / 1000
                </p>
              </Field>

              {/* Mode */}
              <div className="mt-4">
                <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Format</label>
                <div className="grid grid-cols-2 gap-3">
                  {(['ONLINE', 'OFFLINE'] as const).map((m) => {
                    const active = form.mode === m;
                    return (
                      <button
                        key={m}
                        type="button"
                        onClick={() => set('mode', m)}
                        className={`relative flex items-center gap-3 p-3.5 rounded-xl border-2 text-left transition-all ${
                          active ? 'border-blue-500 bg-blue-50/60' : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${active ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                          {m === 'ONLINE' ? <Video size={15} /> : <MapPin size={15} />}
                        </div>
                        <div>
                          <p className={`text-sm font-semibold ${active ? 'text-blue-700' : 'text-slate-700'}`}>
                            {m === 'ONLINE' ? 'Online' : 'In-person'}
                          </p>
                          <p className="text-xs text-slate-400">
                            {m === 'ONLINE' ? 'Video or phone call' : 'Physical location'}
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

              {/* Online options */}
              {form.mode === 'ONLINE' && (
                <div className="mt-4 space-y-2">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide">Meeting link</label>
                  {[
                    {
                      value: 'later' as const,
                      icon: <CalendarClock size={13} />,
                      label: "I'll add the link later",
                      sub: 'You can paste the URL before the interview',
                    },
                    {
                      value: 'paste' as const,
                      icon: <Link2 size={13} />,
                      label: 'Paste link now',
                      sub: 'Use your own meeting URL',
                    },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => set('meetingLinkOption', opt.value)}
                      className={`flex items-center gap-3 p-3 rounded-xl border w-full text-left transition-all ${
                        form.meetingLinkOption === opt.value
                          ? 'border-blue-400 bg-blue-50/50'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                        form.meetingLinkOption === opt.value ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
                      }`}>
                        {form.meetingLinkOption === opt.value && (
                          <span className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </div>
                      <span className={form.meetingLinkOption === opt.value ? 'text-blue-500' : 'text-slate-400'}>
                        {opt.icon}
                      </span>
                      <div>
                        <p className={`text-sm font-medium ${form.meetingLinkOption === opt.value ? 'text-blue-700' : 'text-slate-700'}`}>
                          {opt.label}
                        </p>
                        <p className="text-xs text-slate-400">{opt.sub}</p>
                      </div>
                    </button>
                  ))}

                  {form.meetingLinkOption === 'paste' && (
                    <Field error={errors.meetingLink} className="mt-2">
                      <Input
                        name="meetingLink"
                        value={form.meetingLink ?? ''}
                        onChange={handleInput}
                        placeholder="https://meet.google.com/…"
                        error={!!errors.meetingLink}
                      />
                    </Field>
                  )}
                </div>
              )}

              {/* Offline fields */}
              {form.mode === 'OFFLINE' && (
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <Field label="Address" error={errors.location} required>
                    <Input
                      name="location"
                      value={form.location ?? ''}
                      onChange={handleInput}
                      placeholder="Floor 3, Tech Park"
                      error={!!errors.location}
                    />
                  </Field>
                  <Field label="Meeting room" error={errors.meetingRoom}>
                    <Input
                      name="meetingRoom"
                      value={form.meetingRoom ?? ''}
                      onChange={handleInput}
                      placeholder="Conference Room A"
                      error={!!errors.meetingRoom}
                    />
                  </Field>
                </div>
              )}
            </StepPanel>
          )}

          {/* ── Step 2: Schedule ── */}
          {step === 2 && (
            <StepPanel title="Pick a time" subtitle="Times are stored in UTC and shown in the candidate's local timezone.">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Date" error={errors.date} required icon={<Calendar size={14} />}>
                  <Input
                    name="date"
                    type="date"
                    value={form.date}
                    onChange={handleInput}
                    error={!!errors.date}
                    min={todayStr}
                  />
                </Field>

                <Field label="Time" error={errors.hour} icon={<Clock size={14} />}>
                  <div className="flex items-center gap-2">
                    <Select name="hour" value={form.hour} onChange={handleInput} className="flex-1">
                      {Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0')).map((h) => (
                        <option key={h} value={h}>{h}</option>
                      ))}
                    </Select>
                    <span className="text-slate-400 font-semibold text-sm select-none">:</span>
                    <Select name="minute" value={form.minute} onChange={handleInput} className="flex-1">
                      {['00', '15', '30', '45'].map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </Select>
                  </div>
                </Field>
              </div>

              <Field label="Duration" required icon={<Clock size={14} />} className="mt-4">
                <div className="flex flex-wrap gap-2">
                  {DURATIONS.map((d) => (
                    <button
                      key={d.value}
                      type="button"
                      onClick={() => set('durationInMinutes', d.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        form.durationInMinutes === d.value
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300 bg-white'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </Field>

              {previewDate && (
                <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar size={15} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-blue-500 font-medium">Scheduled for</p>
                    <p className="text-sm font-semibold text-blue-800">{previewDate}</p>
                  </div>
                </div>
              )}
            </StepPanel>
          )}

          {/* ── Step 3: Confirm ── */}
          {step === 3 && (
            <StepPanel title="Review and confirm" subtitle="Double-check everything before sending the invite.">

              <div className="rounded-xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
                {[
                  {
                    label: 'Candidate',
                    value: candidateName || form.applicationId,
                    icon: <Users size={14} className="text-slate-400" />,
                  },
                  {
                    label: 'Title',
                    value: form.title,
                    icon: <FileText size={14} className="text-slate-400" />,
                  },
                  {
                    label: 'Round',
                    value: `Round ${form.round}`,
                    icon: <Hash size={14} className="text-slate-400" />,
                  },
                  {
                    label: 'Date & time',
                    value: previewDate ?? '—',
                    icon: <Calendar size={14} className="text-slate-400" />,
                  },
                  {
                    label: 'Duration',
                    value: durationLabel,
                    icon: <Clock size={14} className="text-slate-400" />,
                  },
                  {
                    label: 'Format',
                    value: form.mode === 'ONLINE' ? 'Online' : 'In-person',
                    icon:
                      form.mode === 'ONLINE'
                        ? <Video size={14} className="text-slate-400" />
                        : <MapPin size={14} className="text-slate-400" />,
                  },
                  ...(form.mode === 'OFFLINE' && form.location
                    ? [{ label: 'Location', value: form.location, icon: <MapPin size={14} className="text-slate-400" /> }]
                    : []),
                  ...(form.mode === 'OFFLINE' && form.meetingRoom
                    ? [{ label: 'Room', value: form.meetingRoom, icon: <Building2 size={14} className="text-slate-400" /> }]
                    : []),
                ].map((row) => (
                  <div key={row.label} className="flex items-start gap-3 px-4 py-3">
                    <span className="mt-0.5 flex-shrink-0">{row.icon}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-slate-400">{row.label}</p>
                      <p className="text-sm font-medium text-slate-800 truncate">{row.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Meeting link preview (only when pasted) */}
              {form.mode === 'ONLINE' && form.meetingLinkOption === 'paste' && form.meetingLink && (
                <div className="mt-4 bg-slate-50 rounded-xl border border-slate-200 p-4">
                  <p className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">Meeting link</p>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-slate-600 truncate flex-1">{form.meetingLink}</p>
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className={`flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        copied ? 'bg-emerald-100 text-emerald-700' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <Copy size={11} />
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
              )}

              {/* Send email toggle */}
              <div className="mt-4 flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => set('sendEmail', !form.sendEmail)}
                  className={`w-10 h-6 rounded-full transition-colors flex-shrink-0 relative ${form.sendEmail ? 'bg-blue-600' : 'bg-slate-300'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.sendEmail ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-700">Send invite to candidate</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    An email with all interview details will be sent immediately.
                  </p>
                </div>
                <Mail size={16} className={`flex-shrink-0 ${form.sendEmail ? 'text-blue-400' : 'text-slate-300'}`} />
              </div>

              {/* Error summary */}
              {hasErrors && (
                <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-red-600 mb-2">
                    <AlertCircle size={14} />
                    <p className="text-xs font-semibold">Fix these before scheduling</p>
                  </div>
                  <ul className="space-y-1">
                    {Object.values(errors).filter(Boolean).map((msg, i) => (
                      <li key={i} className="text-xs text-red-500">· {msg}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Success banner */}
              {submitSuccess && (
                <div className="mt-4 flex items-start gap-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl px-4 py-3">
                  <CheckCircle2 size={16} className="flex-shrink-0 mt-0.5 text-emerald-600" />
                  <div>
                    <p className="text-sm font-semibold">Interview scheduled successfully</p>
                    {form.sendEmail && (
                      <p className="text-xs text-emerald-600 mt-0.5">Invitation sent to {candidateEmail || 'the candidate'}.</p>
                    )}
                  </div>
                </div>
              )}
            </StepPanel>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
          <button
            type="button"
            onClick={step === 0 ? handleClose : prevStep}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {step === 0 ? 'Cancel' : '← Back'}
          </button>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`rounded-full transition-all ${
                    i === step ? 'w-4 h-1.5 bg-blue-600' :
                    i < step ? 'w-1.5 h-1.5 bg-blue-300' :
                    'w-1.5 h-1.5 bg-slate-200'
                  }`}
                />
              ))}
            </div>

            {step < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={loading}
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
                  <><Loader2 size={14} className="animate-spin" /> Scheduling…</>
                ) : submitSuccess ? (
                  <><CheckCircle2 size={14} /> Scheduled!</>
                ) : (
                  'Schedule Interview'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── sub-components ───────────────────────────────────────────────────────────

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
  className = '',
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
  className = '',
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { error?: boolean }) {
  return (
    <input
      {...props}
      className={`w-full px-3.5 py-2.5 border rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition bg-white ${
        error
          ? 'border-red-300 bg-red-50/30 focus:ring-red-400/20 focus:border-red-400'
          : 'border-slate-200 hover:border-slate-300'
      } ${className}`}
    />
  );
}

function Select({
  className = '',
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
      <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
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
      <span className="text-slate-400 flex-shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{label}</p>
        <p className="text-sm font-semibold text-slate-700 truncate">{value}</p>
      </div>
    </div>
  );
}

// Colored badge for application status — maps common status strings to a palette
const STATUS_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  SHORTLISTED:   { bg: 'bg-blue-50',    text: 'text-blue-700',   dot: 'bg-blue-500' },
  APPLIED:       { bg: 'bg-slate-100',  text: 'text-slate-600',  dot: 'bg-slate-400' },
  INTERVIEWING:  { bg: 'bg-violet-50',  text: 'text-violet-700', dot: 'bg-violet-500' },
  OFFERED:       { bg: 'bg-emerald-50', text: 'text-emerald-700',dot: 'bg-emerald-500' },
  HIRED:         { bg: 'bg-emerald-50', text: 'text-emerald-700',dot: 'bg-emerald-500' },
  REJECTED:      { bg: 'bg-red-50',     text: 'text-red-600',    dot: 'bg-red-400' },
  WITHDRAWN:     { bg: 'bg-amber-50',   text: 'text-amber-700',  dot: 'bg-amber-400' },
};

function StatusBadge({ status }: { status: string }) {
  const key = status.toUpperCase().replace(/\s+/g, '_');
  const style = STATUS_STYLES[key] ?? { bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400' };
  const label = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase().replace(/_/g, ' ');

  return (
    <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5">
      <span className="text-slate-400 flex-shrink-0"><CheckCircle2 size={13} /></span>
      <div className="min-w-0">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Status</p>
        <span className={`inline-flex items-center gap-1.5 mt-0.5 px-2 py-0.5 rounded-full text-xs font-semibold ${style.bg} ${style.text}`}>
          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${style.dot}`} />
          {label}
        </span>
      </div>
    </div>
  );
}