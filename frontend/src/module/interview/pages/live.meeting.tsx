import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  MonitorUp,
  MonitorOff,
  Users,
  FileText,
  Info,
  MessageSquare,
  PhoneOff,
  Loader2,
  AlertTriangle,
  WifiOff,
  X,
  RefreshCw,
  Send,
  CheckCircle2,
  User,
  Lock,
  Copy,
  ChevronDown,
  UserPlus,
  UserMinus,
  Wifi,
  HelpCircle,
  Plus,
} from "lucide-react";

import {
  useInterviewCall,
  type ParticipantRole,
} from "../hooks/common/useInterviewCall";
import { useInterviewDetails } from "../hooks/common/useInterview.details";
import { useEndInterview } from "../hooks/recruiter/useEndInterview";
import { useUpdateInterviewNotes } from "../hooks/recruiter/useUpdateInterviewNotes";
import { socketService } from "../services/SocketService";

const COLOR = {
  bg: "#202124",
  panel: "#2D2E30",
  panelAlt: "#28292C",
  border: "#3C4043",
  text: "#E8EAED",
  textMuted: "#9AA0A6",
  blue: "#8AB4F8",
  blueStrong: "#4285F4",
  green: "#34A853",
  yellow: "#FBBC04",
  red: "#EA4335",
};

const CHAT_CHAR_LIMIT = 1000;
const CHAT_SEND_COOLDOWN_MS = 100;
const CHAT_TEXTAREA_MAX_HEIGHT_PX = 144;

const FEEDBACK_CHAR_LIMIT = 3000;
const FEEDBACK_AUTOSAVE_DELAY_MS = 2000;

const QUICK_FEEDBACK_CHIPS: { label: string; text: string }[] = [
  { label: "Strong Communication", text: "Strong communication skills." },
  { label: "Problem Solving", text: "Good problem-solving approach." },
  { label: "Leadership", text: "Demonstrated leadership qualities." },
  { label: "React", text: "Solid understanding of React." },
  { label: "Node.js", text: "Good grasp of Node.js." },
  { label: "MongoDB", text: "Comfortable working with MongoDB." },
  {
    label: "Good Attitude",
    text: "Positive attitude throughout the interview.",
  },
  { label: "Team Player", text: "Comes across as a strong team player." },
  { label: "Fast Learner", text: "Picks up new concepts quickly." },
];

const KEYBOARD_SHORTCUTS: { keys: string; action: string }[] = [
  { keys: "Ctrl + D", action: "Toggle mute" },
  { keys: "Ctrl + E", action: "Toggle camera" },
  { keys: "Ctrl + Shift + S", action: "Toggle screen share" },
  { keys: "Enter", action: "Send chat message" },
  { keys: "Shift + Enter", action: "New line in chat" },
  { keys: "Esc", action: "Close panel" },
  { keys: "?", action: "Toggle this help" },
];

function feedbackDraftKey(interviewId: string): string {
  return `interview-feedback-draft-${interviewId}`;
}

function useCurrentUserId(): string {
  return typeof window !== "undefined"
    ? (localStorage.getItem("userId") ?? "")
    : "";
}

function useRoleFromPath(): ParticipantRole {
  const location = useLocation();
  return location.pathname.startsWith("/candidate") ? "candidate" : "recruiter";
}

function formatElapsed(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

function formatClock(ts: number): string {
  return new Date(ts).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDateLabel(ts: number): string {
  const d = new Date(ts);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const isSameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();
  if (isSameDay(d, today)) return "Today";
  if (isSameDay(d, yesterday)) return "Yesterday";
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function countWords(text: string): number {
  const trimmed = text.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

const LINK_PATTERN =
  /(https?:\/\/[^\s]+)|([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})|(\+?\d[\d\s-]{8,}\d)/g;

function renderMessageContent(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  LINK_PATTERN.lastIndex = 0;

  while ((match = LINK_PATTERN.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const [full, url, email, phone] = match;
    if (url) {
      parts.push(
        <a
          key={key++}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-1 underline-offset-2 hover:opacity-80"
        >
          🔗 {url.replace(/^https?:\/\//, "")}
        </a>,
      );
    } else if (email) {
      parts.push(
        <a
          key={key++}
          href={`mailto:${email}`}
          className="underline decoration-1 underline-offset-2 hover:opacity-80"
        >
          {email}
        </a>,
      );
    } else if (phone) {
      parts.push(
        <a
          key={key++}
          href={`tel:${phone.replace(/\s|-/g, "")}`}
          className="underline decoration-1 underline-offset-2 hover:opacity-80"
        >
          {phone}
        </a>,
      );
    }
    lastIndex = match.index + full.length;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts;
}

interface RoomNavState {
  roomId?: string;
}

interface Toast {
  id: string;
  text: string;
  tone: "info" | "success" | "warning";
}

type SystemEventVariant = "join" | "leave" | "reconnect" | "info";

interface SystemEventEntry {
  id: string;
  text: string;
  variant: SystemEventVariant;
  timestamp: number;
}

interface TimelineMessageEntry {
  kind: "message";
  id: string;
  key: string;
  text: string;
  timestamp: number;
  self: boolean;
}

interface TimelineSystemEntry {
  kind: "system";
  id: string;
  text: string;
  variant: SystemEventVariant;
  timestamp: number;
}

interface TimelineDateEntry {
  kind: "date";
  id: string;
  label: string;
  timestamp: number;
}

interface TimelineDividerEntry {
  kind: "divider";
  id: string;
  timestamp: number;
}

type TimelineEntry =
  | TimelineMessageEntry
  | TimelineSystemEntry
  | TimelineDateEntry
  | TimelineDividerEntry;

type SidebarTab = "participants" | "notes" | "info" | "chat";

function Avatar({ label, self = false }: { label: string; self?: boolean }) {
  return (
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
      style={{
        backgroundColor: self ? `${COLOR.blue}26` : COLOR.border,
        color: self ? COLOR.blue : COLOR.text,
      }}
    >
      {label}
    </div>
  );
}

function SystemEventIcon({ variant }: { variant: SystemEventVariant }) {
  switch (variant) {
    case "join":
      return <UserPlus className="w-3 h-3" style={{ color: COLOR.green }} />;
    case "leave":
      return <UserMinus className="w-3 h-3" style={{ color: COLOR.red }} />;
    case "reconnect":
      return <Wifi className="w-3 h-3" style={{ color: COLOR.blue }} />;
    default:
      return <Info className="w-3 h-3" style={{ color: COLOR.textMuted }} />;
  }
}

function StatusPill({
  connected,
  reconnecting,
}: {
  connected: boolean;
  reconnecting?: boolean;
}) {
  const color = connected
    ? COLOR.green
    : reconnecting
      ? COLOR.yellow
      : COLOR.textMuted;
  return (
    <span
      className="inline-flex items-center gap-1.5 text-[12px] font-medium"
      style={{ color }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: color }}
      />
      {connected
        ? "Connected"
        : reconnecting
          ? "Reconnecting…"
          : "Not connected"}
    </span>
  );
}

export default function InterviewRoomPage() {
  const { interviewId } = useParams<{ interviewId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const role = useRoleFromPath();
  const basePath = role === "candidate" ? "/candidate" : "/recruiter";
  const userId = useCurrentUserId();
  const otherRoleLabel = role === "recruiter" ? "Candidate" : "Recruiter";

  const {
    details,
    loading: detailsLoading,
    error: detailsError,
    refetch,
  } = useInterviewDetails({ interviewId: interviewId ?? "", role });

  const navRoomId = (location.state as RoomNavState | null)?.roomId;
  const roomId = navRoomId ?? details?.roomId ?? "";

  const [completionCountdown, setCompletionCountdown] = useState<number | null>(
    null,
  );

  const call = useInterviewCall({
    interviewId: interviewId ?? "",
    roomId,
    userId,
    role,
    onCallEnded: () => setCompletionCountdown(3),
    onError: () => {},
  });

  const {
    submit: submitEndInterview,
    loading: endingInterview,
    error: endInterviewError,
  } = useEndInterview();

  const { submit: submitInterviewNotes } = useUpdateInterviewNotes();

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);
  const chatInputRef = useRef<HTMLTextAreaElement | null>(null);
  const feedbackTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  const [activeTab, setActiveTab] = useState<SidebarTab | null>(null);


  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackSavedText, setFeedbackSavedText] = useState("");
  const [feedbackSaveStatus, setFeedbackSaveStatus] = useState<
    "idle" | "pending" | "saving" | "saved" | "error"
  >("idle");
  const [feedbackSaveError, setFeedbackSaveError] = useState<string | null>(
    null,
  );
  const [feedbackSavedAt, setFeedbackSavedAt] = useState<number | null>(null);
  const [draftRestored, setDraftRestored] = useState(false);
  const feedbackSaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const feedbackSaveRequestIdRef = useRef(0);
  const feedbackDirty = feedbackText !== feedbackSavedText;

  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [connectedAt, setConnectedAt] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [finalDurationSeconds, setFinalDurationSeconds] = useState<
    number | null
  >(null);

  const [draft, setDraft] = useState("");
  const [unreadChat, setUnreadChat] = useState(0);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [reconnectElapsed, setReconnectElapsed] = useState(0);
  const [systemEvents, setSystemEvents] = useState<SystemEventEntry[]>([]);
  const [sendingStatus, setSendingStatus] = useState<
    Record<string, "sending" | "sent">
  >({});
  const [chatAtBottom, setChatAtBottom] = useState(true);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [dividerBoundary, setDividerBoundary] = useState(0);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [screenShareElapsed, setScreenShareElapsed] = useState(0);

  const callInFlightRef = useRef(false);
  const remoteEverConnectedRef = useRef(false);
  const prevRemoteStreamRef = useRef<MediaStream | null>(null);
  const reconnectStartRef = useRef<number | null>(null);
  const activeTabRef = useRef<SidebarTab | null>(activeTab);
  const prevMessageCountRef = useRef(0);
  const lastSentAtRef = useRef(0);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const lastSeenTimestampRef = useRef<number>(Date.now());
  const screenShareStartRef = useRef<number | null>(null);
  const lastConnectionQualityRef = useRef<string>("Good connection");

  const addToast = useCallback((text: string, tone: Toast["tone"] = "info") => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setToasts((prev) => [...prev, { id, text, tone }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const pushSystemEvent = useCallback(
    (text: string, variant: SystemEventVariant = "info") => {
      setSystemEvents((prev) => [
        ...prev,
        {
          id: `sys-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          text,
          variant,
          timestamp: Date.now(),
        },
      ]);
    },
    [],
  );

  const getAudioCtx = useCallback(() => {
    if (typeof window === "undefined") return null;
    if (!audioCtxRef.current) {
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!Ctx) return null;
      audioCtxRef.current = new Ctx();
    }
    return audioCtxRef.current;
  }, []);

  const playTone = useCallback(
    (freq: number, duration: number, delay = 0, volume = 0.15) => {
      try {
        const ctx = getAudioCtx();
        if (!ctx) return;
        if (ctx.state === "suspended") {
          void ctx.resume();
        }
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;
        gain.gain.value = volume;
        osc.connect(gain);
        gain.connect(ctx.destination);
        const startTime = ctx.currentTime + delay;
        osc.start(startTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
        osc.stop(startTime + duration + 0.02);
      } catch (err) {
        console.warn("[AUDIO] Unable to play notification tone.", err);
      }
    },
    [getAudioCtx],
  );

  const playMessageDing = useCallback(() => {
    playTone(880, 0.12);
  }, [playTone]);

  const playJoinSound = useCallback(() => {
    playTone(523.25, 0.1, 0);
    playTone(783.99, 0.14, 0.1);
  }, [playTone]);

  const playLeaveSound = useCallback(() => {
    playTone(783.99, 0.1, 0);
    playTone(523.25, 0.14, 0.1);
  }, [playTone]);

  const showBrowserNotification = useCallback((title: string, body: string) => {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    if (Notification.permission === "granted") {
      try {
        new Notification(title, { body });
      } catch (err) {
        console.warn("[NOTIFICATION] Failed to show notification.", err);
      }
    }
  }, []);

  const startCall = useCallback(async () => {
    if (!roomId || !userId || !interviewId) return;
    if (callInFlightRef.current) return;
    if (call.callState === "ENDED" && !call.error) return;

    callInFlightRef.current = true;
    try {
      await call.initialize();
    } catch (err) {
      console.error("Failed to initialize interview call.", err);
    } finally {
      callInFlightRef.current = false;
    }
  }, [
    roomId,
    userId,
    interviewId,
    call.initialize,
    call.callState,
    call.error,
  ]);

  useEffect(() => {
    if (!roomId || !userId || !interviewId) return;
    void startCall();
  }, [roomId, userId, interviewId]);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "Notification" in window &&
      Notification.permission === "default"
    ) {
      Notification.requestPermission().catch(() => {});
    }
  }, []);

  useEffect(() => {
    activeTabRef.current = activeTab;
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "chat") {
      setDividerBoundary(lastSeenTimestampRef.current);
    } else {
      lastSeenTimestampRef.current = Date.now();
    }
  }, [activeTab]);

  useEffect(() => {
    if (call.callState === "CONNECTED" && connectedAt === null) {
      setConnectedAt(Date.now());
    }
    if (call.callState === "ENDED") {
      setFinalDurationSeconds((prev) =>
        prev !== null ? prev : elapsedSeconds,
      );
      setConnectedAt(null);
      setElapsedSeconds(0);
    }
  }, [call.callState]);

  useEffect(() => {
    if (connectedAt === null) return;
    const id = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - connectedAt) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, [connectedAt]);


  useEffect(() => {
    const video = localVideoRef.current;
    if (!video) return;
    video.srcObject = call.localStream;
    return () => {
      video.srcObject = null;
    };
  }, [call.localStream]);

  useEffect(() => {
    const video = remoteVideoRef.current;
    if (!video) return;
    video.srcObject = call.remoteStream;
    return () => {
      video.srcObject = null;
    };
  }, [call.remoteStream]);

  useEffect(() => {
    const had = prevRemoteStreamRef.current;
    const has = call.remoteStream;

    if (!had && has) {
      const alreadyJoinedBefore = remoteEverConnectedRef.current;
      addToast(
        alreadyJoinedBefore
          ? `${otherRoleLabel} reconnected`
          : `${otherRoleLabel} joined`,
        "success",
      );
      playJoinSound();
      pushSystemEvent(
        alreadyJoinedBefore
          ? `${otherRoleLabel} joined again.`
          : `${otherRoleLabel} joined.`,
        alreadyJoinedBefore ? "reconnect" : "join",
      );
      remoteEverConnectedRef.current = true;
      reconnectStartRef.current = null;
      setReconnectElapsed(0);
    } else if (had && !has && call.callState !== "ENDED") {
      addToast(`${otherRoleLabel} disconnected`, "warning");
      playLeaveSound();
      pushSystemEvent(
        `${otherRoleLabel} disconnected. Waiting for them to reconnect…`,
        "leave",
      );
      reconnectStartRef.current = Date.now();
    }

    prevRemoteStreamRef.current = has;
  }, [
    call.remoteStream,
    call.callState,
    otherRoleLabel,
    addToast,
    playJoinSound,
    playLeaveSound,
    pushSystemEvent,
  ]);

  useEffect(() => {
    if (reconnectStartRef.current === null) return;
    const id = setInterval(() => {
      if (reconnectStartRef.current === null) return;
      setReconnectElapsed(
        Math.floor((Date.now() - reconnectStartRef.current) / 1000),
      );
    }, 1000);
    return () => clearInterval(id);
  }, [call.remoteStream]);


  useEffect(() => {
    if (role !== "recruiter" || !interviewId) return;
    try {
      const stored = window.localStorage.getItem(feedbackDraftKey(interviewId));
      if (stored) {
        setFeedbackText(stored);
        setDraftRestored(true);
      }
    } catch (err) {
      console.warn("[FEEDBACK] Failed to read saved draft.", err);
    }
  }, [role, interviewId]);

  const saveFeedbackNow = useCallback(async (): Promise<boolean> => {
    if (feedbackSaveTimeoutRef.current) {
      clearTimeout(feedbackSaveTimeoutRef.current);
      feedbackSaveTimeoutRef.current = null;
    }
    if (!interviewId) return false;

    const textToSave = feedbackText;
    if (textToSave === feedbackSavedText && feedbackSaveStatus === "saved") {
      return true;
    }

    try {
      window.localStorage.setItem(feedbackDraftKey(interviewId), textToSave);
    } catch (err) {
      console.warn("[FEEDBACK] Failed to persist local draft.", err);
    }

    const requestId = ++feedbackSaveRequestIdRef.current;
    setFeedbackSaveStatus("saving");
    setFeedbackSaveError(null);

    const response = await submitInterviewNotes(interviewId, {
      notes: textToSave,
    });


    if (requestId !== feedbackSaveRequestIdRef.current) {
      return response !== null;
    }

    if (response === null) {
      setFeedbackSaveStatus("error");
      setFeedbackSaveError(
        "Couldn't save feedback to the server. It's kept locally — try again.",
      );
      return false;
    }

    try {
      window.localStorage.removeItem(feedbackDraftKey(interviewId));
    } catch (err) {
      console.warn("[FEEDBACK] Failed to clear local draft.", err);
    }
    setFeedbackSavedText(textToSave);
    setFeedbackSavedAt(Date.now());
    setFeedbackSaveStatus("saved");
    return true;
  }, [feedbackText, feedbackSavedText, feedbackSaveStatus, interviewId, submitInterviewNotes]);


  useEffect(() => {
    if (role !== "recruiter") return;
    if (feedbackText === feedbackSavedText) return;

    setFeedbackSaveStatus("pending");
    if (feedbackSaveTimeoutRef.current)
      clearTimeout(feedbackSaveTimeoutRef.current);
    feedbackSaveTimeoutRef.current = setTimeout(() => {
      void saveFeedbackNow();
    }, FEEDBACK_AUTOSAVE_DELAY_MS);

    return () => {
      if (feedbackSaveTimeoutRef.current) {
        clearTimeout(feedbackSaveTimeoutRef.current);
      }
    };

  }, [feedbackText, role]);


  useEffect(() => {
    function handleBeforeUnload(e: BeforeUnloadEvent) {
      if (role === "recruiter" && feedbackText !== feedbackSavedText) {
        e.preventDefault();
        e.returnValue = "";
      }
    }
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [role, feedbackText, feedbackSavedText]);

  const feedbackWordCount = useMemo(
    () => countWords(feedbackText),
    [feedbackText],
  );

  function handleInsertChip(text: string) {
    setFeedbackText((prev) => {
      const trimmed = prev.replace(/\s+$/, "");
      const bullet = `• ${text}`;
      const next = trimmed ? `${trimmed}\n${bullet}` : bullet;
      return next.slice(0, FEEDBACK_CHAR_LIMIT);
    });
    feedbackTextareaRef.current?.focus();
  }

  const timeline = useMemo<TimelineEntry[]>(() => {
    const msgEntries: TimelineMessageEntry[] = call.messages.map((m, idx) => ({
      kind: "message",
      id: `msg-${idx}-${m.sentAt}`,
      key: `${m.senderId}-${m.sentAt}`,
      text: m.message,
      timestamp: new Date(m.sentAt).getTime(),
      self: m.senderId === userId,
    }));
    const sysEntries: TimelineSystemEntry[] = systemEvents.map((s) => ({
      kind: "system",
      id: s.id,
      text: s.text,
      variant: s.variant,
      timestamp: s.timestamp,
    }));

    const merged = [...msgEntries, ...sysEntries].sort(
      (a, b) => a.timestamp - b.timestamp,
    );

    const result: TimelineEntry[] = [];
    let lastDay = "";
    let dividerInserted = false;

    for (const entry of merged) {
      const day = new Date(entry.timestamp).toDateString();
      if (day !== lastDay) {
        result.push({
          kind: "date",
          id: `date-${day}`,
          label: formatDateLabel(entry.timestamp),
          timestamp: entry.timestamp,
        });
        lastDay = day;
      }

      if (
        !dividerInserted &&
        entry.kind === "message" &&
        !entry.self &&
        entry.timestamp > dividerBoundary
      ) {
        result.push({
          kind: "divider",
          id: `divider-${entry.timestamp}`,
          timestamp: entry.timestamp,
        });
        dividerInserted = true;
      }

      result.push(entry);
    }

    return result;
  }, [call.messages, systemEvents, userId, dividerBoundary]);

  useEffect(() => {
    const msgs = call.messages;
    if (msgs.length <= prevMessageCountRef.current) {
      prevMessageCountRef.current = msgs.length;
      return;
    }
    const last = msgs[msgs.length - 1];
    prevMessageCountRef.current = msgs.length;

    const isSelf = last.senderId === userId;
    const key = `${last.senderId}-${last.sentAt}`;

    if (isSelf) {
      setSendingStatus((prev) => ({ ...prev, [key]: "sending" }));
      setTimeout(() => {
        setSendingStatus((prev) => ({ ...prev, [key]: "sent" }));
      }, 120);
      return;
    }

    const chatClosed = activeTabRef.current !== "chat";
    const tabHidden = typeof document !== "undefined" && document.hidden;

    if (chatClosed || tabHidden) {
      setUnreadChat((n) => n + 1);
    }
    if (chatClosed) {
      const preview =
        last.message.length > 60
          ? `${last.message.slice(0, 60)}…`
          : last.message;
      addToast(`💬 ${otherRoleLabel}: ${preview}`, "info");
      playMessageDing();
    }
    if (tabHidden) {
      showBrowserNotification(otherRoleLabel, last.message);
    }
  }, [
    call.messages,
    userId,
    otherRoleLabel,
    addToast,
    playMessageDing,
    showBrowserNotification,
  ]);

  useEffect(() => {
    if (activeTab === "chat") setUnreadChat(0);
  }, [activeTab]);

  useEffect(() => {
    function handleVisibility() {
      if (!document.hidden && activeTabRef.current === "chat") {
        setUnreadChat(0);
      }
    }
    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  const scrollToBottom = useCallback((smooth = true) => {
    const el = chatScrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: smooth ? "smooth" : "auto" });
    setChatAtBottom(true);
  }, []);

  function handleChatScroll() {
    const el = chatScrollRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 48;
    setChatAtBottom(atBottom);
  }

  useEffect(() => {
    if (activeTab !== "chat") return;
    if (chatAtBottom) scrollToBottom(true);
  }, [timeline.length, activeTab]);

  useEffect(() => {
    if (activeTab === "chat") {
      scrollToBottom(false);
      const t = setTimeout(() => chatInputRef.current?.focus(), 160);
      return () => clearTimeout(t);
    }
  }, [activeTab]);

  useEffect(() => {
    if (completionCountdown === null) return;
    if (completionCountdown <= 0) {
      if (role === "recruiter") {
        navigate(`${basePath}/interviews/${interviewId}/screening-complete`);
      } else {
        navigate(`${basePath}/interviews`);
      }

      return;
    }
    const t = setTimeout(() => {
      setCompletionCountdown((c) => (c === null ? null : c - 1));
    }, 1000);
    return () => clearTimeout(t);
  }, [completionCountdown, navigate, basePath]);

  const connectionInfo = useMemo(() => {
    switch (call.iceConnectionState) {
      case "connected":
      case "completed":
        return { text: "Excellent connection", color: COLOR.green };
      case "checking":
      case "new":
        return { text: "Connecting…", color: COLOR.yellow };
      case "disconnected":
        return { text: "Connection unstable", color: COLOR.yellow };
      case "failed":
      case "closed":
        return { text: "Disconnected", color: COLOR.red };
      default:
        return { text: "Connecting…", color: COLOR.textMuted };
    }
  }, [call.iceConnectionState]);

  useEffect(() => {
    if (call.callState !== "ENDED") {
      lastConnectionQualityRef.current = connectionInfo.text;
    }
  }, [connectionInfo.text, call.callState]);

  const iceFailed =
    call.iceConnectionState === "failed" && call.callState !== "ENDED";

  const retryCall = useCallback(async () => {
    if (call.callState === "ENDED" && !call.error) return;

    callInFlightRef.current = false;
    try {
      await call.endCall();
    } catch (err) {
      console.error("Failed to tear down the stale call before retrying.", err);
    }

    callInFlightRef.current = true;
    try {
      await call.initialize();
    } catch (err) {
      console.error("Failed to reinitialize interview call.", err);
    } finally {
      callInFlightRef.current = false;
    }
  }, [call]);

  const handleToggleMic = useCallback(async () => {
    const wasMuted = call.isMuted;
    try {
      await Promise.resolve(call.toggleMicrophone());
      addToast(
        wasMuted
          ? "🎤 You're unmuted — others can hear you"
          : "🎤 You're muted",
        "info",
      );
    } catch (err) {
      console.error("Failed to toggle microphone.", err);
      addToast(
        "Microphone blocked. Grant microphone permission and try again.",
        "warning",
      );
    }
  }, [call, addToast]);

  const handleToggleCamera = useCallback(async () => {
    const wasEnabled = call.isCameraEnabled;
    setCameraLoading(true);
    try {
      await Promise.resolve(call.toggleCamera());
      addToast(
        wasEnabled ? "📷 Camera is now off" : "📷 Camera is now on",
        "success",
      );
    } catch (err) {
      console.error("Failed to toggle camera.", err);
      addToast(
        "Camera unavailable. Check permissions or close other apps using it, then retry.",
        "warning",
      );
    } finally {
      setCameraLoading(false);
    }
  }, [call, addToast]);

  const handleToggleScreenShare = useCallback(async () => {
    const wasSharing = call.isScreenSharing;
    try {
      await Promise.resolve(call.toggleScreenShare());
      addToast(
        wasSharing
          ? "Screen sharing stopped"
          : "🖥️ You're presenting your screen",
        "info",
      );
    } catch (err) {
      console.error("Failed to toggle screen share.", err);
      addToast("Screen sharing cancelled.", "warning");
    }
  }, [call, addToast]);


  useEffect(() => {
    if (!call.isScreenSharing) {
      screenShareStartRef.current = null;
      setScreenShareElapsed(0);
      return;
    }
    screenShareStartRef.current = Date.now();
    setScreenShareElapsed(0);
    const id = setInterval(() => {
      if (screenShareStartRef.current !== null) {
        setScreenShareElapsed(
          Math.floor((Date.now() - screenShareStartRef.current) / 1000),
        );
      }
    }, 1000);
    return () => clearInterval(id);
  }, [call.isScreenSharing]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const key = e.key.toLowerCase();
      const target = e.target as HTMLElement | null;
      const typing =
        target &&
        (target.tagName === "TEXTAREA" ||
          target.tagName === "INPUT" ||
          target.isContentEditable);

      if (e.key === "Escape") {
        if (showShortcuts) {
          setShowShortcuts(false);
          return;
        }
        if (!typing && activeTab) {
          setActiveTab(null);
        }
        return;
      }

      if (typing) return;

      if (e.ctrlKey && e.shiftKey && key === "s") {
        e.preventDefault();
        void handleToggleScreenShare();
      } else if (e.ctrlKey && key === "d") {
        e.preventDefault();
        void handleToggleMic();
      } else if (e.ctrlKey && key === "e") {
        e.preventDefault();
        void handleToggleCamera();
      } else if (key === "?") {
        e.preventDefault();
        setShowShortcuts((s) => !s);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [
    handleToggleMic,
    handleToggleCamera,
    handleToggleScreenShare,
    showShortcuts,
    activeTab,
  ]);

  function toggleTab(tab: SidebarTab) {
    setActiveTab((prev) => (prev === tab ? null : tab));
  }

 async function handleConfirmEndCall() {
  if (role === "recruiter") {
    if (!interviewId) return;

    if (feedbackDirty) {
      const saved = await saveFeedbackNow();
      if (!saved) return;
    }

    const response = await submitEndInterview(interviewId);

    if (!response) return;

    socketService.endInterview({
      roomId,
      interviewId,
    });

    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  setShowEndConfirm(false);

  await call.endCall();
}

  function handleLeaveClick() {
    if (role === "recruiter") {
      if (!feedbackText.trim()) {
        setActiveTab("notes");
        addToast(
          "Interview feedback is required before ending the interview.",
          "warning",
        );
        feedbackTextareaRef.current?.focus();
        return;
      }

      if (feedbackDirty || feedbackSaveStatus === "error") {
        setShowUnsavedWarning(true);
        return;
      }
    }

    setShowEndConfirm(true);
  }

  async function handleSaveAndProceed() {
    const saved = await saveFeedbackNow();
    if (!saved) return;
    setShowUnsavedWarning(false);
    setShowEndConfirm(true);
  }

  function handleDiscardAndProceed() {
    setFeedbackText(feedbackSavedText);
    setFeedbackSaveStatus(feedbackSavedAt !== null ? "saved" : "idle");
    setFeedbackSaveError(null);
    setShowUnsavedWarning(false);
    setShowEndConfirm(true);
  }

  function handleCancelUnsavedWarning() {
    setShowUnsavedWarning(false);
  }

  function handleCancelEndCall() {
    if (endingInterview) return;
    setShowEndConfirm(false);
  }

  function handleDraftChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const value = e.target.value.slice(0, CHAT_CHAR_LIMIT);
    setDraft(value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, CHAT_TEXTAREA_MAX_HEIGHT_PX)}px`;
  }

  function handleSendMessage() {
    const raw = draft;
    const text = raw.trim();
    if (!text) return;
    if (text.length > CHAT_CHAR_LIMIT) return;

    const now = Date.now();
    if (now - lastSentAtRef.current < CHAT_SEND_COOLDOWN_MS) return;
    lastSentAtRef.current = now;

    call.sendMessage(text);
    setDraft("");
    if (chatInputRef.current) {
      chatInputRef.current.style.height = "auto";
    }
    chatInputRef.current?.focus();
  }

  function handleChatKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }

  async function handleCopyMessage(id: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessageId(id);
      setTimeout(() => {
        setCopiedMessageId((cur) => (cur === id ? null : cur));
      }, 1500);
    } catch (err) {
      console.warn("[CHAT] Failed to copy message.", err);
    }
  }

  if (detailsLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: COLOR.bg }}
      >
        <div className="flex flex-col items-center gap-3">
          <Loader2
            className="w-8 h-8 animate-spin"
            style={{ color: COLOR.blue }}
          />
          <p
            className="text-[15px] font-medium"
            style={{ color: COLOR.textMuted }}
          >
            Loading interview…
          </p>
        </div>
      </div>
    );
  }

  if (detailsError || !details) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{ backgroundColor: COLOR.bg }}
      >
        <div
          className="rounded-2xl shadow-lg p-8 max-w-sm text-center"
          style={{ backgroundColor: COLOR.panel }}
        >
          <AlertTriangle
            className="w-10 h-10 mx-auto mb-3"
            style={{ color: COLOR.red }}
          />
          <p className="font-semibold mb-1" style={{ color: COLOR.text }}>
            Couldn't load this interview
          </p>
          <p className="text-[14px] mb-5" style={{ color: COLOR.textMuted }}>
            {detailsError}
          </p>
          <button
            onClick={refetch}
            className="px-4 py-2.5 text-white text-[14px] font-semibold rounded-full transition-opacity hover:opacity-90"
            style={{ backgroundColor: COLOR.blueStrong }}
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!roomId) {
    return <Navigate to={`${basePath}/interviews`} replace />;
  }

  if (call.callState === "ENDED" && call.error) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{ backgroundColor: COLOR.bg }}
      >
        <div
          className="rounded-2xl shadow-lg p-8 max-w-sm text-center"
          style={{ backgroundColor: COLOR.panel }}
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: `${COLOR.red}1A` }}
          >
            <AlertTriangle className="w-6 h-6" style={{ color: COLOR.red }} />
          </div>
          <p className="font-semibold mb-1" style={{ color: COLOR.text }}>
            The call couldn't continue
          </p>
          <p className="text-[14px] mb-6" style={{ color: COLOR.textMuted }}>
            {call.error}
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => navigate(`${basePath}/interviews`)}
              className="flex-1 px-4 py-2.5 font-medium rounded-full text-[14px] transition-colors"
              style={{ color: COLOR.text, backgroundColor: COLOR.panelAlt }}
            >
              Back to interviews
            </button>
            <button
              onClick={retryCall}
              className="flex-1 px-4 py-2.5 text-white font-semibold rounded-full text-[14px] transition-opacity hover:opacity-90 flex items-center justify-center gap-2"
              style={{ backgroundColor: COLOR.blueStrong }}
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (call.callState === "ENDED") {
    const shownDuration = finalDurationSeconds ?? 0;
    const countdown = completionCountdown ?? 0;
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{ backgroundColor: COLOR.bg }}
      >
        <div
          className="rounded-2xl shadow-lg p-8 max-w-sm w-full text-center"
          style={{ backgroundColor: COLOR.panel }}
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: `${COLOR.green}1A` }}
          >
            <CheckCircle2 className="w-7 h-7" style={{ color: COLOR.green }} />
          </div>
          <p
            className="font-semibold text-[17px] mb-1"
            style={{ color: COLOR.text }}
          >
            Interview complete
          </p>
          <p className="text-[14px] mb-6" style={{ color: COLOR.textMuted }}>
            {role === "recruiter"
              ? "Thanks for joining — this interview has been marked as completed."
              : "Thanks for joining — the recruiter will follow up soon."}
          </p>

          <div
            className="rounded-xl overflow-hidden mb-6 divide-y"
            style={{
              backgroundColor: COLOR.panelAlt,
              borderColor: COLOR.border,
            }}
          >
            <div className="px-4 py-3 flex items-center justify-between">
              <span
                className="text-[12px] font-semibold uppercase tracking-wide"
                style={{ color: COLOR.textMuted }}
              >
                Duration
              </span>
              <span
                className="text-[14px] font-mono font-semibold tabular-nums"
                style={{ color: COLOR.text }}
              >
                {formatElapsed(shownDuration)}
              </span>
            </div>

            {role === "recruiter" && (
              <div
                className="px-4 py-3 flex items-center justify-between"
                style={{ borderTop: `1px solid ${COLOR.border}` }}
              >
                <span
                  className="text-[12px] font-semibold uppercase tracking-wide"
                  style={{ color: COLOR.textMuted }}
                >
                  Feedback
                </span>
                <span
                  className="text-[13px] font-medium flex items-center gap-1.5"
                  style={{
                    color: feedbackSavedAt ? COLOR.green : COLOR.textMuted,
                  }}
                >
                  {feedbackSavedAt ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" /> Saved
                    </>
                  ) : (
                    "Not saved"
                  )}
                </span>
              </div>
            )}

            <div
              className="px-4 py-3 flex items-center justify-between"
              style={{ borderTop: `1px solid ${COLOR.border}` }}
            >
              <span
                className="text-[12px] font-semibold uppercase tracking-wide"
                style={{ color: COLOR.textMuted }}
              >
                Chat
              </span>
              <span
                className="text-[13px] font-medium"
                style={{ color: COLOR.text }}
              >
                {call.messages.length} message
                {call.messages.length === 1 ? "" : "s"}
              </span>
            </div>

            <div
              className="px-4 py-3 flex items-center justify-between"
              style={{ borderTop: `1px solid ${COLOR.border}` }}
            >
              <span
                className="text-[12px] font-semibold uppercase tracking-wide"
                style={{ color: COLOR.textMuted }}
              >
                Connection
              </span>
              <span
                className="text-[13px] font-medium"
                style={{ color: COLOR.text }}
              >
                {lastConnectionQualityRef.current}
              </span>
            </div>
          </div>

          <p className="text-[13px] mb-4" style={{ color: COLOR.textMuted }}>
            Redirecting in {countdown}…
          </p>

          <button
            onClick={() => navigate(`${basePath}/interviews`)}
            className="w-full px-4 py-2.5 text-white text-[14px] font-semibold rounded-full transition-opacity hover:opacity-90"
            style={{ backgroundColor: COLOR.blueStrong }}
          >
            Back to interviews now
          </button>
        </div>
      </div>
    );
  }

  const cameraOn = call.isCameraEnabled && !!call.localStream;
  const isReconnectingRemote =
    !call.remoteStream && remoteEverConnectedRef.current;
  const chatInputDisabled = call.loading;
  const chatPlaceholder = chatInputDisabled
    ? "Connecting…"
    : role === "recruiter"
      ? "Message the candidate…"
      : "Message the recruiter…";

  const rail: {
    id: SidebarTab;
    label: string;
    icon: typeof Users;
    mobileHidden?: boolean;
  }[] = [
    { id: "participants", label: "People", icon: Users, mobileHidden: true },
    { id: "chat", label: "Chat", icon: MessageSquare },
    ...(role === "recruiter"
      ? ([
          {
            id: "notes",
            label: "Feedback",
            icon: FileText,
            mobileHidden: true,
          },
        ] as const)
      : []),
    { id: "info", label: "Details", icon: Info, mobileHidden: true },
  ];

  return (
    <div
      className="flex flex-col h-screen overflow-hidden"
      style={{ backgroundColor: COLOR.bg }}
    >
      <div className="fixed top-4 right-4 z-60 flex flex-col gap-2 items-end pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto px-3.5 py-2 rounded-lg text-[13px] font-medium shadow-lg backdrop-blur-sm animate-[toastIn_150ms_ease-out]"
            style={{
              backgroundColor:
                t.tone === "success"
                  ? `${COLOR.green}26`
                  : t.tone === "warning"
                    ? `${COLOR.yellow}26`
                    : `${COLOR.panel}F2`,
              color:
                t.tone === "success"
                  ? COLOR.green
                  : t.tone === "warning"
                    ? COLOR.yellow
                    : COLOR.text,
            }}
          >
            {t.text}
          </div>
        ))}
      </div>

      <div
        className="px-4 sm:px-6 py-3 flex items-center justify-between gap-3 z-10 shrink-0"
        style={{ backgroundColor: COLOR.bg }}
      >
        <h1
          className="text-[15px] font-medium truncate"
          style={{ color: COLOR.text }}
        >
          {details.title}
        </h1>

        <div className="flex items-center gap-4 shrink-0">
          <span
            className="text-[14px] font-mono tabular-nums"
            style={{ color: COLOR.textMuted }}
          >
            {formatElapsed(elapsedSeconds)}
          </span>
          <button
            onClick={() => setShowShortcuts(true)}
            title="Keyboard shortcuts (?)"
            aria-label="Keyboard shortcuts"
            className="p-1 rounded-md hover:opacity-80 transition-opacity"
            style={{ color: COLOR.textMuted }}
          >
            <HelpCircle className="w-4 h-4" />
          </button>
          <span
            title={connectionInfo.text}
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: connectionInfo.color }}
          />
        </div>
      </div>

      {(call.error || call.loading || iceFailed) && (
        <div className="px-4 sm:px-6 pb-2 shrink-0">
          {call.error && (
            <div
              className="mb-2 rounded-xl px-4 py-3 flex items-start gap-2.5"
              style={{ backgroundColor: `${COLOR.red}1A` }}
            >
              <AlertTriangle
                size={16}
                className="shrink-0 mt-0.5"
                style={{ color: COLOR.red }}
              />
              <div className="flex-1">
                <p
                  className="text-[14px] font-semibold"
                  style={{ color: COLOR.red }}
                >
                  Something went wrong
                </p>
                <p
                  className="text-[13px] mt-0.5"
                  style={{ color: COLOR.textMuted }}
                >
                  {call.error}
                </p>
              </div>
              <button
                onClick={retryCall}
                className="text-[13px] font-semibold shrink-0"
                style={{ color: COLOR.red }}
              >
                Retry
              </button>
            </div>
          )}
          {!call.error && iceFailed && (
            <div
              className="mb-2 rounded-xl px-4 py-3 flex items-start gap-2.5"
              style={{ backgroundColor: `${COLOR.yellow}1A` }}
            >
              <WifiOff
                size={16}
                className="shrink-0 mt-0.5"
                style={{ color: COLOR.yellow }}
              />
              <div className="flex-1">
                <p
                  className="text-[14px] font-semibold"
                  style={{ color: COLOR.yellow }}
                >
                  Connection lost
                </p>
                <p
                  className="text-[13px] mt-0.5"
                  style={{ color: COLOR.textMuted }}
                >
                  The call dropped unexpectedly. You can reconnect without
                  ending the interview.
                </p>
              </div>
              <button
                onClick={retryCall}
                className="text-[13px] font-semibold shrink-0"
                style={{ color: COLOR.yellow }}
              >
                Reconnect
              </button>
            </div>
          )}
          {call.loading && !call.error && (
            <div
              className="mb-2 rounded-xl px-4 py-3 flex items-center gap-2.5"
              style={{ backgroundColor: `${COLOR.blue}1A` }}
            >
              <Loader2
                size={16}
                className="animate-spin shrink-0"
                style={{ color: COLOR.blue }}
              />
              <p
                className="text-[14px] font-medium"
                style={{ color: COLOR.blue }}
              >
                Connecting to the interview room…
              </p>
            </div>
          )}
        </div>
      )}

      <div className="flex-1 relative min-h-0 px-3 sm:px-4 pb-3 sm:pb-4">
        <div
          className="w-full h-full rounded-3xl overflow-hidden relative"
          style={{ backgroundColor: "#000" }}
        >
          {call.remoteStream ? (
            <>
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              <span
                className="absolute bottom-5 left-5 inline-flex items-center gap-1.5 text-white text-[13px] font-medium px-2.5 py-1 rounded-md backdrop-blur-sm"
                style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
              >
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: connectionInfo.color }}
                />
                {otherRoleLabel}
              </span>
            </>
          ) : isReconnectingRemote ? (
            <div className="w-full h-full flex flex-col items-center justify-center gap-3 px-6">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${COLOR.yellow}1A` }}
              >
                <AlertTriangle
                  className="w-7 h-7"
                  style={{ color: COLOR.yellow }}
                />
              </div>
              <p
                className="text-[15px] font-semibold text-center"
                style={{ color: COLOR.text }}
              >
                {otherRoleLabel} lost connection
              </p>
              <p
                className="text-[13px] text-center"
                style={{ color: COLOR.textMuted }}
              >
                Attempting to reconnect…
              </p>
              <p
                className="text-[13px] font-mono tabular-nums"
                style={{ color: COLOR.textMuted }}
              >
                Elapsed {formatElapsed(reconnectElapsed)}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <button
                  onClick={() => setActiveTab("chat")}
                  className="px-3 py-1.5 rounded-full text-[12px] font-semibold"
                  style={{ backgroundColor: COLOR.panelAlt, color: COLOR.text }}
                >
                  Message {otherRoleLabel}
                </button>
                <button
                  onClick={retryCall}
                  className="px-3 py-1.5 rounded-full text-[12px] font-semibold"
                  style={{ backgroundColor: COLOR.blueStrong, color: "#fff" }}
                >
                  Reconnect
                </button>
              </div>
              <p
                className="text-[12px] text-center max-w-xs mt-1"
                style={{ color: COLOR.textMuted }}
              >
                Keep this page open.
              </p>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-3 px-6">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
              >
                {call.callState === "CONNECTING" ? (
                  <Loader2
                    className="w-7 h-7 animate-spin"
                    style={{ color: COLOR.textMuted }}
                  />
                ) : (
                  <Users
                    className="w-7 h-7"
                    style={{ color: COLOR.textMuted }}
                  />
                )}
              </div>
              <p
                className="text-[15px] font-semibold text-center"
                style={{ color: COLOR.text }}
              >
                Waiting for {otherRoleLabel.toLowerCase()}…
              </p>
              <p
                className="text-[13px] text-center"
                style={{ color: COLOR.textMuted }}
              >
                Invite sent
              </p>
              <p
                className="text-[12px] text-center max-w-xs"
                style={{ color: COLOR.textMuted }}
              >
                The interview will begin automatically once they join.
              </p>
            </div>
          )}

          <div
            className="absolute top-4 right-4 w-32 h-20 sm:w-52 sm:h-32 rounded-2xl overflow-hidden shadow-lg"
            style={{ backgroundColor: COLOR.panel }}
          >
            {cameraOn ? (
              <video
                key={call.localStream ? call.localStream.id : "local-stream"}
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover scale-x-[-1]"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-1 px-2 text-center">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: COLOR.panelAlt }}
                >
                  <User
                    className="w-4 h-4"
                    style={{ color: COLOR.textMuted }}
                  />
                </div>
                <span
                  className="text-[10px] font-medium"
                  style={{ color: COLOR.textMuted }}
                >
                  Your camera is off
                </span>
                <span
                  className="text-[9px] hidden sm:block"
                  style={{ color: COLOR.textMuted }}
                >
                  Others can still hear you
                </span>
              </div>
            )}

            {cameraLoading && (
              <div
                className="absolute inset-0 flex flex-col items-center justify-center gap-1.5"
                style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
              >
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span className="text-[9px] font-medium text-white/90">
                  {call.isCameraEnabled ? "Turning off…" : "Turning on…"}
                </span>
              </div>
            )}

            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-1.5 py-1">
              <span
                className="text-[10px] font-medium text-white/80 px-1.5 py-0.5 rounded backdrop-blur-sm"
                style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
              >
                You
              </span>
              {call.isMuted && (
                <span
                  className="rounded-full p-1"
                  style={{ backgroundColor: COLOR.red }}
                >
                  <MicOff className="w-2.5 h-2.5 text-white" />
                </span>
              )}
            </div>
          </div>

          {call.isScreenSharing && (
            <button
              onClick={() => void handleToggleScreenShare()}
              className="absolute top-4 left-4 inline-flex items-center gap-1.5 text-white text-[13px] font-semibold px-2.5 py-1 rounded-full shadow-sm transition-opacity hover:opacity-90"
              style={{ backgroundColor: COLOR.blueStrong }}
              title="Click to stop sharing"
            >
              <MonitorUp className="w-3.5 h-3.5" />
              You're presenting · {formatElapsed(screenShareElapsed)}
            </button>
          )}

          <div
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full flex flex-col gap-1 p-1.5 shadow-lg backdrop-blur-sm"
            style={{ backgroundColor: `${COLOR.panel}E6` }}
          >
            {rail.map(({ id, label, icon: Icon, mobileHidden }) => (
              <button
                key={id}
                onClick={() => toggleTab(id)}
                title={label}
                aria-label={label}
                className={`relative p-2.5 rounded-full transition-colors ${mobileHidden ? "hidden sm:flex" : "flex"}`}
                style={{
                  backgroundColor:
                    activeTab === id ? `${COLOR.blue}26` : "transparent",
                  color: activeTab === id ? COLOR.blue : COLOR.text,
                }}
              >
                <Icon className="w-4 h-4" />
                {id === "chat" && unreadChat > 0 && (
                  <span
                    key={unreadChat}
                    className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full text-white text-[10px] font-bold flex items-center justify-center animate-[badgeBump_300ms_ease-out]"
                    style={{ backgroundColor: COLOR.red }}
                  >
                    {unreadChat}
                  </span>
                )}
                {id === "notes" &&
                  (feedbackSaveStatus === "error" || feedbackDirty) && (
                    <span
                      className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full"
                      style={{
                        backgroundColor:
                          feedbackSaveStatus === "error"
                            ? COLOR.red
                            : COLOR.yellow,
                      }}
                    />
                  )}
              </button>
            ))}
          </div>

          <div
            className="absolute left-1/2 -translate-x-1/2 bottom-5 rounded-full flex items-center gap-2 px-3 py-2.5 shadow-xl backdrop-blur-sm"
            style={{ backgroundColor: `${COLOR.panel}F2` }}
          >
            <button
              onClick={() => void handleToggleMic()}
              title={call.isMuted ? "Unmute (Ctrl+D)" : "Mute (Ctrl+D)"}
              aria-label={
                call.isMuted ? "Unmute microphone" : "Mute microphone"
              }
              className="p-3 rounded-full transition-colors"
              style={{
                backgroundColor: call.isMuted ? COLOR.red : COLOR.panelAlt,
                color: "#fff",
              }}
            >
              {call.isMuted ? (
                <MicOff className="w-5 h-5" />
              ) : (
                <Mic className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={() => void handleToggleCamera()}
              disabled={cameraLoading}
              title={
                call.isCameraEnabled
                  ? "Turn camera off (Ctrl+E)"
                  : "Turn camera on (Ctrl+E)"
              }
              aria-label={
                call.isCameraEnabled ? "Turn camera off" : "Turn camera on"
              }
              className="p-3 rounded-full transition-colors disabled:opacity-60"
              style={{
                backgroundColor: !call.isCameraEnabled
                  ? COLOR.red
                  : COLOR.panelAlt,
                color: "#fff",
              }}
            >
              {cameraLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : call.isCameraEnabled ? (
                <Video className="w-5 h-5" />
              ) : (
                <VideoOff className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={() => void handleToggleScreenShare()}
              title={
                call.isScreenSharing
                  ? "Stop sharing (Ctrl+Shift+S)"
                  : "Share your screen (Ctrl+Shift+S)"
              }
              aria-label={
                call.isScreenSharing
                  ? "Stop screen share"
                  : "Start screen share"
              }
              className="p-3 rounded-full transition-colors"
              style={{
                backgroundColor: call.isScreenSharing
                  ? `${COLOR.blue}33`
                  : COLOR.panelAlt,
                color: call.isScreenSharing ? COLOR.blue : "#fff",
              }}
            >
              {call.isScreenSharing ? (
                <MonitorOff className="w-5 h-5" />
              ) : (
                <MonitorUp className="w-5 h-5" />
              )}
            </button>

            <div
              className="w-px h-8 mx-1"
              style={{ backgroundColor: COLOR.border }}
            />

            <button
              onClick={handleLeaveClick}
              disabled={endingInterview}
              title={role === "recruiter" ? "End interview" : "Leave"}
              aria-label={role === "recruiter" ? "End interview" : "Leave call"}
              className="p-4 rounded-full transition-opacity hover:opacity-90 disabled:opacity-60"
              style={{ backgroundColor: COLOR.red }}
            >
              {endingInterview ? (
                <Loader2 className="w-5 h-5 text-white animate-spin" />
              ) : (
                <PhoneOff className="w-5 h-5 text-white" />
              )}
            </button>
          </div>

          {activeTab && (
            <div
              className="absolute right-4 top-4 bottom-4 w-72 sm:w-80 rounded-2xl flex flex-col shadow-2xl z-20 animate-[panelIn_150ms_ease-out]"
              style={{ backgroundColor: `${COLOR.panel}FA` }}
            >
              <div
                className="flex items-center justify-between px-4 py-3.5 shrink-0"
                style={{ borderBottom: `1px solid ${COLOR.border}` }}
              >
                <span
                  className="text-[14px] font-semibold"
                  style={{ color: COLOR.text }}
                >
                  {rail.find((t) => t.id === activeTab)?.label}
                </span>
                <button
                  onClick={() => setActiveTab(null)}
                  className="p-1 rounded-md"
                  style={{ color: COLOR.textMuted }}
                  aria-label="Close panel"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 min-h-0 flex flex-col">
                {activeTab === "notes" && role === "recruiter" && (
                  <div className="flex-1 min-h-0 flex flex-col">
                    <div
                      className="flex items-center justify-between px-4 py-2.5 shrink-0"
                      style={{ borderBottom: `1px solid ${COLOR.border}` }}
                    >
                      <span
                        className="text-[12px] font-medium flex items-center gap-1.5"
                        style={{
                          color:
                            feedbackSaveStatus === "saving" ||
                            feedbackSaveStatus === "pending"
                              ? COLOR.yellow
                              : feedbackSaveStatus === "error"
                                ? COLOR.red
                                : feedbackSaveStatus === "saved"
                                  ? COLOR.green
                                  : COLOR.textMuted,
                        }}
                      >
                        {feedbackSaveStatus === "saving" ? (
                          <>
                            <Loader2 className="w-3 h-3 animate-spin" /> Saving…
                          </>
                        ) : feedbackSaveStatus === "pending" ? (
                          "Unsaved changes…"
                        ) : feedbackSaveStatus === "error" ? (
                          <>
                            <AlertTriangle className="w-3 h-3" /> Couldn't save
                          </>
                        ) : feedbackSaveStatus === "saved" ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" /> Saved
                          </>
                        ) : (
                          "Not saved yet"
                        )}
                      </span>
                      {feedbackSaveStatus === "error" ? (
                        <button
                          onClick={() => void saveFeedbackNow()}
                          className="text-[11px] font-semibold"
                          style={{ color: COLOR.red }}
                        >
                          Retry
                        </button>
                      ) : (
                        feedbackSavedAt &&
                        feedbackSaveStatus === "saved" && (
                          <span
                            className="text-[11px]"
                            style={{ color: COLOR.textMuted }}
                          >
                            Last saved {formatClock(feedbackSavedAt)}
                          </span>
                        )
                      )}
                    </div>

                    {feedbackSaveStatus === "error" && feedbackSaveError && (
                      <div
                        className="mx-4 mt-3 rounded-lg px-3 py-2.5 shrink-0"
                        style={{ backgroundColor: `${COLOR.red}1A` }}
                      >
                        <p className="text-[12px]" style={{ color: COLOR.red }}>
                          {feedbackSaveError}
                        </p>
                      </div>
                    )}

                    {draftRestored && (
                      <div
                        className="mx-4 mt-3 rounded-lg px-3 py-2.5 flex items-center justify-between gap-2 shrink-0"
                        style={{ backgroundColor: `${COLOR.blue}1A` }}
                      >
                        <span
                          className="text-[12px] font-medium"
                          style={{ color: COLOR.blue }}
                        >
                          Draft recovered — continue writing?
                        </span>
                        <button
                          onClick={() => setDraftRestored(false)}
                          className="text-[12px] font-semibold shrink-0"
                          style={{ color: COLOR.blue }}
                        >
                          Dismiss
                        </button>
                      </div>
                    )}

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      <div>
                        <label
                          className="block text-[12px] font-semibold uppercase tracking-wide mb-2"
                          style={{ color: COLOR.textMuted }}
                        >
                          Interview Feedback
                        </label>
                        <textarea
                          ref={feedbackTextareaRef}
                          value={feedbackText}
                          onChange={(e) =>
                            setFeedbackText(
                              e.target.value.slice(0, FEEDBACK_CHAR_LIMIT),
                            )
                          }
                          className="w-full h-56 px-3 py-2.5 rounded-lg text-[14px] leading-6 resize-none focus:outline-none focus:ring-2"
                          style={{
                            backgroundColor: COLOR.panelAlt,
                            color: COLOR.text,
                          }}
                          placeholder={
                            "Write your complete interview feedback…\n\ne.g.\n• Candidate introduced themselves confidently.\n• Strong understanding of React hooks.\n• Faced difficulty with async JavaScript.\n• Solved 3/4 coding questions.\n• Recommended for Technical Round 2."
                          }
                        />
                        <div className="flex items-center justify-between mt-1.5 px-0.5">
                          <span
                            className="text-[11px]"
                            style={{ color: COLOR.textMuted }}
                          >
                            {feedbackWordCount} word
                            {feedbackWordCount === 1 ? "" : "s"}
                          </span>
                          <span
                            className="text-[11px] tabular-nums"
                            style={{
                              color:
                                feedbackText.length >= FEEDBACK_CHAR_LIMIT
                                  ? COLOR.red
                                  : COLOR.textMuted,
                            }}
                          >
                            {feedbackText.length}/{FEEDBACK_CHAR_LIMIT}
                          </span>
                        </div>
                      </div>

                      <div>
                        <label
                          className="block text-[12px] font-semibold uppercase tracking-wide mb-2"
                          style={{ color: COLOR.textMuted }}
                        >
                          Quick add
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                          {QUICK_FEEDBACK_CHIPS.map((chip) => (
                            <button
                              key={chip.label}
                              onClick={() => handleInsertChip(chip.text)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[12px] font-medium transition-colors hover:opacity-80"
                              style={{
                                backgroundColor: COLOR.panelAlt,
                                color: COLOR.text,
                              }}
                            >
                              <Plus className="w-3 h-3" />
                              {chip.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={() => void saveFeedbackNow()}
                        disabled={feedbackSaveStatus === "saving"}
                        className="px-4 py-2 rounded-full font-semibold text-[13px] text-white transition-opacity hover:opacity-90 disabled:opacity-60 inline-flex items-center gap-2"
                        style={{ backgroundColor: COLOR.blueStrong }}
                      >
                        {feedbackSaveStatus === "saving" && (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        )}
                        Save now
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === "participants" && (
                  <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    <div
                      className="rounded-xl px-3 py-3"
                      style={{ backgroundColor: COLOR.panelAlt }}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span
                          className="text-[13px] font-semibold"
                          style={{ color: COLOR.text }}
                        >
                          {role === "recruiter"
                            ? "Recruiter (you)"
                            : "Candidate (you)"}
                        </span>
                        <StatusPill connected />
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className="inline-flex items-center gap-1 text-[12px]"
                          style={{
                            color: call.isMuted ? COLOR.red : COLOR.textMuted,
                          }}
                        >
                          {call.isMuted ? (
                            <MicOff className="w-3.5 h-3.5" />
                          ) : (
                            <Mic className="w-3.5 h-3.5" />
                          )}
                          {call.isMuted ? "Mic off" : "Mic on"}
                        </span>
                        <span
                          className="inline-flex items-center gap-1 text-[12px]"
                          style={{
                            color: call.isCameraEnabled
                              ? COLOR.textMuted
                              : COLOR.red,
                          }}
                        >
                          {call.isCameraEnabled ? (
                            <Video className="w-3.5 h-3.5" />
                          ) : (
                            <VideoOff className="w-3.5 h-3.5" />
                          )}
                          {call.isCameraEnabled ? "Cam on" : "Cam off"}
                        </span>
                      </div>
                    </div>

                    <div
                      className="rounded-xl px-3 py-3"
                      style={{ backgroundColor: COLOR.panelAlt }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className="text-[13px] font-semibold"
                          style={{ color: COLOR.text }}
                        >
                          {otherRoleLabel}
                        </span>
                        <StatusPill
                          connected={!!call.remoteStream}
                          reconnecting={isReconnectingRemote}
                        />
                      </div>
                      {isReconnectingRemote && (
                        <div className="flex items-center gap-2 mt-1.5">
                          <span
                            className="text-[11px] font-mono tabular-nums"
                            style={{ color: COLOR.textMuted }}
                          >
                            {formatElapsed(reconnectElapsed)} elapsed
                          </span>
                          <button
                            onClick={() => setActiveTab("chat")}
                            className="text-[11px] font-semibold"
                            style={{ color: COLOR.blue }}
                          >
                            Message
                          </button>
                        </div>
                      )}
                      {!call.remoteStream && !isReconnectingRemote && (
                        <p
                          className="text-[12px] mt-1"
                          style={{ color: COLOR.textMuted }}
                        >
                          No one else has joined yet.
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === "info" && (
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    <div>
                      <h3
                        className="text-[12px] font-semibold uppercase tracking-wide mb-1"
                        style={{ color: COLOR.textMuted }}
                      >
                        Position
                      </h3>
                      <p
                        className="text-[14px] font-medium"
                        style={{ color: COLOR.text }}
                      >
                        {details.title}
                      </p>
                    </div>
                    <div
                      className="pt-3"
                      style={{ borderTop: `1px solid ${COLOR.border}` }}
                    >
                      <h3
                        className="text-[12px] font-semibold uppercase tracking-wide mb-1"
                        style={{ color: COLOR.textMuted }}
                      >
                        Round
                      </h3>
                      <p
                        className="text-[14px] font-medium"
                        style={{ color: COLOR.text }}
                      >
                        {details.round}
                      </p>
                    </div>
                    <div
                      className="pt-3"
                      style={{ borderTop: `1px solid ${COLOR.border}` }}
                    >
                      <h3
                        className="text-[12px] font-semibold uppercase tracking-wide mb-1"
                        style={{ color: COLOR.textMuted }}
                      >
                        Status
                      </h3>
                      <p
                        className="text-[14px] font-medium capitalize"
                        style={{ color: COLOR.text }}
                      >
                        {details.status.toLowerCase()}
                      </p>
                    </div>
                    <div
                      className="pt-3"
                      style={{ borderTop: `1px solid ${COLOR.border}` }}
                    >
                      <h3
                        className="text-[12px] font-semibold uppercase tracking-wide mb-1"
                        style={{ color: COLOR.textMuted }}
                      >
                        Duration
                      </h3>
                      <p
                        className="text-[14px] font-medium"
                        style={{ color: COLOR.text }}
                      >
                        {details.durationInMinutes} minutes
                      </p>
                    </div>
                    {details.mode === "OFFLINE" && details.location && (
                      <div
                        className="pt-3"
                        style={{ borderTop: `1px solid ${COLOR.border}` }}
                      >
                        <h3
                          className="text-[12px] font-semibold uppercase tracking-wide mb-1"
                          style={{ color: COLOR.textMuted }}
                        >
                          Location
                        </h3>
                        <p
                          className="text-[14px] font-medium"
                          style={{ color: COLOR.text }}
                        >
                          {details.location}
                        </p>
                      </div>
                    )}
                    <div
                      className="pt-3 flex items-center gap-1.5"
                      style={{ borderTop: `1px solid ${COLOR.border}` }}
                    >
                      <Lock
                        className="w-3.5 h-3.5"
                        style={{ color: COLOR.textMuted }}
                      />
                      <span
                        className="text-[12px]"
                        style={{ color: COLOR.textMuted }}
                      >
                        Encrypted
                      </span>
                    </div>
                  </div>
                )}

                {activeTab === "chat" && (
                  <div className="flex-1 min-h-0 flex flex-col">
                    <div
                      ref={chatScrollRef}
                      onScroll={handleChatScroll}
                      className="flex-1 overflow-y-auto px-4 py-3 space-y-2 relative"
                      aria-live="polite"
                    >
                      {timeline.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center gap-3 py-6 text-center px-4">
                          <div
                            className="w-12 h-12 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: `${COLOR.blue}1A` }}
                          >
                            <MessageSquare
                              className="w-5 h-5"
                              style={{ color: COLOR.blue }}
                            />
                          </div>
                          <div>
                            <p
                              className="text-[14px] font-semibold"
                              style={{ color: COLOR.text }}
                            >
                              Private interview chat
                            </p>
                            <p
                              className="text-[12px] mt-1 max-w-55"
                              style={{ color: COLOR.textMuted }}
                            >
                              Only you and the {otherRoleLabel.toLowerCase()}{" "}
                              can read these messages. They're cleared once the
                              interview ends.
                            </p>
                          </div>
                        </div>
                      )}

                      {timeline.map((entry, idx) => {
                        if (entry.kind === "date") {
                          return (
                            <div
                              key={entry.id}
                              className="flex items-center gap-2 py-2"
                            >
                              <div
                                className="flex-1 h-px"
                                style={{ backgroundColor: COLOR.border }}
                              />
                              <span
                                className="text-[11px] font-medium px-2 shrink-0"
                                style={{ color: COLOR.textMuted }}
                              >
                                {entry.label}
                              </span>
                              <div
                                className="flex-1 h-px"
                                style={{ backgroundColor: COLOR.border }}
                              />
                            </div>
                          );
                        }

                        if (entry.kind === "divider") {
                          return (
                            <div
                              key={entry.id}
                              className="flex items-center gap-2 py-2"
                            >
                              <div
                                className="flex-1 h-px"
                                style={{ backgroundColor: COLOR.blue }}
                              />
                              <span
                                className="text-[11px] font-semibold px-2 shrink-0"
                                style={{ color: COLOR.blue }}
                              >
                                New messages
                              </span>
                              <div
                                className="flex-1 h-px"
                                style={{ backgroundColor: COLOR.blue }}
                              />
                            </div>
                          );
                        }

                        if (entry.kind === "system") {
                          return (
                            <div
                              key={entry.id}
                              className="flex items-center justify-center gap-1.5 py-1"
                            >
                              <SystemEventIcon variant={entry.variant} />
                              <span
                                className="text-[11px]"
                                style={{ color: COLOR.textMuted }}
                              >
                                {entry.text}
                              </span>
                            </div>
                          );
                        }

                        const prevEntry = timeline[idx - 1];
                        const showMeta =
                          !prevEntry ||
                          prevEntry.kind !== "message" ||
                          prevEntry.self !== entry.self ||
                          entry.timestamp - prevEntry.timestamp > 5 * 60 * 1000;
                        const status = sendingStatus[entry.key] ?? "sent";
                        const isCopied = copiedMessageId === entry.id;

                        return (
                          <div
                            key={entry.id}
                            className={`flex ${entry.self ? "justify-end" : "justify-start"} group animate-[msgIn_180ms_ease-out]`}
                          >
                            <div
                              className="max-w-[85%] sm:max-w-[75%] lg:max-w-[68%] flex flex-col"
                              style={{
                                alignItems: entry.self
                                  ? "flex-end"
                                  : "flex-start",
                              }}
                            >
                              {showMeta && (
                                <div
                                  className="flex items-center gap-2 px-1 mb-1"
                                  style={{
                                    flexDirection: entry.self
                                      ? "row-reverse"
                                      : "row",
                                  }}
                                >
                                  <Avatar
                                    label={
                                      entry.self ? "You" : otherRoleLabel[0]
                                    }
                                    self={entry.self}
                                  />
                                  <span
                                    className="text-[12px] font-semibold"
                                    style={{ color: COLOR.text }}
                                  >
                                    {entry.self ? "You" : otherRoleLabel}
                                  </span>
                                </div>
                              )}

                              <div className="relative">
                                <div
                                  className="px-3.5 py-2.5 text-[14px] leading-7 tracking-[0.01em] whitespace-pre-wrap wrap-break-word shadow-sm"
                                  style={{
                                    overflowWrap: "anywhere",
                                    backgroundColor: entry.self
                                      ? COLOR.blueStrong
                                      : COLOR.panelAlt,
                                    color: entry.self ? "#fff" : COLOR.text,
                                    borderRadius: 18,
                                    borderBottomRightRadius: entry.self
                                      ? 4
                                      : 18,
                                    borderBottomLeftRadius: entry.self ? 18 : 4,
                                  }}
                                >
                                  <div>{renderMessageContent(entry.text)}</div>
                                  <div
                                    className="flex items-center gap-1 mt-1 select-none"
                                    style={{
                                      justifyContent: "flex-end",
                                      opacity: 0.75,
                                      fontSize: 11,
                                    }}
                                  >
                                    <span>{formatClock(entry.timestamp)}</span>
                                    {entry.self && (
                                      <span>
                                        {status === "sending" ? "🕒" : "✓✓"}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                <div
                                  className="absolute -top-3 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
                                  style={
                                    {
                                      [entry.self ? "left" : "right"]: -4,
                                    } as React.CSSProperties
                                  }
                                >
                                  {isCopied && (
                                    <span
                                      className="text-[10px] font-medium px-1.5 py-0.5 rounded-full shadow"
                                      style={{
                                        backgroundColor: COLOR.panel,
                                        color: COLOR.green,
                                      }}
                                    >
                                      Copied
                                    </span>
                                  )}
                                  <button
                                    onClick={() =>
                                      handleCopyMessage(entry.id, entry.text)
                                    }
                                    aria-label="Copy message"
                                    title="Copy"
                                    className="p-1 rounded-full shadow"
                                    style={{
                                      backgroundColor: COLOR.panel,
                                      color: COLOR.textMuted,
                                    }}
                                  >
                                    <Copy className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}

                      {!chatAtBottom && timeline.length > 0 && (
                        <button
                          onClick={() => scrollToBottom(true)}
                          className="sticky bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold shadow-lg mx-auto"
                          style={{
                            backgroundColor: COLOR.blueStrong,
                            color: "#fff",
                          }}
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                          New messages
                          {unreadChat > 0 ? ` · ${unreadChat}` : ""}
                        </button>
                      )}
                    </div>

                    <div
                      className="p-3"
                      style={{ borderTop: `1px solid ${COLOR.border}` }}
                    >
                      <div
                        className="flex items-end gap-2 rounded-3xl px-3.5 py-2.5"
                        style={{ backgroundColor: COLOR.panelAlt }}
                      >
                        <textarea
                          ref={chatInputRef}
                          value={draft}
                          onChange={handleDraftChange}
                          onKeyDown={handleChatKeyDown}
                          rows={1}
                          maxLength={CHAT_CHAR_LIMIT}
                          disabled={chatInputDisabled}
                          placeholder={chatPlaceholder}
                          className="flex-1 bg-transparent text-[14px] leading-6 resize-none focus:outline-none py-1 disabled:opacity-50"
                          style={{
                            color: COLOR.text,
                            maxHeight: CHAT_TEXTAREA_MAX_HEIGHT_PX,
                          }}
                        />
                        <button
                          onClick={handleSendMessage}
                          disabled={!draft.trim() || chatInputDisabled}
                          aria-label="Send message"
                          className="p-2 rounded-full transition-opacity disabled:opacity-40 shrink-0"
                          style={{ backgroundColor: COLOR.blueStrong }}
                        >
                          <Send className="w-4 h-4 text-white" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-1.5 px-1">
                        <p
                          className="text-[11px]"
                          style={{ color: COLOR.textMuted }}
                        >
                          Enter to send · Shift + Enter for a new line
                        </p>
                        <span
                          className="text-[11px] tabular-nums"
                          style={{
                            color:
                              draft.length >= CHAT_CHAR_LIMIT
                                ? COLOR.red
                                : COLOR.textMuted,
                            opacity: draft.length > 0 ? 1 : 0,
                          }}
                        >
                          {draft.length}/{CHAT_CHAR_LIMIT}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {showUnsavedWarning && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 p-4 animate-[fadeIn_150ms_ease-out]"
          style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
          onClick={handleCancelUnsavedWarning}
        >
          <div
            className="rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-[popIn_150ms_ease-out]"
            style={{ backgroundColor: COLOR.panel }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${COLOR.yellow}1A` }}
              >
                <AlertTriangle
                  className="w-4.5 h-4.5"
                  style={{ color: COLOR.yellow }}
                />
              </div>
              <h3
                className="text-[15px] font-semibold"
                style={{ color: COLOR.text }}
              >
                Interview feedback hasn't been saved
              </h3>
            </div>
            <p
              className="text-[14px] mb-2 pl-13"
              style={{ color: COLOR.textMuted }}
            >
              {feedbackSaveStatus === "error"
                ? "The last save attempt failed. Save again before ending the interview?"
                : "Save before ending the interview?"}
            </p>
            {feedbackSaveStatus === "error" && feedbackSaveError && (
              <p
                className="text-[13px] mb-3 pl-13"
                style={{ color: COLOR.red }}
              >
                {feedbackSaveError}
              </p>
            )}
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleCancelUnsavedWarning}
                disabled={feedbackSaveStatus === "saving"}
                className="flex-1 px-4 py-2.5 font-medium rounded-full text-[13px] transition-colors disabled:opacity-50"
                style={{ color: COLOR.text, backgroundColor: COLOR.panelAlt }}
              >
                Cancel
              </button>
              <button
                onClick={handleDiscardAndProceed}
                disabled={feedbackSaveStatus === "saving"}
                className="flex-1 px-4 py-2.5 font-medium rounded-full text-[13px] transition-colors disabled:opacity-50"
                style={{ color: COLOR.text, backgroundColor: COLOR.panelAlt }}
              >
                Discard
              </button>
              <button
                onClick={() => void handleSaveAndProceed()}
                disabled={feedbackSaveStatus === "saving"}
                className="flex-1 px-4 py-2.5 text-white font-semibold rounded-full text-[13px] transition-opacity hover:opacity-90 disabled:opacity-60 inline-flex items-center justify-center gap-1.5"
                style={{ backgroundColor: COLOR.blueStrong }}
              >
                {feedbackSaveStatus === "saving" && (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                )}
                {feedbackSaveStatus === "error" ? "Retry save" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showShortcuts && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 p-4 animate-[fadeIn_150ms_ease-out]"
          style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
          onClick={() => setShowShortcuts(false)}
        >
          <div
            className="rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-[popIn_150ms_ease-out]"
            style={{ backgroundColor: COLOR.panel }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3
                className="text-[15px] font-semibold"
                style={{ color: COLOR.text }}
              >
                Keyboard shortcuts
              </h3>
              <button
                onClick={() => setShowShortcuts(false)}
                className="p-1 rounded-md"
                style={{ color: COLOR.textMuted }}
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2">
              {KEYBOARD_SHORTCUTS.map((s) => (
                <div
                  key={s.action}
                  className="flex items-center justify-between"
                >
                  <span
                    className="text-[13px]"
                    style={{ color: COLOR.textMuted }}
                  >
                    {s.action}
                  </span>
                  <kbd
                    className="text-[11px] font-mono font-semibold px-2 py-1 rounded-md"
                    style={{
                      backgroundColor: COLOR.panelAlt,
                      color: COLOR.text,
                    }}
                  >
                    {s.keys}
                  </kbd>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showEndConfirm && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 p-4 animate-[fadeIn_150ms_ease-out]"
          style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
          onClick={handleCancelEndCall}
        >
          <div
            className="rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-[popIn_150ms_ease-out]"
            style={{ backgroundColor: COLOR.panel }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${COLOR.red}1A` }}
                >
                  <PhoneOff
                    className="w-4.5 h-4.5"
                    style={{ color: COLOR.red }}
                  />
                </div>
                <h3
                  className="text-[15px] font-semibold pt-1"
                  style={{ color: COLOR.text }}
                >
                  {role === "recruiter"
                    ? "Finish this interview?"
                    : "Leave the interview?"}
                </h3>
              </div>
              <button
                onClick={handleCancelEndCall}
                disabled={endingInterview}
                className="shrink-0 disabled:opacity-40"
                style={{ color: COLOR.textMuted }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p
              className="text-[14px] mb-4 pl-13"
              style={{ color: COLOR.textMuted }}
            >
              {role === "recruiter"
                ? "This will end the call for both you and the candidate, and mark the interview as completed. This can't be undone."
                : "You'll be disconnected from the call. The recruiter can continue without you."}
            </p>

            <div
              className="rounded-xl overflow-hidden mb-4 divide-y"
              style={{
                backgroundColor: COLOR.panelAlt,
                borderColor: COLOR.border,
              }}
            >
              <div className="px-3.5 py-2.5 flex items-center justify-between">
                <span
                  className="text-[12px]"
                  style={{ color: COLOR.textMuted }}
                >
                  Duration
                </span>
                <span
                  className="text-[13px] font-mono font-semibold"
                  style={{ color: COLOR.text }}
                >
                  {formatElapsed(elapsedSeconds)}
                </span>
              </div>
              {role === "recruiter" && (
                <div
                  className="px-3.5 py-2.5 flex items-center justify-between"
                  style={{ borderTop: `1px solid ${COLOR.border}` }}
                >
                  <span
                    className="text-[12px]"
                    style={{ color: COLOR.textMuted }}
                  >
                    Feedback
                  </span>
                  <span
                    className="text-[13px] font-medium"
                    style={{
                      color: feedbackSavedAt ? COLOR.green : COLOR.textMuted,
                    }}
                  >
                    {feedbackSavedAt ? "Saved" : "Not saved"}
                  </span>
                </div>
              )}
              <div
                className="px-3.5 py-2.5 flex items-center justify-between"
                style={{ borderTop: `1px solid ${COLOR.border}` }}
              >
                <span
                  className="text-[12px]"
                  style={{ color: COLOR.textMuted }}
                >
                  Chat
                </span>
                <span
                  className="text-[13px] font-medium"
                  style={{ color: COLOR.text }}
                >
                  {call.messages.length} message
                  {call.messages.length === 1 ? "" : "s"}
                </span>
              </div>
            </div>

            {endInterviewError && (
              <div
                className="mb-4 rounded-lg px-3 py-2.5 flex items-start gap-2"
                style={{ backgroundColor: `${COLOR.red}1A` }}
              >
                <AlertTriangle
                  className="w-4 h-4 shrink-0 mt-0.5"
                  style={{ color: COLOR.red }}
                />
                <p className="text-[13px]" style={{ color: COLOR.red }}>
                  {endInterviewError}
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleCancelEndCall}
                disabled={endingInterview}
                className="flex-1 px-4 py-2.5 font-medium rounded-full text-[14px] disabled:opacity-50 transition-colors"
                style={{ color: COLOR.text, backgroundColor: COLOR.panelAlt }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmEndCall}
                disabled={endingInterview}
                className="flex-1 px-4 py-2.5 text-white font-semibold rounded-full text-[14px] transition-opacity hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
                style={{ backgroundColor: COLOR.red }}
              >
                {endingInterview && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                {endInterviewError
                  ? "Try again"
                  : role === "recruiter"
                    ? "Finish interview"
                    : "Leave"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.96) translateY(4px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes toastIn {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes panelIn {
          from { opacity: 0; transform: translateX(8px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes msgIn {
          from { opacity: 0; transform: translateY(10px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes badgeBump {
          0% { transform: scale(1); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}