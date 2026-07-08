import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const GET_USER_MEDIA_TIMEOUT_MS = 10000;

function mapGetUserMediaError(err: unknown, fallback: string): string {
  if (err instanceof DOMException) {
    switch (err.name) {
      case "NotAllowedError":
        return "Camera and microphone permission was denied.";
      case "NotFoundError":
        return "No camera or microphone was found.";
      case "NotReadableError":
        return "Camera or microphone is currently being used by another application.";
      case "OverconstrainedError":
        return "The selected camera or microphone is unavailable.";
      case "AbortError":
        return "Camera access was interrupted.";
      case "SecurityError":
        return "Camera access is blocked by your browser's security settings.";
      default:
        return err.message || fallback;
    }
  }
  console.error(err);
  return fallback;
}

function getUserMediaWithTimeout(
  constraints: MediaStreamConstraints,
  timeoutMs = GET_USER_MEDIA_TIMEOUT_MS,
): Promise<MediaStream> {
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => {
      reject(new Error("Timed out waiting for camera/microphone access."));
    }, timeoutMs);

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        clearTimeout(timer);
        resolve(stream);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}
function labelForKind(kind: string): string {
  return kind === "video" ? "Camera" : "Microphone";
}

export function useMediaPreview() {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraEnabled, setIsCameraEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const streamRef = useRef<MediaStream | null>(null);
  const isCameraEnabledRef = useRef(isCameraEnabled);
  const isMutedRef = useRef(isMuted);
  const isInitializingRef = useRef(false);
  const mountedRef = useRef(true);
  const currentVideoDeviceIdRef = useRef<string | null>(null);
  const currentAudioDeviceIdRef = useRef<string | null>(null);
  const deviceMissingRef = useRef(false);

  useEffect(() => {
    isCameraEnabledRef.current = isCameraEnabled;
  }, [isCameraEnabled]);
  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  const wireTrack = useCallback((track: MediaStreamTrack) => {
    track.onended = () => {
      if (!mountedRef.current) return;
      deviceMissingRef.current = true;
      setError(`${labelForKind(track.kind)} disconnected.`);
    };
  }, []);

  const wireTrackListeners = useCallback(
    (stream: MediaStream) => {
      stream.getTracks().forEach(wireTrack);
    },
    [wireTrack],
  );

  const unwireTrack = useCallback((track: MediaStreamTrack) => {
    track.onended = null;
  }, []);

  const start = useCallback(async () => {
    if (isInitializingRef.current) return;
    isInitializingRef.current = true;

    setLoading(true);
    setError(null);

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error(
          "Camera and microphone are not supported in this browser.",
        );
      }

      streamRef.current?.getTracks().forEach((track) => {
        unwireTrack(track);
        track.stop();
      });
      streamRef.current = null;

      const stream = await getUserMediaWithTimeout({
        video: true,
        audio: true,
      });

      if (!mountedRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      stream
        .getVideoTracks()
        .forEach((t) => (t.enabled = isCameraEnabledRef.current));
      stream.getAudioTracks().forEach((t) => (t.enabled = !isMutedRef.current));

      wireTrackListeners(stream);

      currentVideoDeviceIdRef.current =
        stream.getVideoTracks()[0]?.getSettings().deviceId ?? null;
      currentAudioDeviceIdRef.current =
        stream.getAudioTracks()[0]?.getSettings().deviceId ?? null;
      deviceMissingRef.current = false;

      streamRef.current = stream;
      setLocalStream(stream);
    } catch (err) {
      if (mountedRef.current) {
        setError(
          mapGetUserMediaError(err, "Unable to access camera and microphone."),
        );
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
      isInitializingRef.current = false;
    }
  }, [wireTrackListeners, unwireTrack]);

  useEffect(() => {
    mountedRef.current = true;

    start();

    return () => {
      mountedRef.current = false;
      streamRef.current?.getTracks().forEach((track) => {
        unwireTrack(track);
        track.stop();
      });
      streamRef.current = null;
      currentVideoDeviceIdRef.current = null;
      currentAudioDeviceIdRef.current = null;
    };
  }, [start, unwireTrack]);

  const toggleMicrophone = useCallback(() => {
    const stream = streamRef.current;
    if (!stream) return;
    const nextMuted = !isMutedRef.current;
    stream.getAudioTracks().forEach((t) => (t.enabled = !nextMuted));
    isMutedRef.current = nextMuted;
    setIsMuted(nextMuted);
  }, []);

  const toggleCamera = useCallback(() => {
    const stream = streamRef.current;
    if (!stream) return;
    const nextEnabled = !isCameraEnabledRef.current;
    stream.getVideoTracks().forEach((t) => (t.enabled = nextEnabled));
    isCameraEnabledRef.current = nextEnabled;
    setIsCameraEnabled(nextEnabled);
  }, []);

  const switchCamera = useCallback(
    async (deviceId: string) => {
      const stream = streamRef.current;
      if (!stream) return;
      if (currentVideoDeviceIdRef.current === deviceId) return;

      setLoading(true);
      setError(null);

      let tempStream: MediaStream | null = null;

      try {
        tempStream = await getUserMediaWithTimeout({
          video: { deviceId: { exact: deviceId } },
          audio: false,
        });

        if (!mountedRef.current) {
          tempStream.getTracks().forEach((track) => track.stop());
          return;
        }

        const newTrack = tempStream.getVideoTracks()[0];
        if (!newTrack) {
          throw new Error("No video track found.");
        }

        newTrack.enabled = isCameraEnabledRef.current;

        const oldTrack = stream.getVideoTracks()[0];

        stream.addTrack(newTrack);

        if (oldTrack) {
          stream.removeTrack(oldTrack);
          unwireTrack(oldTrack);
          oldTrack.stop();
        }
        wireTrack(newTrack);

        currentVideoDeviceIdRef.current =
          newTrack.getSettings().deviceId ?? deviceId;
        streamRef.current = stream;
        setLocalStream(stream);
      } catch (err) {
        if (mountedRef.current) {
          setError(mapGetUserMediaError(err, "Could not switch camera."));
        }
      } finally {
        const activeVideoTrack = streamRef.current?.getVideoTracks()[0];
        tempStream?.getTracks().forEach((track) => {
          if (track.readyState === "live" && track !== activeVideoTrack) {
            track.stop();
          }
        });

        if (mountedRef.current) setLoading(false);
      }
    },
    [wireTrack, unwireTrack],
  );

  const switchMicrophone = useCallback(
    async (deviceId: string) => {
      const stream = streamRef.current;
      if (!stream) return;

      if (currentAudioDeviceIdRef.current === deviceId) return;

      setLoading(true);
      setError(null);

      let tempStream: MediaStream | null = null;

      try {
        tempStream = await getUserMediaWithTimeout({
          audio: { deviceId: { exact: deviceId } },
          video: false,
        });

        if (!mountedRef.current) {
          tempStream.getTracks().forEach((track) => track.stop());
          return;
        }

        const newTrack = tempStream.getAudioTracks()[0];
        if (!newTrack) {
          throw new Error("No audio track found.");
        }

        newTrack.enabled = !isMutedRef.current;

        const oldTrack = stream.getAudioTracks()[0];

        stream.addTrack(newTrack);

        if (oldTrack) {
          stream.removeTrack(oldTrack);
          unwireTrack(oldTrack);
          oldTrack.stop();
        }

        wireTrack(newTrack);

        currentAudioDeviceIdRef.current =
          newTrack.getSettings().deviceId ?? deviceId;

        streamRef.current = stream;
        setLocalStream(stream);
      } catch (err) {
        if (mountedRef.current) {
          setError(mapGetUserMediaError(err, "Could not switch microphone."));
        }
      } finally {
        const activeAudioTrack = streamRef.current?.getAudioTracks()[0];
        tempStream?.getTracks().forEach((track) => {
          if (track.readyState === "live" && track !== activeAudioTrack) {
            track.stop();
          }
        });

        if (mountedRef.current) setLoading(false);
      }
    },
    [wireTrack, unwireTrack],
  );

  useEffect(() => {
    if (!navigator.mediaDevices?.addEventListener) return;

    const handleDeviceChange = async () => {
      if (!navigator.mediaDevices?.enumerateDevices) return;

      try {
        const list = await navigator.mediaDevices.enumerateDevices();
        if (!mountedRef.current) return;
        if (!streamRef.current) return;

        const videoStillPresent =
          !currentVideoDeviceIdRef.current ||
          list.some(
            (d) =>
              d.kind === "videoinput" &&
              d.deviceId === currentVideoDeviceIdRef.current,
          );
        const audioStillPresent =
          !currentAudioDeviceIdRef.current ||
          list.some(
            (d) =>
              d.kind === "audioinput" &&
              d.deviceId === currentAudioDeviceIdRef.current,
          );

        if (!videoStillPresent) {
          deviceMissingRef.current = true;
          setError("Camera disconnected.");
        } else if (!audioStillPresent) {
          deviceMissingRef.current = true;
          setError("Microphone disconnected.");
        } else if (deviceMissingRef.current) {
          deviceMissingRef.current = false;
          setError(null);
          start();
        }
      } catch (err) {
        console.error(err);
      }
    };

    navigator.mediaDevices.addEventListener("devicechange", handleDeviceChange);
    return () => {
      navigator.mediaDevices.removeEventListener(
        "devicechange",
        handleDeviceChange,
      );
    };
  }, [start]);

  return useMemo(
    () => ({
      localStream,
      isMuted,
      isCameraEnabled,
      loading,
      error,
      toggleMicrophone,
      toggleCamera,
      switchCamera,
      switchMicrophone,
    }),
    [
      localStream,
      isMuted,
      isCameraEnabled,
      loading,
      error,
      toggleMicrophone,
      toggleCamera,
      switchCamera,
      switchMicrophone,
    ],
  );
}
