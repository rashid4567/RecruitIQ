import { type RefObject, useState, useEffect, useRef } from "react";
import {
  Code2,
  Eye,
  AlertCircle,
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  Type,
  Hash,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { EmailTemplateForm } from "../../validaton/emailTemplate.schema";

interface EmailBodyEditorProps {
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  form: EmailTemplateForm;
  setForm: React.Dispatch<React.SetStateAction<EmailTemplateForm>>;
  previewHtml: () => string;
}

const VARIABLE_CHIPS = [
  { label: "candidateName", color: "violet" },
  { label: "jobTitle", color: "sky" },
  { label: "companyName", color: "emerald" },
  { label: "interviewDate", color: "amber" },
  { label: "interviewTime", color: "rose" },
  { label: "location", color: "indigo" },
];

const COLOR_MAP: Record<string, string> = {
  violet: "bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100",
  sky: "bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100",
  emerald:
    "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
  amber: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
  rose: "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100",
  indigo: "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100",
};

function countWords(text: string) {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

function extractVariables(text: string) {
  const matches = text.match(/\{\{[^}]+\}\}/g) || [];
  return [...new Set(matches)];
}

export function EmailBodyEditor({
  textareaRef,
  form,
  setForm,
  previewHtml,
}: EmailBodyEditorProps) {
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [copied, setCopied] = useState(false);
  const [focusedLine, setFocusedLine] = useState(0);
  const [history, setHistory] = useState<string[]>([form.body || ""]);
  const [histIdx, setHistIdx] = useState(0);

  const body = form.body || "";
  const wordCount = countWords(body);
  const charCount = body.length;
  const detectedVars = extractVariables(body);
  const lineCount = body.split("\n").length;

  // Track edit history for undo
  const lastSaved = useRef(body);
  useEffect(() => {
    if (body !== lastSaved.current) {
      const timeout = setTimeout(() => {
        setHistory((h) => [...h.slice(0, histIdx + 1), body]);
        setHistIdx((i) => i + 1);
        lastSaved.current = body;
      }, 600);
      return () => clearTimeout(timeout);
    }
  }, [body]);

  function handleUndo() {
    if (histIdx > 0) {
      const prev = history[histIdx - 1];
      setHistIdx((i) => i - 1);
      setForm((p) => ({ ...p, body: prev }));
    }
  }

  function insertVariable(variable: string) {
    const ta = (textareaRef as RefObject<HTMLTextAreaElement>).current;
    if (!ta) {
      setForm((p) => ({ ...p, body: p.body + `{{${variable}}}` }));
      return;
    }
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const val = ta.value;
    const insertion = `{{${variable}}}`;
    const newVal = val.slice(0, start) + insertion + val.slice(end);
    setForm((p) => ({ ...p, body: newVal }));
    setTimeout(() => {
      ta.focus();
      ta.setSelectionRange(start + insertion.length, start + insertion.length);
    }, 0);
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(body);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-col gap-0 rounded-2xl overflow-hidden border border-slate-200 shadow-xl shadow-slate-200/60 bg-white">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-linear-to-r from-slate-50 to-white">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-sm shadow-indigo-300">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900 leading-none">
              Email Body
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Use{" "}
              <code className="bg-slate-100 px-1 rounded text-indigo-600 font-mono text-[10px]">
                {"{{variable}}"}
              </code>{" "}
              for dynamic content
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
          {(["edit", "preview"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200",
                activeTab === tab
                  ? "bg-white text-slate-900 shadow-sm shadow-slate-200"
                  : "text-slate-500 hover:text-slate-700",
              )}
            >
              {tab === "edit" ? (
                <Code2 className="w-3.5 h-3.5" />
              ) : (
                <Eye className="w-3.5 h-3.5" />
              )}
              {tab === "edit" ? "Edit" : "Preview"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 px-6 py-3 border-b border-slate-100 bg-slate-50/50">
        <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wide mr-1">
          Insert
        </span>
        {VARIABLE_CHIPS.map(({ label, color }) => (
          <button
            key={label}
            onClick={() => insertVariable(label)}
            className={cn(
              "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium border transition-all duration-150 cursor-pointer",
              COLOR_MAP[color],
            )}
          >
            <span className="opacity-50">{"{{"}</span>
            {label}
            <span className="opacity-50">{"}}"}</span>
          </button>
        ))}
      </div>

      <div className="relative flex-1">
        <div className={cn("flex", activeTab !== "edit" && "hidden")}>
          <div
            aria-hidden
            className="select-none w-12 pt-4 pb-4 text-right pr-3 text-[12px] font-mono text-slate-300 bg-slate-50/80 border-r border-slate-100 leading-7 overflow-hidden"
          >
            {Array.from({ length: Math.max(lineCount, 20) }, (_, i) => (
              <div
                key={i}
                className={cn(
                  "transition-colors",
                  i + 1 === focusedLine && "text-indigo-400 font-semibold",
                )}
              >
                {i + 1}
              </div>
            ))}
          </div>

          <Textarea
            ref={textareaRef as RefObject<HTMLTextAreaElement>}
            placeholder={`Dear {{candidateName}},\n\nWe're excited to invite you to interview for the {{jobTitle}} position at {{companyName}}.\n\nYour interview is scheduled for {{interviewDate}} at {{interviewTime}}...`}
            value={form.body}
            onChange={(e) => setForm((p) => ({ ...p, body: e.target.value }))}
            onKeyUp={(e) => {
              const ta = e.currentTarget;
              const line = ta.value
                .substring(0, ta.selectionStart)
                .split("\n").length;
              setFocusedLine(line);
            }}
            onClick={(e) => {
              const ta = e.currentTarget;
              const line = ta.value
                .substring(0, ta.selectionStart)
                .split("\n").length;
              setFocusedLine(line);
            }}
            className="flex-1 min-h-[60vh] lg:min-h-[65vh] font-mono text-[13px] leading-7 resize-none border-0 rounded-none focus-visible:ring-0 bg-transparent p-4 text-slate-800 placeholder:text-slate-300"
            spellCheck={false}
          />
        </div>

        {activeTab === "preview" && (
          <div
            className="min-h-[60vh] lg:min-h-[65vh] p-10 overflow-auto prose prose-slate prose-sm max-w-none
              prose-headings:font-semibold prose-a:text-indigo-600 prose-p:leading-relaxed
              prose-p:text-slate-700"
            dangerouslySetInnerHTML={{
              __html:
                previewHtml() ||
                `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:50vh;gap:12px;color:#cbd5e1">
                  <svg width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"/></svg>
                  <p style="font-size:14px;font-weight:500">Nothing to preview yet</p>
                  <p style="font-size:12px">Start writing in the Edit tab</p>
                </div>`,
            }}
          />
        )}
      </div>

      <div className="flex items-center justify-between px-6 py-3 border-t border-slate-100 bg-slate-50/70">
        <div className="flex items-center gap-4 text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <Type className="w-3 h-3" />
            <strong className="text-slate-600 font-semibold">
              {charCount}
            </strong>{" "}
            chars
          </span>
          <span className="text-slate-200">|</span>
          <span className="flex items-center gap-1">
            <Hash className="w-3 h-3" />
            <strong className="text-slate-600 font-semibold">
              {wordCount}
            </strong>{" "}
            words
          </span>
          {detectedVars.length > 0 && (
            <>
              <span className="text-slate-200">|</span>
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-indigo-400" />
                <span className="text-indigo-500 font-medium">
                  {detectedVars.length} variable
                  {detectedVars.length > 1 ? "s" : ""}
                </span>
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleUndo}
            disabled={histIdx === 0}
            title="Undo"
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleCopy}
            title="Copy body"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-all"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            {copied ? "Copied!" : "Copy"}
          </button>

          <div className="w-px h-4 bg-slate-200" />

          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <AlertCircle className="w-3 h-3" />
            Variables replaced on send
          </div>
        </div>
      </div>
    </div>
  );
}
