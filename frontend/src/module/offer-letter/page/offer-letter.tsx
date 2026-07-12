import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  CheckCircle2,
  Circle,
  Loader2,
  AlertTriangle,
  AlertCircle,
  Info,
  Mail,
  Home,
  XCircle,
  PartyPopper,
  X,
  FileText,
  ShieldCheck,
  ExternalLink,
  Phone,
} from "lucide-react";

import { useCandidateOffer } from "../hooks/candidate/useCandidateOffer";
import { useAcceptOffer } from "../hooks/candidate/useAcceptOffer";
import { useRejectOffer } from "../hooks/candidate/useRejectOffer";

interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
}

function formatCurrency(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency || "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString("en-IN")}`;
  }
}

function formatDate(dateStr?: string) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function getCountdown(expiryDate: string): CountdownTime {
  const expiry = new Date(expiryDate).getTime();
  const now = Date.now();
  const diff = Math.max(0, expiry - now);

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return { days, hours, minutes };
}

function getExpiryProgress(offerDate?: string, expiryDate?: string): number {
  if (!offerDate || !expiryDate) return 1;
  const start = new Date(offerDate).getTime();
  const end = new Date(expiryDate).getTime();
  const now = Date.now();
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start)
    return 1;
  const remaining = (end - now) / (end - start);
  return Math.min(1, Math.max(0, remaining));
}

type UrgencyLevel = "normal" | "soon" | "urgent" | "critical";

function getUrgency(days: number): UrgencyLevel {
  if (days > 7) return "normal";
  if (days >= 3) return "soon";
  if (days >= 1) return "urgent";
  return "critical";
}

const URGENCY_STYLES: Record<
  UrgencyLevel,
  { bg: string; text: string; bar: string }
> = {
  normal: { bg: "bg-[#DBEAFE]", text: "text-[#1D4ED8]", bar: "bg-[#2563EB]" },
  soon: { bg: "bg-[#DBEAFE]", text: "text-[#1D4ED8]", bar: "bg-[#2563EB]" },
  urgent: { bg: "bg-[#FEF3C7]", text: "text-[#B45309]", bar: "bg-[#F59E0B]" },
  critical: { bg: "bg-[#FEE2E2]", text: "text-[#DC2626]", bar: "bg-[#EF4444]" },
};

const STATUS_STYLES: Record<
  string,
  { bg: string; text: string; label: string }
> = {
  SENT: { bg: "bg-[#DBEAFE]", text: "text-[#1D4ED8]", label: "Sent" },
  VIEWED: { bg: "bg-[#EDE9FE]", text: "text-[#7C3AED]", label: "Viewed" },
  ACCEPTED: { bg: "bg-[#DCFCE7]", text: "text-[#15803D]", label: "Accepted" },
  REJECTED: { bg: "bg-[#FEE2E2]", text: "text-[#DC2626]", label: "Rejected" },
  EXPIRED: { bg: "bg-[#FEF3C7]", text: "text-[#B45309]", label: "Expired" },
};

function getStatusStyle(status?: string) {
  return STATUS_STYLES[(status ?? "SENT").toUpperCase()] ?? STATUS_STYLES.SENT;
}


const REJECT_REASONS = [
  "Accepted another offer",
  "Compensation expectations",
  "Role doesn't match expectations",
  "Personal reasons",
  "Relocation",
  "Other",
] as const;

const MAX_COMMENT_LENGTH = 500;

function CompanyMark({
  name,
  logoUrl,
  size = 10,
}: {
  name: string;
  logoUrl?: string;
  size?: number;
}) {
  const [errored, setErrored] = useState(false);
  const initial = name?.charAt(0)?.toUpperCase() ?? "A";
  const dim = `${size * 0.25}rem`;

  if (logoUrl && !errored) {
    return (
      <img
        src={logoUrl}
        alt={`${name} logo`}
        onError={() => setErrored(true)}
        className="rounded-lg object-cover shrink-0"
        style={{ width: dim, height: dim }}
      />
    );
  }
  return (
    <div
      className="rounded-lg bg-linear-to-br from-[#3B82F6] to-[#2563EB] flex items-center justify-center text-white font-semibold shrink-0"
      style={{ width: dim, height: dim }}
    >
      {initial}
    </div>
  );
}

function SidebarCard({
  title,
  children,
  className = "",
  delay = 0,
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <div
      className={`bg-white border border-[#E8EEF7] rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200 animate-in fade-in slide-in-from-bottom-2 fill-mode-both ${className}`}
      style={{ animationDuration: "500ms", animationDelay: `${delay}ms` }}
    >
      {title && (
        <h3 className="text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-4">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}

function DetailRow({
  label,
  value,
  divider = true,
}: {
  label: string;
  value: React.ReactNode;
  divider?: boolean;
}) {
  return (
    <div
      className={
        divider ? "py-3 border-b border-[#F1F5F9] last:border-b-0" : "py-3"
      }
    >
      <p className="text-xs text-[#64748B] mb-0.5">{label}</p>
      <p className="text-sm font-medium text-[#0F172A]">{value}</p>
    </div>
  );
}

function CompactTracker({ accepted }: { accepted: boolean }) {
  const steps = accepted
    ? [
        { label: "Application", done: true },
        { label: "Interview", done: true },
        { label: "Offer Accepted", done: true },
        { label: "Onboarding", done: false, current: true },
      ]
    : [
        { label: "Application", done: true },
        { label: "Interview", done: true },
        { label: "Offer Sent", done: false, current: true },
        { label: "Awaiting Response", done: false },
      ];

  return (
    <div className="flex flex-col gap-0">
      {steps.map((step, idx) => (
        <div key={step.label} className="flex items-start gap-3">
          <div className="flex flex-col items-center">
            {step.done ? (
              <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0" />
            ) : (step as any).current ? (
              <div className="w-4 h-4 rounded-full bg-[#2563EB] ring-4 ring-[#DBEAFE] shrink-0" />
            ) : (
              <Circle className="w-4 h-4 text-[#CBD5E1] shrink-0" />
            )}
            {idx < steps.length - 1 && (
              <div className="w-0.5 h-6 bg-[#E2E8F0] my-0.5" />
            )}
          </div>
          <span
            className={`text-sm pt-px ${
              step.done || (step as any).current
                ? "text-[#0F172A] font-medium"
                : "text-[#94A3B8]"
            }`}
          >
            {step.label}
          </span>
        </div>
      ))}
    </div>
  );
}

function Modal({
  open,
  onClose,
  busy = false,
  labelledBy,
  children,
}: {
  open: boolean;
  onClose: () => void;
  busy?: boolean;
  labelledBy: string;
  children: React.ReactNode;
}) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeBtnRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !busy) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, busy, onClose]);

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledBy}
    >
      <div
        className="absolute inset-0 bg-[#0F172A]/50 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={() => !busy && onClose()}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <button
          ref={closeBtnRef}
          onClick={() => !busy && onClose()}
          aria-label="Close dialog"
          className="absolute top-5 right-5 text-[#94A3B8] hover:text-[#475569] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/40 rounded transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        {children}
      </div>
    </div>
  );
}


const AcceptOfferModal = React.memo(function AcceptOfferModal({
  open,
  busy,
  jobTitle,
  companyName,
  joiningDate,
  onClose,
  onSubmit,
}: {
  open: boolean;
  busy: boolean;
  jobTitle: string;
  companyName: string;
  joiningDate: string;
  onClose: () => void;
  onSubmit: () => Promise<void> | void;
}) {
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleClose = useCallback(() => {
    setAgreeTerms(false);
    onClose();
  }, [onClose]);

  const handleSubmit = useCallback(async () => {
    if (!agreeTerms) return;
    await onSubmit();
    setAgreeTerms(false);
  }, [agreeTerms, onSubmit]);

  return (
    <Modal open={open} busy={busy} labelledBy="accept-modal-title" onClose={handleClose}>
      <div className="text-center mb-6">
        <div className="w-14 h-14 rounded-full bg-[#DCFCE7] flex items-center justify-center mx-auto mb-4">
          <PartyPopper className="w-7 h-7 text-[#22C55E]" />
        </div>
        <h3 id="accept-modal-title" className="text-xl font-bold text-[#0F172A] mb-1">
          Accept Employment Offer
        </h3>
        <p className="text-sm text-[#64748B]">Congratulations!</p>
        <p className="text-sm font-medium text-[#0F172A] mt-1">
          {jobTitle} · {companyName}
        </p>
      </div>

      <div className="mb-5">
        <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-3">
          Before continuing
        </p>
        <div className="space-y-2 text-sm text-[#334155]">
          <p className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0" />
            Offer reviewed
          </p>
          <p className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0" />
            Joining date understood ({joiningDate})
          </p>
          <p className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0" />
            Terms accepted
          </p>
        </div>
      </div>

      <label className="flex items-start gap-2.5 mb-6 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={agreeTerms}
          onChange={(e) => setAgreeTerms(e.target.checked)}
          className="mt-0.5 w-4 h-4 rounded border-[#CBD5E1] text-[#2563EB] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/40"
        />
        <span className="text-sm text-[#475569]">I have reviewed this offer.</span>
      </label>

      <div className="flex gap-3">
        <button
          onClick={handleClose}
          disabled={busy}
          className="flex-1 px-6 py-3 rounded-lg border border-[#E2E8F0] text-[#475569] font-medium hover:bg-[#F8FAFC] transition-colors disabled:opacity-60"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={busy || !agreeTerms}
          className="flex-1 px-6 py-3 rounded-lg bg-[#22C55E] text-white font-medium hover:bg-[#16A34A] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {busy && <Loader2 className="w-4 h-4 animate-spin" />}
          {busy ? "Processing…" : "Accept"}
        </button>
      </div>
    </Modal>
  );
});


const RejectOfferModal = React.memo(function RejectOfferModal({
  open,
  busy,
  onClose,
  onSubmit,
}: {
  open: boolean;
  busy: boolean;
  onClose: () => void;
  onSubmit: (remarks: string) => Promise<void> | void;
}) {
  const [reason, setReason] = useState<string | null>(null);
  const [comment, setComment] = useState("");
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const commentRequired = reason === "Other";
  const commentIsEmpty = comment.trim().length === 0;

  const showReasonError = submitAttempted && !reason;
  const showCommentError = submitAttempted && commentRequired && commentIsEmpty;

  const resetForm = useCallback(() => {
    setReason(null);
    setComment("");
    setSubmitAttempted(false);
  }, []);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [onClose, resetForm]);

  const handleCommentChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value.slice(0, MAX_COMMENT_LENGTH);
      setComment(value);
      const el = textareaRef.current;
      if (el) {
        el.style.height = "auto";
        el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
      }
    },
    []
  );

  const handleSubmit = useCallback(async () => {
    setSubmitAttempted(true);
    if (!reason || (commentRequired && commentIsEmpty)) return;

    const trimmed = comment.trim();
    const remarks =
      reason === "Other"
        ? trimmed
        : trimmed
        ? `${reason}: ${trimmed}`
        : reason;

    try {
      await onSubmit(remarks);
      resetForm();
    } catch {
    
    }
  }, [reason, comment, commentRequired, commentIsEmpty, onSubmit, resetForm]);

  return (
    <Modal open={open} busy={busy} labelledBy="reject-modal-title" onClose={handleClose}>
      <div className="text-center mb-6">
        <div className="w-14 h-14 rounded-full bg-[#FEE2E2] flex items-center justify-center mx-auto mb-4">
          <XCircle className="w-7 h-7 text-[#EF4444]" />
        </div>
        <h3 id="reject-modal-title" className="text-xl font-bold text-[#0F172A] mb-1">
          Decline Employment Offer
        </h3>
        <p className="text-sm text-[#64748B]">
          Are you sure you want to decline this opportunity? This will notify the recruiter.
        </p>
      </div>

      <div className="mb-5">
        <div className="flex items-center justify-between mb-2.5">
          <p className="text-sm font-medium text-[#0F172A]">Why are you declining?</p>
          {showReasonError && (
            <span className="text-xs text-[#EF4444] flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              Required
            </span>
          )}
        </div>

        <div role="radiogroup" aria-labelledby="reject-modal-title" className="flex flex-wrap gap-2">
          {REJECT_REASONS.map((r) => {
            const selected = reason === r;
            return (
              <button
                key={r}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setReason(r)}
                className={[
                  "px-3 py-1.5 rounded-full text-sm font-medium border transition-colors",
                  selected
                    ? "bg-[#FEF2F2] border-[#EF4444] text-[#EF4444]"
                    : "bg-white border-[#E2E8F0] text-[#334155] hover:bg-[#F8FAFC]",
                ].join(" ")}
              >
                {r}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-1">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-[#0F172A]">
            {commentRequired ? "Please specify" : "Comment (optional)"}
          </p>
          <span className="text-xs text-[#94A3B8]">
            {comment.length}/{MAX_COMMENT_LENGTH}
          </span>
        </div>
        <textarea
          ref={textareaRef}
          value={comment}
          onChange={handleCommentChange}
          placeholder="Let us know more…"
          rows={3}
          className={[
            "w-full rounded-lg border px-4 py-3 text-sm text-[#0F172A] placeholder:text-[#94A3B8]",
            "focus:outline-none focus:ring-2 focus:ring-[#EF4444]/30 resize-none transition-colors",
            showCommentError ? "border-[#EF4444]" : "border-[#E2E8F0]",
          ].join(" ")}
        />
      </div>
      <div className="min-h-5 mb-4">
        {showCommentError && (
          <p className="text-xs text-[#EF4444]">Please tell us a bit more.</p>
        )}
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleClose}
          disabled={busy}
          className="flex-1 px-6 py-3 rounded-lg border border-[#E2E8F0] text-[#475569] font-medium hover:bg-[#F8FAFC] transition-colors disabled:opacity-60"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={busy}
          className="flex-1 px-6 py-3 rounded-lg bg-[#EF4444] text-white font-medium hover:bg-[#DC2626] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {busy && <Loader2 className="w-4 h-4 animate-spin" />}
          {busy ? "Processing…" : "Decline Offer"}
        </button>
      </div>
    </Modal>
  );
});

const PreviewOfferModal = React.memo(function PreviewOfferModal({
  open,
  onClose,
  offerNumber,
  jobTitle,
  companyName,
  department,
  workLocation,
  joiningDate,
  annualCTC,
  monthlyCTC,
  currency,
  employmentType,
  benefits,
  expiryDate,
}: {
  open: boolean;
  onClose: () => void;
  offerNumber: string;
  jobTitle: string;
  companyName: string;
  department?: string;
  workLocation: string;
  joiningDate: string;
  annualCTC: number;
  monthlyCTC: number;
  currency: string;
  employmentType: string;
  benefits?: string[];
  expiryDate: string;
}) {
  return (
    <Modal open={open} labelledBy="preview-modal-title" onClose={onClose}>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <FileText className="w-5 h-5 text-[#2563EB]" />
          <h3 id="preview-modal-title" className="text-lg font-bold text-[#0F172A]">
            Offer Letter Preview
          </h3>
        </div>
        <p className="text-xs text-[#94A3B8]">Offer #{offerNumber}</p>
      </div>

      <div className="border border-[#E2E8F0] rounded-xl p-6 bg-[#F8FAFC] text-sm text-[#334155] leading-relaxed space-y-4">
        <p>
          Dear Candidate, we are pleased to offer you the position of{" "}
          <strong>{jobTitle}</strong> at <strong>{companyName}</strong>
          {department ? `, ${department} department` : ""}.
        </p>
        <p>
          Your work location will be <strong>{workLocation}</strong> and your
          anticipated joining date is <strong>{joiningDate}</strong>.
        </p>
        <p>
          Your annual compensation will be{" "}
          <strong>{formatCurrency(annualCTC, currency)}</strong> (approximately{" "}
          {formatCurrency(monthlyCTC, currency)} per month), employment type{" "}
          <strong>{employmentType}</strong>.
        </p>
        {benefits && benefits.length > 0 && (
          <p>Benefits included: {benefits.join(", ")}.</p>
        )}
        <p>
          This offer is valid until <strong>{expiryDate}</strong>.
        </p>
      </div>

      <button
        onClick={onClose}
        className="w-full mt-6 px-6 py-3 rounded-lg bg-[#2563EB] text-white font-medium hover:bg-[#1D4ED8] active:scale-95 transition-all"
      >
        Close Preview
      </button>
    </Modal>
  );
});

function Footer({ companyName }: { companyName: string }) {
  return (
    <footer className="border-t border-[#E8EEF7] mt-10">
      <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#94A3B8]">
        <p className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#94A3B8]" />
          Secure Offer Portal · Need help?{" "}
          <a
            href="mailto:hr@abc-tech.com"
            className="text-[#2563EB] font-medium hover:underline"
          >
            hr@abc-tech.com
          </a>
        </p>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-[#2563EB] transition-colors">
            Privacy
          </a>
          <a href="#" className="hover:text-[#2563EB] transition-colors">
            Terms
          </a>
          <span>
            © {new Date().getFullYear()} {companyName}
          </span>
        </div>
      </div>
    </footer>
  );
}

export default function EmploymentOfferPage() {
  const { offerId } = useParams<{ offerId: string }>();
  const { offer, loading, error, refetch } = useCandidateOffer(offerId ?? "");
  const { acceptOffer, loading: accepting } = useAcceptOffer();
  const { rejectOffer, loading: rejecting } = useRejectOffer();

  const [countdown, setCountdown] = useState<CountdownTime>({
    days: 0,
    hours: 0,
    minutes: 0,
  });
  const [urgency, setUrgency] = useState<UrgencyLevel>("normal");
  const [actionError, setActionError] = useState<string | null>(null);
  const [showStickyBar, setShowStickyBar] = useState(false);

  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!offer?.expiryDate) return;

    const update = () => {
      const next = getCountdown(offer.expiryDate);
      setCountdown(next);
      setUrgency(getUrgency(next.days));
    };

    update();
    const timer = setInterval(update, 60000);
    return () => clearInterval(timer);
  }, [offer?.expiryDate]);

  useEffect(() => {
    const onScroll = () => setShowStickyBar(window.scrollY > 220);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const expiryProgress = useMemo(
    () => getExpiryProgress(offer?.offerDate, offer?.expiryDate),
    [offer?.offerDate, offer?.expiryDate],
  );

  const handleReturnHome = () => {
    navigate("/candidate/home", { replace: true });
  };

  const busy = accepting || rejecting;

  const handleAcceptSubmit = useCallback(async () => {
    if (!offerId) return;
    setActionError(null);
    try {
      await acceptOffer(offerId, {});
      await refetch();
      setShowAcceptModal(false);
    } catch (err: any) {
      setActionError(
        err?.message ?? "Something went wrong while accepting the offer.",
      );
    }
  }, [offerId, acceptOffer, refetch]);

  const handleRejectSubmit = useCallback(
    async (remarks: string) => {
      if (!offerId) return;
      setActionError(null);
      try {
        await rejectOffer(offerId, { remarks });
        await refetch();
        setShowRejectModal(false);
      } catch (err: any) {
        setActionError(
          err?.message ?? "Something went wrong while declining the offer.",
        );
        throw err; // let the modal know it failed so it keeps the user's input
      }
    },
    [offerId, rejectOffer, refetch],
  );

  if (loading) {
    return (
      <div className="min-h-screen" style={{ background: "#F4F7FB" }}>
        <div className="sticky top-0 z-50 bg-white border-b border-[#E8EEF7] h-16" />
        <main className="max-w-6xl mx-auto px-6 py-8">
          <div className="mb-6 bg-white border border-[#E8EEF7] rounded-2xl h-32 animate-pulse" />
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
            <div className="space-y-6">
              <div className="bg-white border border-[#E8EEF7] rounded-2xl h-72 animate-pulse" />
              <div className="bg-white border border-[#E8EEF7] rounded-2xl h-32 animate-pulse" />
            </div>
            <div className="space-y-4">
              <div className="bg-white border border-[#E8EEF7] rounded-2xl h-64 animate-pulse" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !offer) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-6"
        style={{ background: "#F4F7FB" }}
      >
        <div className="max-w-md w-full bg-white border border-[#E8EEF7] rounded-2xl p-8 text-center shadow-sm">
          <AlertTriangle className="w-10 h-10 text-[#EF4444] mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-[#0F172A] mb-2">
            Unable to load offer
          </h2>
          <p className="text-[#64748B] text-sm mb-6">
            {error ?? "This offer could not be found."}
          </p>
          <button
            onClick={refetch}
            className="px-6 py-2.5 rounded-lg bg-[#2563EB] text-white font-medium hover:bg-[#1D4ED8] active:scale-95 transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (offer.status?.toUpperCase() === "ACCEPTED") {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-6"
        style={{ background: "#F0FDF4" }}
      >
        <div className="max-w-lg w-full bg-white border border-[#DCFCE7] rounded-3xl p-10 sm:p-14 text-center shadow-xl animate-in fade-in zoom-in-95 duration-500">
          <div className="w-20 h-20 rounded-full bg-[#DCFCE7] flex items-center justify-center mx-auto mb-6">
            <PartyPopper className="w-10 h-10 text-[#22C55E]" />
          </div>
          <h2 className="text-2xl font-bold text-[#0F172A] mb-1">
            Welcome to {offer.companyName}!
          </h2>
          <p className="text-[#475569] mb-8">Your offer has been accepted.</p>

          <div className="text-left bg-[#F0FDF4] border border-[#DCFCE7] rounded-xl p-5 mb-8">
            <p className="text-xs font-semibold text-[#15803D] uppercase tracking-wide mb-3">
              Next Steps
            </p>
            <ul className="space-y-2.5 text-sm text-[#334155]">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0" />
                HR Contact
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0" />
                Documents
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0" />
                Background Check
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0" />
                Joining
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleReturnHome}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-[#E2E8F0] text-[#475569] font-medium hover:bg-[#F8FAFC] active:scale-95 transition-all"
            >
              <Home className="w-4 h-4" />
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (offer.status?.toUpperCase() === "REJECTED") {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-6"
        style={{ background: "#FEF2F2" }}
      >
        <div className="max-w-lg w-full bg-white border border-[#FEE2E2] rounded-3xl p-10 sm:p-14 text-center shadow-xl animate-in fade-in zoom-in-95 duration-500">
          <div className="w-20 h-20 rounded-full bg-[#FEE2E2] flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-10 h-10 text-[#EF4444]" />
          </div>
          <h2 className="text-2xl font-bold text-[#0F172A] mb-3">Thank You</h2>
          <p className="text-[#475569] mb-1">Your decision has been shared.</p>
          <p className="text-[#475569] mb-8">
            We appreciate your time. We wish you success.
          </p>
          <button
            onClick={handleReturnHome}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-[#E2E8F0] text-[#475569] font-medium hover:bg-[#F8FAFC] active:scale-95 transition-all"
          >
            <Home className="w-4 h-4" />
            Return Home
          </button>
        </div>
      </div>
    );
  }

  const monthlyCTC = Math.round(offer.annualCTC / 12);
  const statusStyle = getStatusStyle(offer.status);
  const urgencyStyle = URGENCY_STYLES[urgency];
  const meta = offer as any;
  const employmentType: string = meta.employmentType ?? "Full Time";
  const logoUrl: string | undefined = meta.companyLogoUrl;

  return (
    <div className="min-h-screen" style={{ background: "#F8FAFC" }}>
      <header className="sticky top-0 z-50 bg-white/90 border-b border-[#E8EEF7] backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <CompanyMark name={offer.companyName} logoUrl={logoUrl} size={9} />
            <span className="font-semibold text-[#0F172A]">
              {offer.companyName}
            </span>
          </div>
          <h1 className="hidden sm:block text-base font-semibold text-[#0F172A]">
            Employment Offer
          </h1>
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${statusStyle.bg}`}
          >
            <div
              className={`w-2 h-2 rounded-full ${statusStyle.text.replace("text-", "bg-")}`}
            />
            <span className={`text-sm font-medium ${statusStyle.text}`}>
              {statusStyle.label}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-6 pb-24 lg:pb-6">
        <div
          className="mb-4 border border-[#E8EEF7] rounded-2xl px-6 py-4 sm:px-7 sm:py-5 animate-in fade-in slide-in-from-bottom-2 duration-500"
          style={{
            background: "linear-gradient(135deg, #EFF6FF, #FFFFFF)",
            borderTop: "4px solid #2563EB",
          }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <CompanyMark name={offer.companyName} logoUrl={logoUrl} size={12} />
            <div className="flex-1 min-w-0">
              <p className="text-base sm:text-lg font-bold text-[#0F172A] leading-tight">
                🎉 Congratulations! {offer.jobTitle} at {offer.companyName}
              </p>
              <p className="text-xs text-[#64748B] mt-1">
                Offer #{offer.offerNumber} · Expires in {countdown.days} Days
              </p>
            </div>
            <div className="flex flex-col items-stretch sm:items-end gap-1.5 shrink-0 w-full sm:w-auto">
              <button
                onClick={() => setShowAcceptModal(true)}
                disabled={busy}
                className="px-6 py-2.5 rounded-lg bg-[#2563EB] text-white font-medium hover:bg-[#1D4ED8] hover:-translate-y-0.5 hover:shadow-lg active:scale-95 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 shadow-md shadow-blue-200"
              >
                Accept Offer
              </button>
              <div className="flex flex-col items-center sm:items-end">
                <button
                  onClick={() => setShowRejectModal(true)}
                  disabled={busy}
                  className="text-sm text-[#64748B] hover:text-[#EF4444] font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Decline
                </button>
                <span className="text-[11px] text-[#94A3B8]">
                  Are you sure?
                </span>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowPreviewModal(true)}
          className="mb-6 flex items-center gap-1.5 text-sm text-[#2563EB] font-medium hover:underline"
        >
          <FileText className="w-3.5 h-3.5" />
          Preview Offer Letter
        </button>

        {actionError && (
          <div className="mb-6 bg-[#FEE2E2] border border-[#FECACA] rounded-xl px-5 py-3 text-sm text-[#DC2626]">
            {actionError}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
          <div className="space-y-6 min-w-0">
            <div
              className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 animate-in fade-in slide-in-from-bottom-2 fill-mode-both"
              style={{ animationDuration: "500ms", animationDelay: "80ms" }}
            >
              <div className="p-6">
                <h3 className="text-base font-semibold text-[#0F172A] mb-1">
                  Offer Summary
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                  <DetailRow label="Position" value={offer.jobTitle} />
                  <DetailRow
                    label="Department"
                    value={offer.department ?? "—"}
                  />
                  <DetailRow label="Location" value={offer.workLocation} />
                  <DetailRow
                    label="Joining"
                    value={formatDate(offer.joiningDate)}
                  />
                  <DetailRow
                    label="Employment"
                    value={employmentType}
                    divider={false}
                  />
                </div>
              </div>

              <div className="px-6 py-5 border-t border-[#F1F5F9]">
                <h3 className="text-base font-semibold text-[#0F172A] mb-4">
                  Compensation
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-[#64748B] mb-1">Annual</p>
                    <p className="text-xl sm:text-2xl font-bold text-[#1D4ED8]">
                      {formatCurrency(offer.annualCTC, offer.currency)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#64748B] mb-1">
                      Approx Monthly
                    </p>
                    <p className="text-base font-semibold text-[#475569]">
                      {formatCurrency(monthlyCTC, offer.currency)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#64748B] mb-1">Employment</p>
                    <p className="text-base font-semibold text-[#475569]">
                      {employmentType}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#64748B] mb-1">Currency</p>
                    <p className="text-base font-semibold text-[#475569]">
                      {offer.currency || "INR"}
                    </p>
                  </div>
                </div>
              </div>

              {offer.benefits && offer.benefits.length > 0 && (
                <div className="px-6 py-5 border-t border-[#F1F5F9]">
                  <h3 className="text-base font-semibold text-[#0F172A] mb-3">
                    Benefits
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                    {offer.benefits.map((benefit, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-sm text-[#334155] py-1"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0" />
                        {benefit}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div
              className="rounded-2xl p-6 animate-in fade-in slide-in-from-bottom-2 fill-mode-both"
              style={{
                background: "#EFF6FF",
                borderLeft: "5px solid #2563EB",
                animationDuration: "500ms",
                animationDelay: "160ms",
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Info className="w-4 h-4 text-[#2563EB]" />
                <h3 className="text-sm font-semibold text-[#0F172A]">
                  Important Information
                </h3>
              </div>
              <ul className="space-y-2.5 text-sm text-[#475569]">
                {offer.notes ? (
                  <li className="flex gap-2.5">
                    <span className="text-[#2563EB] font-bold">•</span>
                    <span>{offer.notes}</span>
                  </li>
                ) : (
                  <>
                    <li className="flex gap-2.5">
                      <span className="text-[#2563EB] font-bold">•</span>
                      <span>
                        This offer is contingent upon successful background
                        verification and final approval from the hiring team.
                      </span>
                    </li>
                    <li className="flex gap-2.5">
                      <span className="text-[#2563EB] font-bold">•</span>
                      <span>
                        Please confirm your acceptance or rejection within 7
                        days of receiving this offer.
                      </span>
                    </li>
                    <li className="flex gap-2.5">
                      <span className="text-[#2563EB] font-bold">•</span>
                      <span>
                        Your start date may be negotiable based on your current
                        employment situation.
                      </span>
                    </li>
                  </>
                )}
                <li className="flex gap-2.5">
                  <span className="text-[#2563EB] font-bold">•</span>
                  <span>
                    For any queries, please contact our HR team at
                    hr@abc-tech.com
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="lg:sticky lg:top-20 space-y-4">
            <SidebarCard delay={0}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-[#64748B] font-medium">
                  Offer Status
                </span>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusStyle.bg} ${statusStyle.text}`}
                >
                  {statusStyle.label}
                </span>
              </div>

              <div className={`rounded-xl p-4 ${urgencyStyle.bg}`}>
                <p className="text-xs font-medium text-[#64748B] mb-2">
                  Offer expires
                </p>
                <p className={`text-lg font-bold ${urgencyStyle.text} mb-2`}>
                  {countdown.days} Days Remaining
                </p>
                <div className="h-1.5 w-full rounded-full bg-white/70 overflow-hidden mb-2">
                  <div
                    className={`h-full rounded-full ${urgencyStyle.bar} transition-all duration-700`}
                    style={{ width: `${expiryProgress * 100}%` }}
                  />
                </div>
                <p className="text-xs text-[#64748B]">
                  {formatDate(offer.expiryDate)}
                </p>
              </div>

              <div className="flex flex-col gap-2 mt-4">
                <button
                  onClick={() => setShowAcceptModal(true)}
                  disabled={busy}
                  className="w-full px-5 py-2.5 rounded-lg bg-[#2563EB] text-white font-medium hover:bg-[#1D4ED8] hover:-translate-y-0.5 hover:shadow-lg active:scale-95 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {accepting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> Processing…
                    </span>
                  ) : (
                    "Accept Offer"
                  )}
                </button>
                <button
                  onClick={() => setShowRejectModal(true)}
                  disabled={busy}
                  className="w-full text-sm text-[#64748B] hover:text-[#EF4444] font-medium py-1 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {rejecting ? "Processing…" : "Decline offer"}
                </button>
              </div>
            </SidebarCard>

            <SidebarCard title="Offer Details" delay={80}>
              <DetailRow label="Company" value={offer.companyName} />
              <DetailRow label="Offer Number" value={offer.offerNumber} />
              <DetailRow label="Employment Type" value={employmentType} />
              {offer.department && (
                <DetailRow label="Department" value={offer.department} />
              )}
              <DetailRow
                label="Offer Date"
                value={formatDate(offer.offerDate)}
              />
              <DetailRow
                label="Expiry Date"
                value={formatDate(offer.expiryDate)}
              />
              <DetailRow
                label="Joining Date"
                value={formatDate(offer.joiningDate)}
              />
              {offer.probationPeriod && (
                <DetailRow label="Probation" value={offer.probationPeriod} />
              )}
              <DetailRow
                label="Location"
                value={offer.workLocation}
                divider={false}
              />
            </SidebarCard>

            <SidebarCard title="Timeline" delay={160}>
              <CompactTracker accepted={false} />
            </SidebarCard>

            <SidebarCard title="Need Help?" delay={240}>
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-[#2563EB] to-[#1D4ED8] text-white shadow-lg shadow-blue-200">
                    <ShieldCheck className="h-5 w-5" />
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-[#0F172A]">
                      HR Support Team
                    </h4>

                    <p className="text-xs text-[#64748B]">
                      We're here to help you throughout your hiring process.
                    </p>
                  </div>
                </div>

                {offer.contactEmail && (
                  <a
                    href={`mailto:${offer.contactEmail}`}
                    className="group flex items-center justify-between rounded-xl border border-[#E2E8F0] bg-white p-4 transition-all duration-200 hover:border-[#2563EB] hover:bg-[#F8FAFC] hover:shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB]">
                        <Mail className="h-4 w-4" />
                      </div>

                      <div>
                        <p className="text-xs text-[#64748B]">Email</p>

                        <p className="text-sm font-medium text-[#0F172A] break-all">
                          {offer.contactEmail}
                        </p>
                      </div>
                    </div>

                    <ExternalLink className="h-4 w-4 text-[#CBD5E1] transition group-hover:text-[#2563EB]" />
                  </a>
                )}

                {offer.contactPhone && (
                  <a
                    href={`tel:${offer.contactPhone}`}
                    className="group flex items-center justify-between rounded-xl border border-[#E2E8F0] bg-white p-4 transition-all duration-200 hover:border-[#22C55E] hover:bg-[#F8FAFC] hover:shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-[#16A34A]">
                        <Phone className="h-4 w-4" />
                      </div>

                      <div>
                        <p className="text-xs text-[#64748B]">Phone</p>

                        <p className="text-sm font-medium text-[#0F172A]">
                          {offer.contactPhone}
                        </p>
                      </div>
                    </div>

                    <ExternalLink className="h-4 w-4 text-[#CBD5E1] transition group-hover:text-[#16A34A]" />
                  </a>
                )}

                {!offer.contactEmail && !offer.contactPhone && (
                  <div className="rounded-xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] px-4 py-5 text-center">
                    <Mail className="mx-auto mb-2 h-5 w-5 text-[#94A3B8]" />

                    <p className="text-sm font-medium text-[#475569]">
                      Contact details unavailable
                    </p>

                    <p className="mt-1 text-xs text-[#64748B]">
                      Please wait for the recruiter to contact you regarding the
                      next steps.
                    </p>
                  </div>
                )}

                <div className="rounded-xl border border-[#DBEAFE] bg-[#EFF6FF] p-4">
                  <div className="flex gap-2">
                    <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#2563EB]" />

                    <p className="text-xs leading-5 text-[#1E3A8A]">
                      For any questions regarding your offer, onboarding
                      process, documentation, or joining date, please reach out
                      using the contact information provided above.
                    </p>
                  </div>
                </div>
              </div>
            </SidebarCard>
          </div>
        </div>
      </main>

      <Footer companyName={offer.companyName} />

      <div
        className={`fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E8EEF7] shadow-[0_-4px_16px_rgba(15,23,42,0.08)] transition-transform duration-300 ${
          showStickyBar ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 py-2.5 flex items-center justify-between gap-4">
          <div className="min-w-0 hidden sm:block">
            <p className="text-sm font-semibold text-[#0F172A] truncate">
              {offer.jobTitle}
            </p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setShowRejectModal(true)}
              disabled={busy}
              className="flex-1 sm:flex-none px-4 py-1.5 rounded-lg border border-[#E2E8F0] text-[#475569] text-sm font-medium hover:bg-[#F8FAFC] active:scale-95 transition-all disabled:opacity-60"
            >
              Decline
            </button>
            <button
              onClick={() => setShowAcceptModal(true)}
              disabled={busy}
              className="flex-1 sm:flex-none px-5 py-1.5 rounded-lg bg-[#2563EB] text-white text-sm font-medium hover:bg-[#1D4ED8] active:scale-95 transition-all disabled:opacity-60"
            >
              Accept Offer
            </button>
          </div>
        </div>
      </div>

      <AcceptOfferModal
        open={showAcceptModal}
        busy={accepting}
        jobTitle={offer.jobTitle}
        companyName={offer.companyName}
        joiningDate={formatDate(offer.joiningDate)}
        onClose={() => setShowAcceptModal(false)}
        onSubmit={handleAcceptSubmit}
      />

      <RejectOfferModal
        open={showRejectModal}
        busy={rejecting}
        onClose={() => setShowRejectModal(false)}
        onSubmit={handleRejectSubmit}
      />

      <PreviewOfferModal
        open={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        offerNumber={offer.offerNumber}
        jobTitle={offer.jobTitle}
        companyName={offer.companyName}
        department={offer.department}
        workLocation={offer.workLocation}
        joiningDate={formatDate(offer.joiningDate)}
        annualCTC={offer.annualCTC}
        monthlyCTC={monthlyCTC}
        currency={offer.currency}
        employmentType={employmentType}
        benefits={offer.benefits}
        expiryDate={formatDate(offer.expiryDate)}
      />
    </div>
  );
}