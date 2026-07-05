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
  PhoneOff,
  Loader2,
  AlertTriangle,
  Wifi,
  WifiOff,
  X,
  ChevronRight,
  ChevronLeft,
  RefreshCw,
} from "lucide-react";

import {
  useInterviewCall,
  type ParticipantRole,
} from "../hooks/common/useInterviewCall";
import { useInterviewDetails } from "../hooks/common/useInterview.details";
import { useEndInterview } from "../hooks/recruiter/useEndInterview";

// TODO: replace with the app's auth context/store (e.g. useAuth().user.id)
// once it's available here, instead of reading straight from localStorage.
function useCurrentUserId(): string {
  return typeof window !== "undefined"
    ? (localStorage.getItem("userId") ?? "")
    : "";
}

function useRoleFromPath(): ParticipantRole {
  const location = useLocation();
  return location.pathname.startsWith("/candidate")
    ? "candidate"
    : "recruiter";
}

function formatElapsed(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

interface RoomNavState {
  roomId?: string;
}

/** Small labeled avatar used in the participants list and PiP fallback. */
function Avatar({
  label,
  tone = "indigo",
}: {
  label: string;
  tone?: "indigo" | "slate";
}) {
  const toneClasses =
    tone === "indigo"
      ? "bg-indigo-100 text-indigo-700"
      : "bg-slate-200 text-slate-600";
  return (
    <div
      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${toneClasses}`}
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

  const {
    details,
    loading: detailsLoading,
    error: detailsError,
    refetch,
  } = useInterviewDetails({ interviewId: interviewId ?? "", role });

  const navRoomId = (location.state as RoomNavState | null)?.roomId;
  const roomId = navRoomId ?? details?.roomId ?? "";

  const call = useInterviewCall({
    interviewId: interviewId ?? "",
    roomId,
    userId,
    role,
    onCallEnded: () => navigate(`${basePath}/interviews`),
    onError: () => {
      /* surfaced below via call.error */
    },
  });

  const { submit: submitEndInterview, loading: endingInterview } =
    useEndInterview();

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

  const [activeTab, setActiveTab] = useState<
    "participants" | "notes" | "info"
  >(role === "recruiter" ? "notes" : "info");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notes, setNotes] = useState("");
  const [rating, setRating] = useState(0);
  const [recommendation, setRecommendation] = useState("");
  const [notesSavedAt, setNotesSavedAt] = useState<number | null>(null);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [connectedAt, setConnectedAt] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Guards against re-triggering initialize() while a call is already in
  // flight or already established. The hook has its own internal guard too,
  // but this keeps the *page* from firing a second initialize() call while
  // waiting on the first one to resolve (e.g. due to unrelated re-renders).
  const callInFlightRef = useRef(false);

  const startCall = useCallback(async () => {
    if (!roomId || !userId || !interviewId) return;
    if (callInFlightRef.current) return;

    callInFlightRef.current = true;
    try {
      await call.initialize();
    } catch (err) {
      console.error("Failed to initialize interview call.", err);
    } finally {
      callInFlightRef.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, userId, interviewId, call.initialize]);

 useEffect(() => {
    if (!roomId || !userId || !interviewId) return;

    void startCall();
}, [roomId, userId, interviewId]);

  useEffect(() => {
    if (call.callState === "CONNECTED" && connectedAt === null) {
      setConnectedAt(Date.now());
    }
    if (call.callState === "ENDED") {
      setConnectedAt(null);
      setElapsedSeconds(0);
    }
  }, [call.callState, connectedAt]);

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

  // Collapse the sidebar by default on small screens, once, on mount.
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  }, []);

  const participantCount =
    (call.localStream ? 1 : 0) + (call.remoteStream ? 1 : 0);

  const connectionInfo = useMemo(() => {
    switch (call.iceConnectionState) {
      case "connected":
      case "completed":
        return {
          text: "Excellent connection",
          tone: "text-emerald-600",
          dot: "bg-emerald-500",
          Icon: Wifi,
        };
      case "checking":
      case "new":
        return {
          text: "Connecting…",
          tone: "text-amber-600",
          dot: "bg-amber-500",
          Icon: Wifi,
        };
      case "disconnected":
        return {
          text: "Connection unstable",
          tone: "text-amber-600",
          dot: "bg-amber-500",
          Icon: WifiOff,
        };
      case "failed":
      case "closed":
        return {
          text: "Disconnected",
          tone: "text-red-600",
          dot: "bg-red-500",
          Icon: WifiOff,
        };
      default:
        return {
          text: "Connecting…",
          tone: "text-slate-400",
          dot: "bg-slate-400",
          Icon: Wifi,
        };
    }
  }, [call.iceConnectionState]);

  const retryCall = useCallback(() => {
    callInFlightRef.current = false;
    void startCall();
  }, [startCall]);

  async function handleConfirmEndCall() {
    setShowEndConfirm(false);
    if (role === "recruiter") {
      if (!interviewId) return;
      const success = await submitEndInterview(interviewId);
      if (!success) return;
    }
    await call.endCall();
  }

  function handleLeaveClick() {
    setShowEndConfirm(true);
  }

  function handleSaveNotes() {
    setNotesSavedAt(Date.now());
  }

  if (detailsLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          <p className="text-slate-500 text-sm font-medium">
            Loading interview…
          </p>
        </div>
      </div>
    );
  }

  if (detailsError || !details) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 max-w-sm text-center">
          <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-3" />
          <p className="text-slate-900 font-semibold mb-1">
            Couldn't load this interview
          </p>
          <p className="text-sm text-slate-500 mb-5">{detailsError}</p>
          <button
            onClick={refetch}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors"
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

  // Call ended because of an error: show a distinct recovery screen instead
  // of the full room UI with dead video tiles.
  if (call.callState === "ENDED" && call.error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 max-w-sm text-center">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-6 h-6 text-red-500" />
          </div>
          <p className="text-slate-900 font-semibold mb-1">
            The call couldn't continue
          </p>
          <p className="text-sm text-slate-500 mb-5">{call.error}</p>
          <div className="flex gap-3">
            <button
              onClick={() => navigate(`${basePath}/interviews`)}
              className="flex-1 px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium rounded-lg text-sm transition-colors"
            >
              Back to interviews
            </button>
            <button
              onClick={retryCall}
              className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
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
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 max-w-sm text-center">
          <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <PhoneOff className="w-6 h-6 text-slate-500" />
          </div>
          <p className="text-slate-900 font-semibold mb-1">
            The call has ended
          </p>
          <p className="text-sm text-slate-500 mb-5">
            {role === "recruiter"
              ? "The interview has been marked as completed."
              : "Thanks for joining — the recruiter will follow up soon."}
          </p>
          <button
            onClick={() => navigate(`${basePath}/interviews`)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            Back to interviews
          </button>
        </div>
      </div>
    );
  }

  const cameraOn = call.isCameraEnabled && !!call.localStream;
  const ConnIcon = connectionInfo.Icon;
  const otherRoleLabel = role === "recruiter" ? "Candidate" : "Recruiter";

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-base font-semibold text-slate-900 truncate">
              {details.title}
            </h1>
            <p className="text-xs text-slate-500">Round {details.round}</p>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {call.callState === "CONNECTED" && (
              <span className="hidden sm:inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full text-xs font-semibold">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-60" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
                </span>
                Live
              </span>
            )}
            <span className="text-sm font-mono font-semibold text-slate-700 tabular-nums">
              {formatElapsed(elapsedSeconds)}
            </span>
            <span
              className={`hidden md:flex items-center gap-1.5 text-xs font-medium ${connectionInfo.tone}`}
              title={connectionInfo.text}
            >
              <ConnIcon className="w-4 h-4" />
              {connectionInfo.text}
            </span>
            <button
              onClick={handleLeaveClick}
              disabled={endingInterview}
              className="bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white px-3 sm:px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
            >
              {endingInterview ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <PhoneOff className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">
                {role === "recruiter" ? "End interview" : "Leave"}
              </span>
            </button>
          </div>
        </div>

        {(call.error || call.loading) && (
          <div className="px-4 sm:px-6 pt-4">
            {call.error && (
              <div className="mb-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 flex items-start gap-2.5">
                <AlertTriangle
                  size={16}
                  className="text-red-500 shrink-0 mt-0.5"
                />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-red-700">
                    Something went wrong
                  </p>
                  <p className="text-xs text-red-600 mt-0.5">{call.error}</p>
                </div>
                <button
                  onClick={retryCall}
                  className="text-xs font-semibold text-red-600 hover:text-red-800 shrink-0"
                >
                  Retry
                </button>
              </div>
            )}
            {call.loading && !call.error && (
              <div className="mb-3 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 flex items-center gap-2.5">
                <Loader2
                  size={16}
                  className="text-indigo-600 animate-spin shrink-0"
                />
                <p className="text-sm font-medium text-indigo-700">
                  Connecting to the interview room…
                </p>
              </div>
            )}
          </div>
        )}

        {/* Main Video Area */}
        <div className="flex-1 flex gap-4 p-3 sm:p-4 min-h-0">
          <div className="flex-1 flex flex-col gap-3 sm:gap-4 min-h-0 min-w-0">
            <div className="flex-1 bg-slate-900 rounded-xl overflow-hidden relative min-h-0">
              {call.remoteStream ? (
                <>
                  <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-4 left-4 bg-black/50 text-white text-xs font-medium px-2.5 py-1 rounded-md backdrop-blur-sm">
                    {otherRoleLabel}
                  </span>
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                  <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center">
                    {call.callState === "CONNECTING" ? (
                      <Loader2 className="w-7 h-7 text-slate-400 animate-spin" />
                    ) : (
                      <Users className="w-7 h-7 text-slate-400" />
                    )}
                  </div>
                  <p className="text-slate-300 text-sm font-medium text-center px-6">
                    {role === "recruiter"
                      ? "Waiting for the candidate to join…"
                      : "Waiting for the recruiter to join…"}
                  </p>
                </div>
              )}

              {/* Local Picture-in-Picture */}
              <div className="absolute bottom-4 right-4 w-32 h-20 sm:w-44 sm:h-28 bg-slate-800 rounded-lg overflow-hidden border-2 border-white/80 shadow-lg">
                {cameraOn ? (
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover scale-x-[-1]"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <VideoOff className="w-5 h-5 text-slate-400" />
                  </div>
                )}
                {call.isMuted && (
                  <span className="absolute bottom-1 right-1 bg-red-600 rounded-full p-1">
                    <MicOff className="w-2.5 h-2.5 text-white" />
                  </span>
                )}
              </div>

              {call.isScreenSharing && (
                <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 bg-indigo-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                  <MonitorUp className="w-3.5 h-3.5" />
                  You're sharing your screen
                </span>
              )}

              {/* Sidebar toggle, visible when the panel is collapsed */}
              {!sidebarOpen && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  title="Show panel"
                  className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 text-white p-2 rounded-lg backdrop-blur-sm transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Bottom Toolbar */}
            <div className="bg-white rounded-xl border border-slate-200 px-3 sm:px-4 py-3 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={call.toggleMicrophone}
                  title={call.isMuted ? "Unmute" : "Mute"}
                  aria-label={call.isMuted ? "Unmute microphone" : "Mute microphone"}
                  className={`p-3 rounded-full transition-colors ${
                    call.isMuted
                      ? "bg-red-100 text-red-600 hover:bg-red-200"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {call.isMuted ? (
                    <MicOff className="w-5 h-5" />
                  ) : (
                    <Mic className="w-5 h-5" />
                  )}
                </button>
                <button
                  onClick={call.toggleCamera}
                  title={
                    call.isCameraEnabled ? "Turn camera off" : "Turn camera on"
                  }
                  aria-label={
                    call.isCameraEnabled ? "Turn camera off" : "Turn camera on"
                  }
                  className={`p-3 rounded-full transition-colors ${
                    !call.isCameraEnabled
                      ? "bg-red-100 text-red-600 hover:bg-red-200"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {call.isCameraEnabled ? (
                    <Video className="w-5 h-5" />
                  ) : (
                    <VideoOff className="w-5 h-5" />
                  )}
                </button>
                <button
                  onClick={call.toggleScreenShare}
                  title={
                    call.isScreenSharing ? "Stop sharing" : "Share your screen"
                  }
                  aria-label={
                    call.isScreenSharing ? "Stop screen share" : "Start screen share"
                  }
                  className={`p-3 rounded-full transition-colors ${
                    call.isScreenSharing
                      ? "bg-indigo-100 text-indigo-600 hover:bg-indigo-200"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {call.isScreenSharing ? (
                    <MonitorOff className="w-5 h-5" />
                  ) : (
                    <MonitorUp className="w-5 h-5" />
                  )}
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    setActiveTab("participants");
                    setSidebarOpen(true);
                  }}
                  className={`px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors ${
                    sidebarOpen && activeTab === "participants"
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <Users className="w-4 h-4" />
                  {participantCount}
                </button>

                {role === "recruiter" && (
                  <button
                    onClick={() => {
                      setActiveTab("notes");
                      setSidebarOpen(true);
                    }}
                    className={`px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors ${
                      sidebarOpen && activeTab === "notes"
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    <span className="hidden sm:inline">Notes</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setActiveTab("info");
                    setSidebarOpen(true);
                  }}
                  className={`px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors ${
                    sidebarOpen && activeTab === "info"
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <Info className="w-4 h-4" />
                  <span className="hidden sm:inline">Details</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          {sidebarOpen && (
            <div className="w-72 sm:w-80 bg-white rounded-xl border border-slate-200 flex flex-col shrink-0 absolute lg:static right-3 top-18 bottom-3 z-20 shadow-xl lg:shadow-none">
              <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-slate-100">
                <h2 className="text-sm font-semibold text-slate-900 capitalize">
                  {activeTab}
                </h2>
                <button
                  onClick={() => setSidebarOpen(false)}
                  title="Hide panel"
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-50"
                >
                  <ChevronRight className="w-4 h-4 lg:hidden" />
                  <X className="w-4 h-4 hidden lg:block" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                {activeTab === "notes" && role === "recruiter" && (
                  <div className="p-4 space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-2">
                        Interview notes
                      </label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full h-32 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                        placeholder="Add interview notes…"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                          Rating
                        </label>
                        <span className="text-sm font-semibold text-slate-900">
                          {rating}/5
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="5"
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-2">
                        Recommendation
                      </label>
                      <textarea
                        value={recommendation}
                        onChange={(e) => setRecommendation(e.target.value)}
                        className="w-full h-20 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                        placeholder="Add your recommendation…"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <button
                        onClick={handleSaveNotes}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
                      >
                        Save notes
                      </button>
                      <span className="text-xs text-slate-500">
                        {notesSavedAt
                          ? `Saved ${new Date(notesSavedAt).toLocaleTimeString(
                              undefined,
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}`
                          : "Not saved yet"}
                      </span>
                    </div>
                  </div>
                )}

                {activeTab === "participants" && (
                  <div className="p-4 space-y-2">
                    <div className="flex items-center gap-3 px-2 py-2 rounded-lg bg-slate-50">
                      <Avatar label="You" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate">
                          You
                        </p>
                        <p className="text-xs text-slate-400">
                          {call.isMuted ? "Muted" : "Mic on"} ·{" "}
                          {call.isCameraEnabled ? "Camera on" : "Camera off"}
                        </p>
                      </div>
                    </div>

                    {call.remoteStream ? (
                      <div className="flex items-center gap-3 px-2 py-2 rounded-lg bg-slate-50">
                        <Avatar
                          label={role === "recruiter" ? "C" : "R"}
                          tone="slate"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-800 truncate">
                            {otherRoleLabel}
                          </p>
                          <p className="text-xs text-slate-400 flex items-center gap-1">
                            <span
                              className={`inline-block w-1.5 h-1.5 rounded-full ${connectionInfo.dot}`}
                            />
                            Connected
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-slate-400 px-2 py-3">
                        No one else has joined yet.
                      </p>
                    )}
                  </div>
                )}

                {activeTab === "info" && (
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
                        Position
                      </h3>
                      <p className="text-sm text-slate-800 font-medium">
                        {details.title}
                      </p>
                    </div>
                    <div className="border-t border-slate-100 pt-3">
                      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
                        Round
                      </h3>
                      <p className="text-sm text-slate-800 font-medium">
                        {details.round}
                      </p>
                    </div>
                    <div className="border-t border-slate-100 pt-3">
                      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
                        Status
                      </h3>
                      <p className="text-sm text-slate-800 font-medium capitalize">
                        {details.status.toLowerCase()}
                      </p>
                    </div>
                    <div className="border-t border-slate-100 pt-3">
                      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
                        Duration
                      </h3>
                      <p className="text-sm text-slate-800 font-medium">
                        {details.durationInMinutes} minutes
                      </p>
                    </div>
                    {details.mode === "OFFLINE" && details.location && (
                      <div className="border-t border-slate-100 pt-3">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">
                          Location
                        </h3>
                        <p className="text-sm text-slate-800 font-medium">
                          {details.location}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* End-call confirmation */}
      {showEndConfirm && (
        <div
          className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowEndConfirm(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-lg max-w-sm w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-base font-semibold text-slate-900">
                {role === "recruiter"
                  ? "End this interview?"
                  : "Leave the interview?"}
              </h3>
              <button
                onClick={() => setShowEndConfirm(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-slate-500 mb-6">
              {role === "recruiter"
                ? "This will end the call for both you and the candidate, and mark the interview as completed. This can't be undone."
                : "You'll be disconnected from the call. The recruiter can continue without you."}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowEndConfirm(false)}
                className="flex-1 px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium rounded-lg text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmEndCall}
                disabled={endingInterview}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white font-semibold rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
              >
                {endingInterview && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                {role === "recruiter" ? "End interview" : "Leave"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}