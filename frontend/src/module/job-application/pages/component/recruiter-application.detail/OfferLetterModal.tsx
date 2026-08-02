import { useEffect, useState } from "react";
import { X, FileText, Wallet, CheckCircle2, Circle, PenTool, ImageOff } from "lucide-react";
import type { OfferStatus } from "@/module/offer-letter/types/candidateOffer.types";


export interface OfferDetails {
  id: string;
  offerNumber: string;
  status: OfferStatus;
  companyName: string;
  jobTitle: string;
  department?: string;
  workLocation: string;
  annualCTC: number;
  currency: string;
  joiningDate: string;
  probationPeriod?: string;
  benefits: string[];
  notes?: string;
  offerDate: string;
  expiryDate: string;
  offerLetterUrl?: string;
  sentAt?: string;
  viewedAt?: string;
  acceptedAt?: string;
  rejectedAt?: string;
  candidateSignatureUrl?: string;
  candidateRemarks?: string;
}

const STATUS_STYLES: Record<
  string,
  { label: string; dot: string; badgeBg: string; badgeText: string; bannerBg: string; bannerBorder: string; heroTone: string }
> = {
  SENT: { label: "Sent", dot: "bg-blue-500", badgeBg: "bg-blue-50", badgeText: "text-blue-700", bannerBg: "bg-blue-50/60", bannerBorder: "border-blue-100", heroTone: "text-slate-900" },
  VIEWED: { label: "Viewed", dot: "bg-amber-500", badgeBg: "bg-amber-50", badgeText: "text-amber-700", bannerBg: "bg-amber-50/60", bannerBorder: "border-amber-100", heroTone: "text-slate-900" },
  ACCEPTED: { label: "Accepted", dot: "bg-emerald-500", badgeBg: "bg-emerald-50", badgeText: "text-emerald-700", bannerBg: "bg-emerald-50/60", bannerBorder: "border-emerald-100", heroTone: "text-emerald-700" },
  REJECTED: { label: "Rejected", dot: "bg-red-500", badgeBg: "bg-red-50", badgeText: "text-red-700", bannerBg: "bg-red-50/60", bannerBorder: "border-red-100", heroTone: "text-red-700" },
  EXPIRED: { label: "Expired", dot: "bg-slate-400", badgeBg: "bg-slate-100", badgeText: "text-slate-600", bannerBg: "bg-slate-50", bannerBorder: "border-slate-150", heroTone: "text-slate-500" },
};

function statusStyle(status: string) {
  return STATUS_STYLES[status] ?? STATUS_STYLES.SENT;
}

const HERO_HEADLINE: Record<string, string> = {
  SENT: "Awaiting Candidate Response",
  VIEWED: "Candidate is Reviewing the Offer",
  ACCEPTED: "Candidate Accepted the Offer 🎉",
  REJECTED: "Candidate Declined the Offer",
  EXPIRED: "Offer Expired",
};

function formatDate(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

function formatDateShort(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function relativeTime(iso?: string) {
  if (!iso) return null;
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins} min${diffMins === 1 ? "" : "s"} ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "yesterday";
  return `${diffDays} days ago`;
}

function daysLeft(expiryDate: string) {
  return Math.ceil((new Date(expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

function formatCurrency(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString("en-IN")}`;
  }
}


function HeroBanner({ offer }: { offer: OfferDetails }) {
  const status = offer.status as unknown as string;
  const style = statusStyle(status);
  const headline = HERO_HEADLINE[status] ?? HERO_HEADLINE.SENT;

  let lines: string[] = [];
  if (status === "ACCEPTED") {
    lines = [`Accepted on ${formatDate(offer.acceptedAt)}`, `Joining on ${formatDate(offer.joiningDate)}`];
  } else if (status === "REJECTED") {
    lines = [`Declined on ${formatDate(offer.rejectedAt)}`];
  } else if (status === "EXPIRED") {
    lines = [`Expired on ${formatDate(offer.expiryDate)}`, "No response received"];
  } else if (status === "VIEWED") {
    const ago = relativeTime(offer.viewedAt);
    const dLeft = daysLeft(offer.expiryDate);
    lines = [ago ? `Candidate reviewed the offer ${ago}` : "Candidate opened the offer"];
    if (dLeft >= 0) lines.push(`Expires in ${dLeft} day${dLeft === 1 ? "" : "s"}`);
  } else {
    const dLeft = daysLeft(offer.expiryDate);
    lines = [`Offer sent on ${formatDate(offer.sentAt ?? offer.offerDate)}`];
    if (dLeft >= 0) lines.push(`Expires in ${dLeft} day${dLeft === 1 ? "" : "s"}`);
  }

  return (
    <div className={`mx-6 mt-5 rounded-2xl border px-5 py-4 ${style.bannerBg} ${style.bannerBorder}`}>
      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full shrink-0 ${style.dot}`} />
        <h3 className={`text-lg font-bold leading-snug ${style.heroTone}`}>{headline}</h3>
      </div>
      <div className="mt-1.5 space-y-0.5">
        {lines.map((line) => (
          <p key={line} className="text-sm text-slate-500">
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}


function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-100 p-5">
      <h3 className="text-sm font-bold text-slate-900 mb-4">{title}</h3>
      {children}
    </div>
  );
}


interface TimelineStep {
  label: string;
  date?: string;
  done: boolean;
  current?: boolean;
}

function TimelineSection({ offer }: { offer: OfferDetails }) {
  const status = offer.status as unknown as string;
  const steps: TimelineStep[] = [
    { label: "Offer Created", date: offer.offerDate, done: true },
    { label: "Offer Sent", date: offer.sentAt, done: true },
    { label: "Viewed by Candidate", date: offer.viewedAt, done: Boolean(offer.viewedAt) },
  ];

  if (status === "ACCEPTED") steps.push({ label: "Accepted", date: offer.acceptedAt, done: true });
  else if (status === "REJECTED") steps.push({ label: "Rejected", date: offer.rejectedAt, done: true });
  else if (status === "EXPIRED") steps.push({ label: "Expired", date: offer.expiryDate, done: true });
  else steps.push({ label: "Waiting for Response", done: false, current: true });

  return (
    <SectionCard title="Candidate Activity">
      <div>
        {steps.map((step, i) => (
          <div
            key={step.label}
            className={`flex items-start gap-3 py-3 ${i < steps.length - 1 ? "border-b border-slate-100" : ""}`}
          >
            {step.done ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            ) : (
              <Circle className={`w-4 h-4 shrink-0 mt-0.5 ${step.current ? "text-blue-400" : "text-slate-200"}`} />
            )}
            <div>
              <p className="text-xs font-semibold text-slate-400">
                {step.current ? "Current" : step.date ? formatDateShort(step.date) : ""}
              </p>
              <p className={`text-sm font-semibold ${step.done ? "text-slate-800" : "text-slate-400"}`}>
                {step.label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}


function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0">
      <span className="text-sm text-slate-400">{label}</span>
      <span className="text-sm font-semibold text-slate-800">{value}</span>
    </div>
  );
}

function OfferInformationSection({ offer }: { offer: OfferDetails }) {
  const style = statusStyle(offer.status as unknown as string);
  return (
    <SectionCard title="Offer Information">
      <div>
        <InfoRow label="Offer Number" value={offer.offerNumber} />
        <div className="flex items-center justify-between py-2.5 border-b border-slate-50">
          <span className="text-sm text-slate-400">Status</span>
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${style.badgeBg} ${style.badgeText}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
            {style.label}
          </span>
        </div>
        <InfoRow label="Company" value={offer.companyName} />
        <InfoRow label="Job Title" value={offer.jobTitle} />
        {offer.department && <InfoRow label="Department" value={offer.department} />}
        <InfoRow label="Work Location" value={offer.workLocation} />
        <InfoRow label="Joining Date" value={formatDate(offer.joiningDate)} />
      </div>
    </SectionCard>
  );
}


function CompensationSection({ offer }: { offer: OfferDetails }) {
  return (
    <SectionCard title="Compensation">
      <div className="text-center py-2">
        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
          <Wallet className="w-5 h-5" />
        </div>
        <p className="text-3xl font-bold text-slate-900 tracking-tight">
          {formatCurrency(offer.annualCTC, offer.currency)}
        </p>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mt-1.5">Annual Compensation</p>
      </div>
      {offer.probationPeriod && (
        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-xs text-slate-400">Currency</p>
            <p className="text-sm font-semibold text-slate-800 mt-0.5">{offer.currency}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-400">Probation</p>
            <p className="text-sm font-semibold text-slate-800 mt-0.5">{offer.probationPeriod}</p>
          </div>
        </div>
      )}
    </SectionCard>
  );
}


function BenefitsSection({ benefits }: { benefits: string[] }) {
  if (benefits.length === 0) return null;
  return (
    <SectionCard title="Benefits">
      <div className="flex flex-wrap gap-2">
        {benefits.map((b) => (
          <span key={b} className="px-3 py-1.5 rounded-lg bg-slate-50 text-sm font-medium text-slate-700">
            {b}
          </span>
        ))}
      </div>
    </SectionCard>
  );
}


/**
 * Renders the candidate's signature, but degrades gracefully if the URL
 * has expired or failed to load (e.g. a time-limited signed S3 URL)
 * instead of showing the browser's broken-image icon.
 */
function SignatureImage({ src, alt }: { src: string; alt: string }) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <div className="flex flex-col items-center justify-center gap-1.5 py-6 text-slate-400">
        <ImageOff className="w-5 h-5" />
        <p className="text-sm">Signature unavailable</p>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className="max-h-24 max-w-full object-contain"
      onError={() => setErrored(true)}
    />
  );
}


/**
 * Rich "signed document" style card shown once a candidate has accepted.
 * Combines the acceptance confirmation, their captured signature, and
 * any remarks they left into a single cohesive block instead of three
 * disconnected pieces.
 */
function CandidateAcceptanceSection({ offer }: { offer: OfferDetails }) {
  const { candidateSignatureUrl, acceptedAt, candidateRemarks } = offer;

  if (!candidateSignatureUrl) return null;

  return (
    <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 overflow-hidden">
      <div className="px-5 py-4 border-b border-emerald-100 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
          <PenTool className="w-4 h-4" />
        </div>
        <h3 className="text-sm font-bold text-slate-900">Candidate Acceptance</h3>
      </div>

      <div className="p-5 space-y-5">
        <div className="flex items-start gap-2.5">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-slate-900">Offer Accepted</p>
            {acceptedAt && (
              <p className="text-xs text-slate-400 mt-0.5">{formatDate(acceptedAt)}</p>
            )}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
            Signature
          </p>
          <div className="rounded-xl border border-slate-200 bg-white px-4 pt-4 pb-2">
            <div className="flex items-center justify-center min-h-24">
              <SignatureImage src={candidateSignatureUrl} alt="Candidate signature" />
            </div>
            <div className="mt-3 pt-2 border-t border-dashed border-slate-200">
              <span className="text-[11px] text-slate-400">{offer.jobTitle} candidate</span>
            </div>
          </div>
        </div>

        {candidateRemarks && (
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
              Candidate Remarks
            </p>
            <div className="rounded-xl bg-white border border-slate-100 px-4 py-3.5">
              <p className="text-sm text-slate-600 leading-relaxed italic">
                "{candidateRemarks}"
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


function QuoteBlock({ title, text, tone }: { title: string; text: string; tone: "neutral" | "emerald" | "blue" | "red" | "slate" }) {
  const tones: Record<typeof tone, string> = {
    neutral: "bg-slate-50",
    emerald: "bg-emerald-50",
    blue: "bg-blue-50",
    red: "bg-red-50",
    slate: "bg-slate-50",
  };
  return (
    <div>
      <h3 className="text-sm font-bold text-slate-900 mb-3">{title}</h3>
      <div className={`rounded-2xl px-4 py-3.5 ${tones[tone]}`}>
        <p className="text-sm text-slate-600 leading-relaxed italic">"{text}"</p>
      </div>
    </div>
  );
}

function candidateResponseTone(status: string): "neutral" | "emerald" | "blue" | "red" | "slate" {
  if (status === "ACCEPTED") return "emerald";
  if (status === "VIEWED") return "blue";
  if (status === "REJECTED") return "red";
  if (status === "EXPIRED") return "slate";
  return "neutral";
}

export function OfferLetterModal({
  open,
  onClose,
  offer,
}: {
  open: boolean;
  onClose: () => void;
  offer: OfferDetails;
}) {
  const status = offer.status as unknown as string;
  const style = statusStyle(status);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const subtitle = [offer.jobTitle, offer.companyName].filter(Boolean).join(" · ");

  // Once accepted with a captured signature, the rich acceptance card
  // takes over remarks display so we don't show the same text twice.
  const showAcceptanceCard = status === "ACCEPTED" && Boolean(offer.candidateSignatureUrl);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-180 max-h-[88vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="sticky top-0 z-10 bg-white flex items-start justify-between gap-4 px-6 py-5 border-b border-slate-100 shrink-0">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-slate-50 text-slate-500 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-bold text-slate-900">Offer Letter</h2>
              <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
              <p className="text-[11px] text-slate-300 mt-0.5">Offer #{offer.offerNumber}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${style.badgeBg} ${style.badgeText}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
              {style.label.toUpperCase()}
            </span>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Close"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pb-6">
          <HeroBanner offer={offer} />

          <div className="px-6 pt-6 space-y-5">
            <TimelineSection offer={offer} />
            <OfferInformationSection offer={offer} />
            <CompensationSection offer={offer} />
            <BenefitsSection benefits={offer.benefits} />

            {showAcceptanceCard ? (
              <CandidateAcceptanceSection offer={offer} />
            ) : (
              offer.candidateRemarks && (
                <QuoteBlock
                  title="Candidate Response"
                  text={offer.candidateRemarks}
                  tone={candidateResponseTone(status)}
                />
              )
            )}

            {offer.notes && <QuoteBlock title="Recruiter Notes" text={offer.notes} tone="neutral" />}
          </div>
        </div>


        <div className="sticky bottom-0 bg-white border-t border-slate-100 px-6 py-4 shrink-0">
          <button
            onClick={onClose}
            className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}