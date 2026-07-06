import { useCallback, useEffect, useRef, useState } from "react";
import { WebRTCService } from "../../services/WebRTCService";
import { socketService } from "../../services/SocketService";

import type {
  AnswerPayload,
  ChatMessageReceivedPayload,
  IceCandidatePayload,
  JoinRoomFailedPayload,
  OfferPayload,
  RoomJoinedPayload,
  UserJoinedPayload,
  UserLeftPayload,
} from "../../types/socket.types";

import type {
  CallState,
  IceConnectionState,
  PeerConnectionState,
} from "../../types/webrtc.types";

export type ParticipantRole = "candidate" | "recruiter";
const JOIN_ROOM_TIMEOUT_MS = 15000;

interface UseInterviewCallParams {
  interviewId: string;
  roomId: string;
  userId: string;
  role: ParticipantRole;
  onCallEnded?: () => void;
  onError?: (message: string) => void;
}

interface UseInterviewCallReturn {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  loading: boolean;
  error: string | null;
  callState: CallState;
  connectionState: PeerConnectionState;
  iceConnectionState: IceConnectionState;
  isMuted: boolean;
  isCameraEnabled: boolean;
  isScreenSharing: boolean;
  initialize: () => Promise<void>;
  toggleMicrophone: () => void;
  toggleCamera: () => void;
  toggleScreenShare: () => Promise<void>;
  messages: ChatMessageReceivedPayload[];
  sendMessage: (message: string) => void;
  endCall: () => Promise<void>;
}

export function useInterviewCall({
  interviewId,
  roomId,
  userId,
  role,
  onCallEnded,
  onError,
}: UseInterviewCallParams): UseInterviewCallReturn {
  const webRTCRef = useRef<WebRTCService | null>(null);
  if (!webRTCRef.current) {
    webRTCRef.current = new WebRTCService();
  }
  const webRTC = webRTCRef.current;
  const pendingIceCandidatesRef = useRef<RTCIceCandidateInit[]>([]);
  const isInitializedRef = useRef(false);
  const hasJoinedRoomRef = useRef(false);
  const joinTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [callState, setCallState] = useState<CallState>("IDLE");
  const [connectionState, setConnectionState] =
    useState<PeerConnectionState>("new");
  const [iceConnectionState, setIceConnectionState] =
    useState<IceConnectionState>("new");
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraEnabled, setIsCameraEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const callbacksRegisteredRef = useRef(false);
  const [messages, setMessages] = useState<ChatMessageReceivedPayload[]>([]);

  const clearJoinTimeout = useCallback(() => {
    if (joinTimeoutRef.current) {
      clearTimeout(joinTimeoutRef.current);
      joinTimeoutRef.current = null;
    }
  }, []);

  const handleError = useCallback(
    (message: string, err?: unknown) => {
      console.error(`[useInterviewCall] ${message}`, err);
      setError(message);
      setCallState("ENDED");
      onError?.(message);
    },
    [onError],
  );

  const handleChatMessage = useCallback(
    (payload: ChatMessageReceivedPayload) => {
      console.log("[CHAT] Message received");
      console.log(payload);

      setMessages((prev) => {
        const next = [...prev, payload];

        return next.slice(-100);
      });
    },
    [],
  );

  const flushPendingIceCandidates = useCallback(async () => {
    const queued = pendingIceCandidatesRef.current;
    pendingIceCandidatesRef.current = [];

    for (const candidate of queued) {
      try {
        await webRTC.addIceCandidate(candidate);
      } catch (err) {
        console.error("[ICE] Failed to add queued candidate", err);
      }
    }
  }, [webRTC]);
  const createAndSendOffer = useCallback(async () => {
    try {
      console.log("[OFFER] Creating and sending offer.", { roomId, role });

      const offer = await webRTC.createOffer();

      socketService.sendOffer({
        roomId,
        offer,
      });
    } catch (err) {
      handleError("Failed to create offer.", err);
    }
  }, [webRTC, roomId, role, handleError]);

  const handleOffer = useCallback(
    async (payload: OfferPayload) => {
      console.log("======================================");
      console.log("[SIGNALING] OFFER RECEIVED");
      console.log("======================================");
      console.log(payload);

      try {
        await webRTC.handleOffer(payload.offer);

        await flushPendingIceCandidates();

        console.log("[SIGNALING] Remote description set.");

        const answer = await webRTC.createAnswer();

        console.log("[SIGNALING] SDP Answer created.");

        socketService.sendAnswer({
          roomId,
          answer,
        });

        console.log("[SIGNALING] Answer sent.");
      } catch (err) {
        console.error("[SIGNALING] Failed handling offer.", err);
      }
    },
    [roomId, webRTC, flushPendingIceCandidates],
  );

  const handleAnswer = useCallback(
    async (payload: AnswerPayload) => {
      console.log("======================================");
      console.log("[SIGNALING] ANSWER RECEIVED");
      console.log("======================================");
      console.log(payload);

      try {
        await webRTC.handleAnswer(payload.answer);

        await flushPendingIceCandidates();

        console.log("[SIGNALING] Remote description applied.");
      } catch (err) {
        console.error("[SIGNALING] Failed handling answer.", err);
      }
    },
    [webRTC, flushPendingIceCandidates],
  );

  const handleRemoteIceCandidate = useCallback(
    async ({ candidate }: IceCandidatePayload) => {
      try {
        console.log("[ICE] Received remote candidate.", { roomId, role });
        if (webRTC.hasRemoteDescription()) {
          await webRTC.addIceCandidate(candidate);
        } else {
          pendingIceCandidatesRef.current.push(candidate);
        }
      } catch (err) {
        console.error("[ICE] Failed to add candidate", err);
      }
    },
    [webRTC, roomId, role],
  );

  const handleUserJoined = useCallback(
    async (payload: UserJoinedPayload) => {
      console.log("[ROOM] User joined.", {
        payload,
        role,
      });

      if (role !== "recruiter") {
        return;
      }

      try {
        if (webRTC.getSignalingState() !== "stable") {
          console.log(
            "[ROOM] Skipping offer because PeerConnection is negotiating.",
          );
          return;
        }

        await createAndSendOffer();
      } catch (err) {
        console.warn(
          "[ROOM] Unable to create offer because PeerConnection is unavailable.",
          err,
        );
      }
    },
    [role, webRTC, createAndSendOffer],
  );
  const handleUserLeft = useCallback(
    (payload: UserLeftPayload) => {
      console.log("======================================");
      console.log("[ROOM] USER_LEFT");
      console.log("======================================");
      console.log(payload);

      setRemoteStream(null);
      setConnectionState("disconnected");

      console.log(
        role === "recruiter"
          ? "[ROOM] Candidate disconnected. Waiting for candidate to rejoin..."
          : "[ROOM] Recruiter disconnected. Waiting for recruiter to rejoin...",
      );
    },
    [role],
  );

  const handleRoomJoined = useCallback((payload: RoomJoinedPayload) => {
    console.log("======================================");
    console.log("[ROOM] ROOM_JOINED");
    console.log("======================================");
    console.log(payload);

    clearJoinTimeout();

    hasJoinedRoomRef.current = true;

    setCallState("CONNECTING");
    setLoading(false);

    console.log("[ROOM] Successfully joined room");
  }, []);

  const handleJoinRoomFailed = useCallback(
    (payload: JoinRoomFailedPayload) => {
      console.error("[ROOM] Join failed.", {
        roomId,
        interviewId,
        role,
        payload,
      });
      clearJoinTimeout();
      handleError(payload.message || "Failed to join the interview room.");
      setLoading(false);
      socketService.removeAllListeners();
      socketService.disconnect();
      webRTC.dispose();
      pendingIceCandidatesRef.current = [];
      isInitializedRef.current = false;
      hasJoinedRoomRef.current = false;
      callbacksRegisteredRef.current = false;
    },
    [clearJoinTimeout, handleError, webRTC, roomId, interviewId, role],
  );

  const registerWebRTCCallbacks = useCallback(() => {
    webRTC.onIceCandidate((candidate) => {
      socketService.sendIceCandidate({
        roomId,
        candidate: candidate.toJSON(),
      });
    });

    webRTC.onRemoteStream((stream) => {
      console.log("[REMOTE STREAM] Received.", {
        tracks: stream.getTracks().length,
      });
      setRemoteStream(stream);
    });

    webRTC.onConnectionStateChanged((state) => {
      setConnectionState(state);

      switch (state) {
        case "connected":
          setCallState("CONNECTED");
          break;
        case "connecting":
          setCallState("CONNECTING");
          break;
        case "disconnected":
          console.log("[WEBRTC] Waiting for peer to reconnect...");
          break;
        case "failed":
          console.warn("[WEBRTC] PeerConnection failed.");
          webRTC.dispose();
          isInitializedRef.current = false;
          setRemoteStream(null);
          setCallState("ENDED");
          break;
        case "closed":
          console.log("[WEBRTC] PeerConnection closed.");
          break;
      }
    });
    webRTC.onIceConnectionStateChanged((state) => {
      console.log("[ICE]", state);

      setIceConnectionState(state);
    });
  }, [webRTC, roomId, role]);

  const registerSocketEvents = useCallback(() => {
    socketService.onRoomJoined(handleRoomJoined);
    socketService.onJoinRoomFailed(handleJoinRoomFailed);
    socketService.onUserJoined(handleUserJoined);
    socketService.onUserLeft(handleUserLeft);
    socketService.onOffer(handleOffer);
    socketService.onAnswer(handleAnswer);
    socketService.onChatMessage(handleChatMessage);
    socketService.onIceCandidate(handleRemoteIceCandidate);
  }, [
    handleRoomJoined,
    handleJoinRoomFailed,
    handleUserJoined,
    handleUserLeft,
    handleOffer,
    handleAnswer,
    handleChatMessage,
    handleRemoteIceCandidate,
  ]);

  const initialize = useCallback(async () => {
    if (isInitializedRef.current) {
      console.log("======================================");
      console.log("[CALL] Already initialized");
      console.log("======================================");
      return;
    }

    isInitializedRef.current = true;

    console.log("=================================================");
    console.log("[CALL] Initialization Started");
    console.log("=================================================");
    console.log({
      interviewId,
      roomId,
      userId,
      role,
    });

    setError(null);
    setMessages([]);
    setLoading(true);
    setCallState("CONNECTING");

    try {
      // ==================================================
      // STEP 1 - Initialize WebRTC
      // ==================================================

      console.log("======================================");
      console.log("[STEP 1] Initializing WebRTC");
      console.log("======================================");

      await webRTC.initialize();

      console.log("[STEP 1] WebRTC Initialized");

      setLocalStream(webRTC.getLocalStream());
      setIsMuted(!webRTC.isMicrophoneEnabled());
      setIsCameraEnabled(webRTC.isCameraEnabled());

      // ==================================================
      // STEP 2 - Connect Socket FIRST
      // ==================================================

      console.log("======================================");
      console.log("[STEP 2] Connecting Socket");
      console.log("======================================");

      const socket = socketService.connect();

      console.log("[STEP 2] Socket Instance");
      console.log({
        connected: socket.connected,
        socketId: socket.id,
      });

      if (!socket.connected) {
        console.log("[STEP 2] Waiting for socket connection...");

        await new Promise<void>((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error("Socket connection timeout"));
          }, 10000);

          socket.once("connect", () => {
            clearTimeout(timeout);

            console.log("======================================");
            console.log("[SOCKET] Connected Successfully");
            console.log({
              socketId: socket.id,
            });
            console.log("======================================");

            resolve();
          });

          socket.once("connect_error", (err) => {
            clearTimeout(timeout);

            console.error("[SOCKET] Connection Failed");
            console.error(err);

            reject(err);
          });
        });
      }

      console.log("[STEP 2] Socket Ready");

      // ==================================================
      // STEP 3 - Register Callbacks
      // ==================================================

      if (!callbacksRegisteredRef.current) {
        console.log("======================================");
        console.log("[STEP 3] Registering Callbacks");
        console.log("======================================");

        registerWebRTCCallbacks();
        registerSocketEvents();

        callbacksRegisteredRef.current = true;

        console.log("[STEP 3] All callbacks registered");
      } else {
        console.log("[STEP 3] Callbacks already registered");
      }

      // ==================================================
      // STEP 4 - Join Room
      // ==================================================

      console.log("======================================");
      console.log("[STEP 4] Joining Room");
      console.log("======================================");

      console.log({
        interviewId,
        roomId,
        userId,
        role,
      });

      socketService.joinRoom({
        interviewId,
        roomId,
        userId,
        role,
      });

      console.log("[STEP 4] JOIN_ROOM emitted");
      console.log("[STEP 4] Waiting for ROOM_JOINED event...");

      // ==================================================
      // STEP 5 - Timeout
      // ==================================================

      clearJoinTimeout();

      joinTimeoutRef.current = setTimeout(() => {
        if (hasJoinedRoomRef.current) {
          console.log("[TIMEOUT] Already joined room");
          return;
        }

        console.error("======================================");
        console.error("[TIMEOUT] ROOM_JOINED was never received");
        console.error("======================================");

        console.error({
          interviewId,
          roomId,
          userId,
          role,
        });

        handleError("Timed out while joining the interview room.");

        socketService.removeAllListeners();
        socketService.disconnect();

        webRTC.dispose();

        pendingIceCandidatesRef.current = [];

        isInitializedRef.current = false;
        hasJoinedRoomRef.current = false;
        callbacksRegisteredRef.current = false;

        setLoading(false);
        setCallState("ENDED");
      }, JOIN_ROOM_TIMEOUT_MS);

      console.log("=================================================");
      console.log("[CALL] Initialization Completed");
      console.log("=================================================");
    } catch (err) {
      console.error("======================================");
      console.error("[CALL] Initialization Failed");
      console.error("======================================");
      console.error(err);

      clearJoinTimeout();

      socketService.removeAllListeners();
      socketService.disconnect();

      webRTC.dispose();

      pendingIceCandidatesRef.current = [];

      isInitializedRef.current = false;
      hasJoinedRoomRef.current = false;
      callbacksRegisteredRef.current = false;

      setLoading(false);

      handleError("Failed to initialize the interview call.", err);
    }
  }, [
    webRTC,
    interviewId,
    roomId,
    userId,
    role,
    registerWebRTCCallbacks,
    registerSocketEvents,
    clearJoinTimeout,
    handleError,
  ]);

  const toggleMicrophone = useCallback(() => {
    const enabled = webRTC.toggleMicrophone();
    setIsMuted(!enabled);
  }, [webRTC]);

  const toggleCamera = useCallback(() => {
    const enabled = webRTC.toggleCamera();
    setIsCameraEnabled(enabled);
  }, [webRTC]);

  const toggleScreenShare = useCallback(async () => {
    try {
      if (isScreenSharing) {
        await webRTC.stopScreenShare();
        setIsScreenSharing(false);
      } else {
        await webRTC.startScreenShare();
        setIsScreenSharing(true);
      }
      setLocalStream(webRTC.getLocalStream());
    } catch (err) {
      handleError("Failed to toggle screen sharing.", err);
    }
  }, [webRTC, isScreenSharing, handleError]);

  const sendMessage = useCallback(
    (message: string) => {
      const text = message.trim();

      if (!text) {
        return;
      }

      const sentAt = new Date().toISOString();

      socketService.sendChatMessage({
        roomId,
        message: text,
      });

      setMessages((prev) => [
        ...prev,
        {
          roomId,
          senderId: userId,
          senderRole: role,
          message: text,
          sentAt,
        },
      ]);
    },
    [roomId, role, userId],
  );

  const endCall = useCallback(async () => {
    try {
      console.log("[CALL] Ending...", {
        roomId,
        interviewId,
        role,
      });

      clearJoinTimeout();

      if (hasJoinedRoomRef.current) {
        socketService.leaveRoom({ roomId });
        hasJoinedRoomRef.current = false;
      }

      socketService.removeAllListeners();
      socketService.disconnect();

      webRTC.dispose();

      isInitializedRef.current = false;
      callbacksRegisteredRef.current = false;
      pendingIceCandidatesRef.current = [];

      setLocalStream(null);
      setRemoteStream(null);
      setMessages([]);
      setIsMuted(false);
      setIsCameraEnabled(true);
      setIsScreenSharing(false);

      setCallState("ENDED");
      setConnectionState("closed");
      setIceConnectionState("closed");

      setLoading(false);
      setError(null);

      onCallEnded?.();

      console.log("[CALL] Ended.", {
        roomId,
        interviewId,
        role,
      });
    } catch (err) {
      console.error("[CALL] Failed to end call.", err);
      handleError("Failed to end the interview call.", err);
    } finally {
      clearJoinTimeout();
      pendingIceCandidatesRef.current = [];
    }
  }, [
    webRTC,
    roomId,
    interviewId,
    role,
    onCallEnded,
    clearJoinTimeout,
    handleError,
  ]);

  useEffect(() => {
    return () => {
      clearJoinTimeout();
      pendingIceCandidatesRef.current = [];
      if (isInitializedRef.current) {
        socketService.removeAllListeners();
        setMessages([]);
        socketService.disconnect();
        webRTC.dispose();
        isInitializedRef.current = false;
        hasJoinedRoomRef.current = false;
        callbacksRegisteredRef.current = false;
      }
    };
  }, [clearJoinTimeout, webRTC]);

  return {
    localStream,
    remoteStream,
    loading,
    error,
    callState,
    connectionState,
    iceConnectionState,
    isMuted,
    isCameraEnabled,
    isScreenSharing,
    messages,
    sendMessage,
    initialize,
    toggleMicrophone,
    toggleCamera,
    toggleScreenShare,
    endCall,
  };
}
