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
  Star,
  CheckCircle2,
  User,
  Lock,
  Copy,
  ChevronDown,
} from "lucide-react";

import {
  useInterviewCall,
  type ParticipantRole,
} from "../hooks/common/useInterviewCall";
import { useInterviewDetails } from "../hooks/common/useInterview.details";
import { useEndInterview } from "../hooks/recruiter/useEndInterview";

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

const CHAT_CHAR_LIMIT = 500;
const CHAT_SEND_COOLDOWN_MS = 100;
const CHAT_TEXTAREA_MAX_HEIGHT_PX = 96;

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

interface RoomNavState {
  roomId?: string;
}

interface Toast {
  id: string;
  text: string;
  tone: "info" | "success" | "warning";
}

interface SystemEventEntry {
  id: string;
  text: string;
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
  timestamp: number;
}

type TimelineEntry = TimelineMessageEntry | TimelineSystemEntry;

type SidebarTab = "participants" | "notes" | "info" | "chat";
type Recommendation = "hire" | "hold" | "reject" | null;

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

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const chatScrollRef = useRef<HTMLDivElement | null>(null);
  const chatInputRef = useRef<HTMLTextAreaElement | null>(null);

  const [activeTab, setActiveTab] = useState<SidebarTab | null>(null);
  const [notesStrengths, setNotesStrengths] = useState("");
  const [notesWeaknesses, setNotesWeaknesses] = useState("");
  const [communicationRating, setCommunicationRating] = useState(0);
  const [recommendation, setRecommendation] = useState<Recommendation>(null);
  const [notesSavedAt, setNotesSavedAt] = useState<number | null>(null);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
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

  const callInFlightRef = useRef(false);
  const remoteEverConnectedRef = useRef(false);
  const prevRemoteStreamRef = useRef<MediaStream | null>(null);
  const reconnectStartRef = useRef<number | null>(null);
  const activeTabRef = useRef<SidebarTab | null>(activeTab);
  const prevMessageCountRef = useRef(0);
  const lastSentAtRef = useRef(0);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const addToast = useCallback((text: string, tone: Toast["tone"] = "info") => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setToasts((prev) => [...prev, { id, text, tone }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const pushSystemEvent = useCallback((text: string) => {
    setSystemEvents((prev) => [
      ...prev,
      {
        id: `sys-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        text,
        timestamp: Date.now(),
      },
    ]);
  }, []);

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
      );
      remoteEverConnectedRef.current = true;
      reconnectStartRef.current = null;
      setReconnectElapsed(0);
    } else if (had && !has && call.callState !== "ENDED") {
      addToast(`${otherRoleLabel} disconnected`, "warning");
      playLeaveSound();
      pushSystemEvent(
        `${otherRoleLabel} disconnected. Waiting for them to reconnect…`,
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

  const timeline = useMemo<TimelineEntry[]>(() => {
    const msgEntries: TimelineEntry[] = call.messages.map((m, idx) => ({
      kind: "message",
      id: `msg-${idx}-${m.sentAt}`,
      key: `${m.senderId}-${m.sentAt}`,
      text: m.message,
      timestamp: new Date(m.sentAt).getTime(),
      self: m.senderId === userId,
    }));
    const sysEntries: TimelineEntry[] = systemEvents.map((s) => ({
      kind: "system",
      id: s.id,
      text: s.text,
      timestamp: s.timestamp,
    }));
    return [...msgEntries, ...sysEntries].sort(
      (a, b) => a.timestamp - b.timestamp,
    );
  }, [call.messages, systemEvents, userId]);

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

  const handleToggleMic = useCallback(() => {
    addToast(call.isMuted ? "Microphone unmuted" : "Microphone muted");
    call.toggleMicrophone();
  }, [call, addToast]);

  const handleToggleCamera = useCallback(() => {
    addToast(call.isCameraEnabled ? "Camera disabled" : "Camera enabled");
    call.toggleCamera();
  }, [call, addToast]);

  const handleToggleScreenShare = useCallback(() => {
    addToast(
      call.isScreenSharing
        ? "Screen sharing stopped"
        : "Screen sharing started",
      "info",
    );
    call.toggleScreenShare();
  }, [call, addToast]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const key = e.key.toLowerCase();
      const target = e.target as HTMLElement | null;
      const typing =
        target &&
        (target.tagName === "TEXTAREA" ||
          target.tagName === "INPUT" ||
          target.isContentEditable);
      if (typing) return;

      if (e.ctrlKey && e.shiftKey && key === "s") {
        e.preventDefault();
        handleToggleScreenShare();
      } else if (e.ctrlKey && key === "d") {
        e.preventDefault();
        handleToggleMic();
      } else if (e.ctrlKey && key === "e") {
        e.preventDefault();
        handleToggleCamera();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleToggleMic, handleToggleCamera, handleToggleScreenShare]);

  function toggleTab(tab: SidebarTab) {
    setActiveTab((prev) => (prev === tab ? null : tab));
  }

  async function handleConfirmEndCall() {
    if (role === "recruiter") {
      if (!interviewId) return;
      const response = await submitEndInterview(interviewId);
      if (!response) return; // error is surfaced inline in the modal
    }
    setShowEndConfirm(false);
    await call.endCall();
  }

  function handleLeaveClick() {
    setShowEndConfirm(true);
  }

  function handleCancelEndCall() {
    if (endingInterview) return;
    setShowEndConfirm(false);
  }

  function handleSaveNotes() {
    setNotesSavedAt(Date.now());
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

  async function handleCopyMessage(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      addToast("Message copied", "info");
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
            className="rounded-xl px-4 py-3 mb-3 flex items-center justify-between"
            style={{ backgroundColor: COLOR.panelAlt }}
          >
            <span
              className="text-[12px] font-semibold uppercase tracking-wide"
              style={{ color: COLOR.textMuted }}
            >
              Duration
            </span>
            <span
              className="text-[15px] font-mono font-semibold tabular-nums"
              style={{ color: COLOR.text }}
            >
              {formatElapsed(shownDuration)}
            </span>
          </div>

          {role === "recruiter" && (
            <div
              className="rounded-xl px-4 py-3 mb-6 flex items-center justify-between"
              style={{ backgroundColor: COLOR.panelAlt }}
            >
              <span
                className="text-[12px] font-semibold uppercase tracking-wide"
                style={{ color: COLOR.textMuted }}
              >
                Notes
              </span>
              <span
                className="text-[14px] font-medium flex items-center gap-1.5"
                style={{ color: notesSavedAt ? COLOR.green : COLOR.textMuted }}
              >
                {notesSavedAt ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" /> Saved
                  </>
                ) : (
                  "Not saved"
                )}
              </span>
            </div>
          )}

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
          { id: "notes", label: "Notes", icon: FileText, mobileHidden: true },
        ] as const)
      : []),
    { id: "info", label: "Details", icon: Info, mobileHidden: true },
  ];

  return (
    <div
      className="flex flex-col h-screen overflow-hidden"
      style={{ backgroundColor: COLOR.bg }}
    >
      {/* Toasts */}
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
              <p
                className="text-[12px] text-center max-w-xs"
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

          {/* Local Picture-in-Picture */}
          <div
            className="absolute top-4 right-4 w-32 h-20 sm:w-52 sm:h-32 rounded-2xl overflow-hidden"
            style={{ backgroundColor: COLOR.panel }}
          >
            {cameraOn ? (
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover scale-x-[-1]"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-1.5">
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
                  Camera off
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
            <span
              className="absolute top-4 left-4 inline-flex items-center gap-1.5 text-white text-[13px] font-semibold px-2.5 py-1 rounded-full shadow-sm"
              style={{ backgroundColor: COLOR.blueStrong }}
            >
              <MonitorUp className="w-3.5 h-3.5" />
              You're sharing your screen
            </span>
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
              </button>
            ))}
          </div>

          <div
            className="absolute left-1/2 -translate-x-1/2 bottom-5 rounded-full flex items-center gap-2 px-3 py-2.5 shadow-xl backdrop-blur-sm"
            style={{ backgroundColor: `${COLOR.panel}F2` }}
          >
            <button
              onClick={handleToggleMic}
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
              onClick={handleToggleCamera}
              title={
                call.isCameraEnabled
                  ? "Turn camera off (Ctrl+E)"
                  : "Turn camera on (Ctrl+E)"
              }
              aria-label={
                call.isCameraEnabled ? "Turn camera off" : "Turn camera on"
              }
              className="p-3 rounded-full transition-colors"
              style={{
                backgroundColor: !call.isCameraEnabled
                  ? COLOR.red
                  : COLOR.panelAlt,
                color: "#fff",
              }}
            >
              {call.isCameraEnabled ? (
                <Video className="w-5 h-5" />
              ) : (
                <VideoOff className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={handleToggleScreenShare}
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
                  <div className="flex-1 overflow-y-auto p-4 space-y-5">
                    <div>
                      <label
                        className="block text-[12px] font-semibold uppercase tracking-wide mb-2"
                        style={{ color: COLOR.textMuted }}
                      >
                        Strengths
                      </label>
                      <textarea
                        value={notesStrengths}
                        onChange={(e) => setNotesStrengths(e.target.value)}
                        className="w-full h-20 px-3 py-2 rounded-lg text-[14px] resize-none focus:outline-none focus:ring-2"
                        style={{
                          backgroundColor: COLOR.panelAlt,
                          color: COLOR.text,
                          // @ts-expect-error – custom focus ring color via CSS var
                          "--tw-ring-color": COLOR.blue,
                        }}
                        placeholder="What stood out positively…"
                      />
                    </div>

                    <div>
                      <label
                        className="block text-[12px] font-semibold uppercase tracking-wide mb-2"
                        style={{ color: COLOR.textMuted }}
                      >
                        Weaknesses
                      </label>
                      <textarea
                        value={notesWeaknesses}
                        onChange={(e) => setNotesWeaknesses(e.target.value)}
                        className="w-full h-20 px-3 py-2 rounded-lg text-[14px] resize-none focus:outline-none focus:ring-2"
                        style={{
                          backgroundColor: COLOR.panelAlt,
                          color: COLOR.text,
                        }}
                        placeholder="Areas of concern…"
                      />
                    </div>

                    <div>
                      <label
                        className="block text-[12px] font-semibold uppercase tracking-wide mb-2"
                        style={{ color: COLOR.textMuted }}
                      >
                        Communication
                      </label>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <button
                            key={n}
                            onClick={() => setCommunicationRating(n)}
                            aria-label={`Rate ${n} out of 5`}
                            className="p-0.5"
                          >
                            <Star
                              className="w-5 h-5"
                              style={{
                                fill:
                                  n <= communicationRating
                                    ? COLOR.yellow
                                    : "transparent",
                                color:
                                  n <= communicationRating
                                    ? COLOR.yellow
                                    : COLOR.border,
                              }}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label
                        className="block text-[12px] font-semibold uppercase tracking-wide mb-2"
                        style={{ color: COLOR.textMuted }}
                      >
                        Recommendation
                      </label>
                      <div className="space-y-1.5">
                        {(
                          [
                            {
                              value: "hire",
                              label: "Hire",
                              color: COLOR.green,
                            },
                            {
                              value: "hold",
                              label: "Hold",
                              color: COLOR.yellow,
                            },
                            {
                              value: "reject",
                              label: "Reject",
                              color: COLOR.red,
                            },
                          ] as const
                        ).map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => setRecommendation(opt.value)}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[14px] font-medium transition-colors text-left"
                            style={{
                              backgroundColor:
                                recommendation === opt.value
                                  ? `${opt.color}1F`
                                  : COLOR.panelAlt,
                              color:
                                recommendation === opt.value
                                  ? opt.color
                                  : COLOR.text,
                            }}
                          >
                            <span
                              className="w-3.5 h-3.5 rounded-full shrink-0"
                              style={{
                                border: `2px solid ${recommendation === opt.value ? opt.color : COLOR.border}`,
                                backgroundColor:
                                  recommendation === opt.value
                                    ? opt.color
                                    : "transparent",
                              }}
                            />
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={handleSaveNotes}
                        className="px-4 py-2 rounded-full font-semibold text-[13px] text-white transition-opacity hover:opacity-90"
                        style={{ backgroundColor: COLOR.blueStrong }}
                      >
                        Save notes
                      </button>
                      <span
                        className="text-[12px]"
                        style={{ color: COLOR.textMuted }}
                      >
                        {notesSavedAt
                          ? `Saved ${formatClock(notesSavedAt)}`
                          : "Not saved yet"}
                      </span>
                    </div>
                  </div>
                )}

                {activeTab === "participants" && (
                  <div className="flex-1 overflow-y-auto p-4 space-y-1">
                    <div className="flex items-center gap-3 px-2 py-2.5 rounded-lg">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: COLOR.green }}
                      />
                      <span
                        className="text-[14px] font-medium flex-1"
                        style={{ color: COLOR.text }}
                      >
                        You
                      </span>
                      {call.isMuted ? (
                        <MicOff
                          className="w-4 h-4"
                          style={{ color: COLOR.red }}
                        />
                      ) : (
                        <Mic
                          className="w-4 h-4"
                          style={{ color: COLOR.textMuted }}
                        />
                      )}
                      {call.isCameraEnabled ? (
                        <Video
                          className="w-4 h-4"
                          style={{ color: COLOR.textMuted }}
                        />
                      ) : (
                        <VideoOff
                          className="w-4 h-4"
                          style={{ color: COLOR.red }}
                        />
                      )}
                    </div>

                    {call.remoteStream ? (
                      <div className="flex items-center gap-3 px-2 py-2.5 rounded-lg">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: COLOR.green }}
                        />
                        <span
                          className="text-[14px] font-medium"
                          style={{ color: COLOR.text }}
                        >
                          {otherRoleLabel}
                        </span>
                      </div>
                    ) : isReconnectingRemote ? (
                      <div className="flex items-center gap-3 px-2 py-2.5 rounded-lg">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: COLOR.yellow }}
                        />
                        <span
                          className="text-[14px] font-medium"
                          style={{ color: COLOR.text }}
                        >
                          {otherRoleLabel}
                        </span>
                        <span
                          className="text-[12px]"
                          style={{ color: COLOR.yellow }}
                        >
                          Reconnecting…
                        </span>
                      </div>
                    ) : (
                      <p
                        className="text-[13px] px-2 py-3"
                        style={{ color: COLOR.textMuted }}
                      >
                        No one else has joined yet.
                      </p>
                    )}
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
                      className="flex-1 overflow-y-auto px-4 py-3 space-y-3 relative"
                      aria-live="polite"
                    >
                      {timeline.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center gap-2 py-6 text-center">
                          <MessageSquare
                            className="w-8 h-8"
                            style={{ color: COLOR.textMuted }}
                          />
                          <p
                            className="text-[13px] font-medium"
                            style={{ color: COLOR.text }}
                          >
                            Chat privately during the interview.
                          </p>
                          <p
                            className="text-[12px] max-w-55"
                            style={{ color: COLOR.textMuted }}
                          >
                            Messages disappear when everyone leaves.
                          </p>
                        </div>
                      )}

                      {timeline.map((entry, idx) => {
                        if (entry.kind === "system") {
                          return (
                            <div
                              key={entry.id}
                              className="flex items-center gap-2 py-1"
                            >
                              <div
                                className="flex-1 h-px"
                                style={{ backgroundColor: COLOR.border }}
                              />
                              <span
                                className="text-[11px] px-2 text-center shrink-0 max-w-[70%]"
                                style={{ color: COLOR.textMuted }}
                              >
                                {entry.text}
                              </span>
                              <div
                                className="flex-1 h-px"
                                style={{ backgroundColor: COLOR.border }}
                              />
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

                        return (
                          <div
                            key={entry.id}
                            className={`flex ${entry.self ? "justify-end" : "justify-start"} group animate-[msgIn_150ms_ease-out]`}
                          >
                            <div
                              className="max-w-[80%] flex flex-col"
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
                                  <span
                                    className="text-[11px]"
                                    style={{ color: COLOR.textMuted }}
                                  >
                                    {formatClock(entry.timestamp)}
                                  </span>
                                </div>
                              )}

                              <div className="relative">
                                <div
                                  className="px-3 py-2 text-[14px] whitespace-pre-wrap wrap-break-word leading-snug"
                                  style={{
                                    backgroundColor: entry.self
                                      ? COLOR.blueStrong
                                      : COLOR.panelAlt,
                                    color: entry.self ? "#fff" : COLOR.text,
                                    borderRadius: 16,
                                    borderBottomRightRadius: entry.self
                                      ? 4
                                      : 16,
                                    borderBottomLeftRadius: entry.self ? 16 : 4,
                                  }}
                                >
                                  {entry.text}
                                </div>
                                <button
                                  onClick={() => handleCopyMessage(entry.text)}
                                  aria-label="Copy message"
                                  title="Copy"
                                  className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-2 p-1 rounded-full shadow"
                                  style={{
                                    backgroundColor: COLOR.panel,
                                    color: COLOR.textMuted,
                                    [entry.self ? "left" : "right"]: -8,
                                  }}
                                >
                                  <Copy className="w-3 h-3" />
                                </button>
                              </div>

                              {entry.self && (
                                <span
                                  className="text-[10px] mt-0.5 px-1"
                                  style={{ color: COLOR.textMuted }}
                                >
                                  {status === "sending" ? "Sending…" : "✓ Sent"}
                                </span>
                              )}
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
                        </button>
                      )}
                    </div>

                    <div
                      className="p-3"
                      style={{ borderTop: `1px solid ${COLOR.border}` }}
                    >
                      <div
                        className="flex items-end gap-2 rounded-2xl px-3 py-2"
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
                          className="flex-1 bg-transparent text-[14px] resize-none focus:outline-none py-1 disabled:opacity-50"
                          style={{
                            color: COLOR.text,
                            maxHeight: CHAT_TEXTAREA_MAX_HEIGHT_PX,
                          }}
                        />
                        <button
                          onClick={handleSendMessage}
                          disabled={!draft.trim() || chatInputDisabled}
                          aria-label="Send message"
                          className="p-2 rounded-full transition-opacity disabled:opacity-40"
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
                        {draft.length > 450 && (
                          <span
                            className="text-[11px]"
                            style={{
                              color:
                                draft.length >= CHAT_CHAR_LIMIT
                                  ? COLOR.red
                                  : COLOR.textMuted,
                            }}
                          >
                            {draft.length}/{CHAT_CHAR_LIMIT}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

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
                    ? "End this interview?"
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
              className="text-[14px] mb-5 pl-13"
              style={{ color: COLOR.textMuted }}
            >
              {role === "recruiter"
                ? "This will end the call for both you and the candidate, and mark the interview as completed. This can't be undone."
                : "You'll be disconnected from the call. The recruiter can continue without you."}
            </p>

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
                    ? "End interview"
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
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
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
