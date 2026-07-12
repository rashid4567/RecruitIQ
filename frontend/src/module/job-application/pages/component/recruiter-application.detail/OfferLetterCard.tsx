import { useState } from "react";
import { FileText, ArrowRight, Plus } from "lucide-react";
import { OfferLetterModal, type OfferDetails } from "./OfferLetterModal";


function formatDateShort(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "long" });
}

function formatSmartDateTime(iso?: string) {
  if (!iso) return "—";
  const date = new Date(iso);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();
  const time = date.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });

  if (isToday) return `Today, ${time}`;
  if (isYesterday) return `Yesterday, ${time}`;
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
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

function expiryValue(expiryDate: string) {
  const diffDays = Math.ceil((new Date(expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (diffDays > 1) return `${diffDays} Days`;
  if (diffDays === 1) return "Tomorrow";
  if (diffDays === 0) return "Today";
  return "Overdue";
}

const STATUS_HERO: Record<string, { label: string; dot: string; tone: string }> = {
  SENT: { label: "Awaiting Candidate Response", dot: "bg-blue-500", tone: "text-slate-900" },
  VIEWED: { label: "Candidate is Reviewing the Offer", dot: "bg-amber-500", tone: "text-slate-900" },
  ACCEPTED: { label: "Candidate Accepted the Offer 🎉", dot: "bg-emerald-500", tone: "text-emerald-700" },
  REJECTED: { label: "Candidate Declined the Offer", dot: "bg-red-500", tone: "text-red-700" },
  EXPIRED: { label: "Offer Expired", dot: "bg-slate-400", tone: "text-slate-500" },
};

function heroFor(status: string) {
  return STATUS_HERO[status] ?? STATUS_HERO.SENT;
}

function CardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-blue-200">
      {children}
    </div>
  );
}

function CardHeader() {
  return (
    <div className="flex items-center gap-2.5 px-5 pt-5 pb-1">
      <div className="w-8 h-8 rounded-lg bg-slate-50 text-slate-500 flex items-center justify-center shrink-0">
        <FileText className="w-4 h-4" />
      </div>
      <p className="text-xs font-bold text-slate-700">Offer Letter</p>
    </div>
  );
}

function Hero({ label, dot, tone }: { label: string; dot: string; tone: string }) {
  return (
    <div className="px-5 pt-3 pb-1">
      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full shrink-0 ${dot}`} />
        <h3 className={`text-base font-bold leading-snug ${tone}`}>{label}</h3>
      </div>
    </div>
  );
}

function DateBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">{label}</p>
      <p className="text-sm font-bold text-slate-800 mt-0.5">{value}</p>
    </div>
  );
}

function ViewDetailsLink({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group w-full flex items-center justify-center gap-1.5 px-5 py-3.5 text-sm font-semibold text-blue-600 border-t border-slate-100 hover:bg-slate-50 transition-colors"
    >
      View Offer Details
      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
    </button>
  );
}


export function OfferLetterCard({
  offer,
  onCreateOffer,
}: {
  offer?: OfferDetails;
  onCreateOffer?: () => void;
}) {
  const [modalOpen, setModalOpen] = useState(false);

  if (!offer) {
    return (
      <CardShell>
        <CardHeader />
        <div className="px-6 pt-3 pb-6 text-center">
          <p className="text-sm font-bold text-slate-800 mt-2">No Offer Sent</p>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed max-w-56 mx-auto">
            Create an offer once the candidate is selected.
          </p>
          <button
            onClick={onCreateOffer}
            className="mt-5 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Offer
          </button>
        </div>
      </CardShell>
    );
  }

  const status = offer.status as unknown as string;
  const hero = heroFor(status);

  return (
    <>
      <CardShell>
        <CardHeader />
        <Hero label={hero.label} dot={hero.dot} tone={hero.tone} />

        {status === "SENT" && (
          <div className="grid grid-cols-2 gap-4 px-5 pt-3 pb-4">
            <DateBlock label="Sent" value={offer.sentAt ? relativeTime(offer.sentAt) ?? "—" : formatDateShort(offer.offerDate)} />
            <DateBlock label="Expires In" value={expiryValue(offer.expiryDate)} />
          </div>
        )}

        {status === "VIEWED" && (
          <div className="grid grid-cols-2 gap-4 px-5 pt-3 pb-4">
            <DateBlock label="Viewed" value={formatSmartDateTime(offer.viewedAt)} />
            <DateBlock label="Expires In" value={expiryValue(offer.expiryDate)} />
          </div>
        )}

        {status === "ACCEPTED" && (
          <div className="grid grid-cols-2 gap-4 px-5 pt-3 pb-4">
            <DateBlock label="Accepted" value={formatDateShort(offer.acceptedAt)} />
            <DateBlock label="Joining" value={formatDateShort(offer.joiningDate)} />
          </div>
        )}

        {status === "REJECTED" && (
          <div className="px-5 pt-3 pb-4 space-y-3">
            <DateBlock label="Rejected" value={formatDateShort(offer.rejectedAt)} />
            {offer.candidateRemarks && (
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Reason</p>
                <p className="text-sm text-slate-600 mt-0.5 leading-relaxed">{offer.candidateRemarks}</p>
              </div>
            )}
          </div>
        )}

        {status === "EXPIRED" && (
          <div className="px-5 pt-3 pb-4 space-y-1.5">
            <DateBlock label="Expired On" value={formatDateShort(offer.expiryDate)} />
            <p className="text-xs text-slate-400">Candidate didn't respond.</p>
          </div>
        )}

        <ViewDetailsLink onClick={() => setModalOpen(true)} />
      </CardShell>
      <OfferLetterModal open={modalOpen} onClose={() => setModalOpen(false)} offer={offer} />
    </>
  );
}