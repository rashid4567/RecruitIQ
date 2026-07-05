import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Camera,
  Mic,
  MicOff,
  VideoOff,
  Volume2,
  ChevronDown,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Wifi,
  WifiOff,
  Loader2,
  AlertTriangle,
  Timer,
} from "lucide-react";
import type { ParticipantRole } from "../hooks/common/useInterviewCall";
import { useInterviewDetails } from "../hooks/common/useInterview.details";
import { useMediaDevices } from "../hooks/common/Usemediadevices";
import { useConnectionQuality } from "../hooks/common/Useconnectionquality";
import { useCountdown } from "../hooks/common/Usecountdown";
import { useMicLevel } from "../hooks/common/Usemiclevel";
import { useSpeakerTest } from "./components/preInterivew-Lobby/useSpeakerTest";
import { useMediaPreview } from "../hooks/common/Usemediapreview";

const isBrowserSupported =
  typeof navigator !== "undefined" &&
  !!navigator.mediaDevices?.getUserMedia &&
  typeof window !== "undefined" &&
  !!window.RTCPeerConnection;

function detectBrowserName(): string {
  if (typeof navigator === "undefined") return "your browser";
  const ua = navigator.userAgent;
  if (ua.includes("Edg/")) return "Edge";
  if (ua.includes("Chrome/") && !ua.includes("Edg/")) return "Chrome";
  if (ua.includes("Firefox/")) return "Firefox";
  if (ua.includes("Safari/") && !ua.includes("Chrome/")) return "Safari";
  return "your browser";
}

function formatScheduledAt(scheduledAt: string): {
  date: string;
  time: string;
} {
  const d = new Date(scheduledAt);
  return {
    date: d.toLocaleDateString(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
    }),
    time: d.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
}

function useRoleFromPath(): ParticipantRole {
  const location = useLocation();
  return location.pathname.startsWith("/candidate") ? "candidate" : "recruiter";
}

export default function PreMeetingLobby() {
  const { interviewId } = useParams<{ interviewId: string }>();
  const navigate = useNavigate();
  const role = useRoleFromPath();

  const {
    details,
    loading: detailsLoading,
    error: detailsError,
    refetch,
  } = useInterviewDetails({
    interviewId: interviewId ?? "",
    role,
  });

  const preview = useMediaPreview();

  const {
    cameras,
    microphones,
    speakers,
    cameraPermission,
    microphonePermission,
    supportsSpeakerSelection,
  } = useMediaDevices(!!preview.localStream);

  const connection = useConnectionQuality();
  const countdown = useCountdown(
    details?.scheduledAt,
    details?.durationInMinutes,
  );
  const micLevel = useMicLevel(preview.localStream, preview.isMuted);
  const { testing: testingSpeaker, playTestTone } = useSpeakerTest();

  const [selectedCameraId, setSelectedCameraId] = useState("");
  const [selectedMicrophoneId, setSelectedMicrophoneId] = useState("");
  const [selectedSpeakerId, setSelectedSpeakerId] = useState("");
  const [videoEl, setVideoEl] = useState<HTMLVideoElement | null>(null);
  const [enteringRoom, setEnteringRoom] = useState(false);

  useEffect(() => {
    if (videoEl) videoEl.srcObject = preview.localStream;
    return () => {
      if (videoEl) videoEl.srcObject = null;
    };
  }, [videoEl, preview.localStream]);

  useEffect(() => {
    if (!selectedCameraId && cameras.length > 0)
      setSelectedCameraId(cameras[0].deviceId);
  }, [cameras, selectedCameraId]);
  useEffect(() => {
    if (!selectedMicrophoneId && microphones.length > 0) {
      setSelectedMicrophoneId(microphones[0].deviceId);
    }
  }, [microphones, selectedMicrophoneId]);
  useEffect(() => {
    if (!selectedSpeakerId && speakers.length > 0)
      setSelectedSpeakerId(speakers[0].deviceId);
  }, [speakers, selectedSpeakerId]);

  useEffect(() => {
    if (!selectedCameraId) return;
    preview.switchCamera(selectedCameraId);
  }, [selectedCameraId, preview.switchCamera]);
  useEffect(() => {
    if (!selectedMicrophoneId) return;
    preview.switchMicrophone(selectedMicrophoneId);
  }, [selectedMicrophoneId, preview.switchMicrophone]);

  // Candidates can only join once the recruiter has actually started the
  // interview (details.canJoin flips server-side). Since useInterviewDetails
  // only fetches once, poll while waiting so the Join button enables itself
  // the moment the recruiter starts — no manual refresh needed. Stops once
  // the interview is already ongoing (nothing left to wait for).
  const interviewAlreadyOngoing = details?.status === "ONGOING";
  useEffect(() => {
    if (role !== "candidate") return;
    if (!details) return;
    if (interviewAlreadyOngoing) return;
    const id = setInterval(() => {
      refetch();
    }, 5000);
    return () => clearInterval(id);
  }, [role, refetch, details, interviewAlreadyOngoing]);

  const basePath = role === "candidate" ? "/candidate" : "/recruiter";

  function handlePrimaryAction() {
    if (!interviewId || !details?.roomId) return;
    setEnteringRoom(true);
    navigate(`${basePath}/interviews/${interviewId}/room`, {
      state: { roomId: details.roomId },
    });
  }

  function handleCancel() {
    navigate(-1);
  }

  if (detailsLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          <p className="text-slate-500 text-sm font-medium">
            Loading interview details...
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

  if (details.mode === "ONLINE" && !details.roomId) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 max-w-sm text-center">
          <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-3" />
          <p className="text-slate-900 font-semibold mb-1">
            Interview room isn't ready
          </p>
          <p className="text-sm text-slate-500 mb-5">
            The interview room isn't available yet. Please try again in a
            moment.
          </p>
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

  const { date, time } = formatScheduledAt(details.scheduledAt);
  const hasStarted = countdown.hasStarted || interviewAlreadyOngoing;

  let waitingMessage: string;
  if (role === "candidate") {
    if (interviewAlreadyOngoing || details.canJoin) {
      waitingMessage = "The recruiter has started the interview. You can join now.";
    } else if (hasStarted) {
      waitingMessage = "The interview hasn't started yet. Please wait a moment.";
    } else {
      waitingMessage = "Waiting for the recruiter to start the interview.";
    }
  } else {
    waitingMessage = "You're ready to start the interview.";
  }
  const permissionsDenied =
    cameraPermission === "denied" || microphonePermission === "denied";

  const primaryDisabled =
    !details.canJoin ||
    !preview.localStream ||
    preview.loading ||
    !!preview.error ||
    permissionsDenied ||
    enteringRoom;

  const primaryLabel = enteringRoom ? "Joining..." : "Join Meeting";

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900">Interview lobby</h1>
          <p className="text-sm text-slate-500 mt-1">
            Check your camera and mic before joining.
          </p>
        </div>

        {/* Interview Info */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200">
          <div className="flex items-start justify-between gap-3 mb-1">
            <h2 className="text-lg font-bold text-slate-900">
              {details.title}
            </h2>
            {interviewAlreadyOngoing && (
              <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full text-xs font-semibold shrink-0">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-60" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-600" />
                </span>
                Already in progress
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 mb-4">Round {details.round}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase">
                Date
              </p>
              <p className="text-slate-900 font-medium">{date}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase">
                Time
              </p>
              <p className="text-slate-900 font-medium">{time}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase">
                Duration
              </p>
              <p className="text-slate-900 font-medium">
                {details.durationInMinutes} minutes
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase">
                Mode
              </p>
              <p className="text-slate-900 font-medium">
                {details.mode === "ONLINE" ? "Online" : "In person"}
              </p>
            </div>
            {details.mode === "OFFLINE" && details.location && (
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase">
                  Location
                </p>
                <p className="text-slate-900 font-medium">{details.location}</p>
              </div>
            )}
          </div>
        </div>

        {/* Camera Preview */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-200">
          <div className="relative bg-slate-900 aspect-video flex items-center justify-center">
            <video
              ref={setVideoEl}
              autoPlay
              playsInline
              muted
              className={`h-full w-full object-cover ${
                preview.isCameraEnabled && preview.localStream
                  ? "block"
                  : "hidden"
              }`}
            />

            {!preview.loading &&
              !preview.error &&
              (!preview.localStream || !preview.isCameraEnabled) && (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center">
                    <VideoOff className="w-7 h-7 text-slate-400" />
                  </div>
                  <p className="text-slate-300 text-sm font-medium">
                    Camera is off
                  </p>
                </div>
              )}

            {preview.loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-900/80">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
                <p className="text-white text-sm font-medium">
                  Preparing camera...
                </p>
              </div>
            )}

            {preview.error && !preview.loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-slate-900/90 px-6 text-center">
                <AlertTriangle className="w-8 h-8 text-red-400" />
                <p className="text-white text-sm font-semibold">
                  {preview.error}
                </p>
                <p className="text-slate-400 text-xs">
                  Please allow camera and microphone permission.
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-center gap-3 p-4 bg-slate-50">
            <button
              onClick={preview.toggleMicrophone}
              disabled={preview.loading || !!preview.error}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 ${
                preview.isMuted
                  ? "bg-red-50 text-red-600 hover:bg-red-100"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {preview.isMuted ? (
                <MicOff className="w-4 h-4" />
              ) : (
                <Mic className="w-4 h-4" />
              )}
              {preview.isMuted ? "Microphone Muted" : "Microphone On"}
            </button>
            <button
              onClick={preview.toggleCamera}
              disabled={preview.loading || !!preview.error}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 ${
                !preview.isCameraEnabled
                  ? "bg-red-50 text-red-600 hover:bg-red-100"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {preview.isCameraEnabled ? (
                <Camera className="w-4 h-4" />
              ) : (
                <VideoOff className="w-4 h-4" />
              )}
              {preview.isCameraEnabled ? "Camera On" : "Camera Off"}
            </button>
          </div>
        </div>

        {/* Device Selection */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              label: "Camera",
              options: cameras,
              value: selectedCameraId,
              onChange: setSelectedCameraId,
            },
            {
              label: "Microphone",
              options: microphones,
              value: selectedMicrophoneId,
              onChange: setSelectedMicrophoneId,
            },
            {
              label: "Speaker",
              options: speakers,
              value: selectedSpeakerId,
              onChange: setSelectedSpeakerId,
              disabled: !supportsSpeakerSelection,
            },
          ].map((field) => {
            const singleDevice = field.options.length === 1;
            const currentLabel = field.options.find(
              (o) => o.deviceId === field.value,
            )?.label;

            return (
              <div key={field.label}>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-2">
                  {field.label}
                </label>

                {field.options.length === 0 ? (
                  <p className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-400 font-medium">
                    No device found
                  </p>
                ) : singleDevice ? (
                  <p className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 font-medium truncate">
                    {currentLabel || field.options[0].label}
                  </p>
                ) : (
                  <div className="relative">
                    <select
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      disabled={field.disabled}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 cursor-pointer"
                    >
                      {field.options.map((opt) => (
                        <option key={opt.deviceId} value={opt.deviceId}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Mic Level + Speaker Test */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-3">
              Microphone level
            </label>
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5 flex-1">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 flex-1 rounded-sm transition-colors ${
                      i < Math.ceil((micLevel / 100) * 20)
                        ? "bg-indigo-600"
                        : "bg-slate-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-semibold text-slate-500 w-9 text-right">
                {micLevel}%
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Speak to see the bars move.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-3">
              Speaker test
            </label>
            <button
              onClick={() =>
                playTestTone(
                  supportsSpeakerSelection ? selectedSpeakerId : undefined,
                )
              }
              disabled={testingSpeaker}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              <Volume2 className="w-4 h-4" />
              {testingSpeaker ? "Playing..." : "Test speaker"}
            </button>
            {!supportsSpeakerSelection && (
              <p className="text-xs text-slate-400 mt-2">
                Your browser doesn't support choosing an output device — the
                test tone will play on your system's default speaker.
              </p>
            )}
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200 space-y-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-1">
            System check
          </h3>

          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Browser compatibility</span>
            <span
              className={`flex items-center gap-1.5 font-medium ${
                isBrowserSupported ? "text-emerald-700" : "text-red-700"
              }`}
            >
              {isBrowserSupported ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <XCircle className="w-4 h-4 text-red-600" />
              )}
              {isBrowserSupported
                ? `${detectBrowserName()} supported`
                : "Browser not supported"}
            </span>
          </div>

          <PermissionRow label="Camera permission" state={cameraPermission} />
          <PermissionRow
            label="Microphone permission"
            state={microphonePermission}
          />

          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Connection</span>
            <span
              className={`flex items-center gap-1.5 font-medium ${
                connection.quality === "offline" ||
                connection.quality === "poor"
                  ? "text-red-700"
                  : connection.quality === "fair"
                    ? "text-amber-700"
                    : connection.quality === "unknown"
                      ? "text-slate-500"
                      : "text-emerald-700"
              }`}
            >
              {connection.quality === "offline" ? (
                <WifiOff className="w-4 h-4 text-red-600" />
              ) : (
                <Wifi className="w-4 h-4" />
              )}
              {connection.quality === "excellent" && "Excellent"}
              {connection.quality === "good" && "Good"}
              {connection.quality === "fair" && "Fair"}
              {connection.quality === "poor" && "Poor"}
              {connection.quality === "offline" && "Offline"}
              {connection.quality === "unknown" && "Unknown"}
            </span>
          </div>

          {permissionsDenied && (
            <p className="text-xs text-red-600 font-medium pt-1">
              Camera or microphone access was denied. Please allow both in your
              browser settings and reload this page to continue.
            </p>
          )}
        </div>

        {/* Countdown / Waiting */}
        {details.mode === "ONLINE" && (
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-slate-200 text-center">
            {!hasStarted ? (
              <>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 flex items-center justify-center gap-1.5">
                  <Timer className="w-4 h-4" /> Interview starts in
                </p>
                <p className="text-4xl font-bold text-indigo-600 font-mono">
                  {countdown.label}
                </p>
              </>
            ) : (
              <p className="text-sm font-medium text-slate-600">
                {role === "candidate" && interviewAlreadyOngoing
                  ? "The interview is already underway — join whenever you're ready."
                  : waitingMessage}
              </p>
            )}
          </div>
        )}

        {/* Guidelines */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5">
          <h4 className="font-bold text-slate-900 mb-2 text-sm">
            Before you join
          </h4>
          <ul className="text-sm text-slate-600 space-y-1">
            <li>• Sit in a quiet, well-lit environment.</li>
            <li>• Keep your camera enabled throughout the interview.</li>
            <li>• Make sure your internet connection is stable.</li>
            <li>• Keep your ID ready if required.</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handlePrimaryAction}
            disabled={primaryDisabled}
            className="flex-1 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-colors shadow-sm text-base flex items-center justify-center gap-2"
          >
            {enteringRoom && <Loader2 className="w-4 h-4 animate-spin" />}
            {primaryLabel}
          </button>
          <button
            onClick={handleCancel}
            disabled={enteringRoom}
            className="px-6 py-3.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function PermissionRow({
  label,
  state,
}: {
  label: string;
  state: "granted" | "denied" | "prompt" | "unknown";
}) {
  const map = {
    granted: {
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
      text: "Granted",
      tone: "text-emerald-700",
    },
    denied: {
      icon: <XCircle className="w-4 h-4 text-red-600" />,
      text: "Denied",
      tone: "text-red-700",
    },
    prompt: {
      icon: <HelpCircle className="w-4 h-4 text-amber-600" />,
      text: "Not yet requested",
      tone: "text-amber-700",
    },
    unknown: {
      icon: <HelpCircle className="w-4 h-4 text-slate-400" />,
      text: "Unknown",
      tone: "text-slate-500",
    },
  } as const;
  const { icon, text, tone } = map[state];
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-slate-600">{label}</span>
      <span className={`flex items-center gap-1.5 font-medium ${tone}`}>
        {icon}
        {text}
      </span>
    </div>
  );
}