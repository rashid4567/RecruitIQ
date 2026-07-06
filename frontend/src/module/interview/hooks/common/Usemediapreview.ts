import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export function useMediaPreview() {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraEnabled, setIsCameraEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const isCameraEnabledRef = useRef(isCameraEnabled);
  const isMutedRef = useRef(isMuted);

  useEffect(() => {
    isCameraEnabledRef.current = isCameraEnabled;
  }, [isCameraEnabled]);
  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

useEffect(() => {
  let cancelled = false;

  async function start() {
    setLoading(true);
    setError(null);

    if (!navigator.mediaDevices?.getUserMedia) {
      if (!cancelled) {
        setError(
          "Camera and microphone are not supported in this browser.",
        );
        setLoading(false);
      }
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (cancelled) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      streamRef.current = stream;
      setLocalStream(stream);
    } catch (err) {
      if (!cancelled) {
        if (err instanceof DOMException) {
          switch (err.name) {
            case "NotAllowedError":
              setError("Camera and microphone permission was denied.");
              break;

            case "NotFoundError":
              setError("No camera or microphone was found.");
              break;

            case "NotReadableError":
              setError(
                "Camera or microphone is currently being used by another application.",
              );
              break;

            case "OverconstrainedError":
              setError(
                "The selected camera or microphone is unavailable.",
              );
              break;

            default:
              setError("Unable to access camera and microphone.");
          }
        } else {
          setError("Unable to access camera and microphone.");
        }
      }
    } finally {
      if (!cancelled) {
        setLoading(false);
      }
    }
  }

  start();

  return () => {
    cancelled = true;

    streamRef.current?.getTracks().forEach((track) => track.stop());

    streamRef.current = null;

    setLocalStream(null);
  };
}, []);

  const toggleMicrophone = useCallback(() => {
    const stream = streamRef.current;
    if (!stream) return;
    const nextMuted = !isMutedRef.current;
    stream.getAudioTracks().forEach((t) => (t.enabled = !nextMuted));
    setIsMuted(nextMuted);
  }, []);

  const toggleCamera = useCallback(() => {
    const stream = streamRef.current;
    if (!stream) return;
    const nextEnabled = !isCameraEnabledRef.current;
    stream.getVideoTracks().forEach((t) => (t.enabled = nextEnabled));
    setIsCameraEnabled(nextEnabled);
  }, []);
const switchCamera = useCallback(async (deviceId: string) => {
  const stream = streamRef.current;

  if (!stream) return;

  setLoading(true);
  setError(null);

  let newTrack: MediaStreamTrack | undefined;

  try {
    const newStream = await navigator.mediaDevices.getUserMedia({
      video: {
        deviceId: {
          exact: deviceId,
        },
      },
      audio: false,
    });

    newTrack = newStream.getVideoTracks()[0];

    if (!newTrack) {
      throw new Error("No video track found.");
    }

    newTrack.enabled = isCameraEnabledRef.current;

    const oldTrack = stream.getVideoTracks()[0];

    if (oldTrack) {
      oldTrack.stop();
      stream.removeTrack(oldTrack);
    }

    stream.addTrack(newTrack);

    streamRef.current = stream;

    setLocalStream(stream);
  } catch (err) {
    newTrack?.stop();

    if (err instanceof DOMException) {
      switch (err.name) {
        case "NotAllowedError":
          setError("Camera permission was denied.");
          break;

        case "NotFoundError":
          setError("Selected camera was not found.");
          break;

        default:
          setError("Could not switch camera.");
      }
    } else {
      setError("Could not switch camera.");
    }
  } finally {
    setLoading(false);
  }
}, []);

const switchMicrophone = useCallback(async (deviceId: string) => {
  const stream = streamRef.current;

  if (!stream) return;

  setLoading(true);
  setError(null);

  let newTrack: MediaStreamTrack | undefined;

  try {
    const newStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        deviceId: {
          exact: deviceId,
        },
      },
      video: false,
    });

    newTrack = newStream.getAudioTracks()[0];

    if (!newTrack) {
      throw new Error("No audio track found.");
    }

    newTrack.enabled = !isMutedRef.current;

    const oldTrack = stream.getAudioTracks()[0];

    if (oldTrack) {
      oldTrack.stop();
      stream.removeTrack(oldTrack);
    }

    stream.addTrack(newTrack);

    streamRef.current = stream;

    setLocalStream(stream);
  } catch (err) {
    newTrack?.stop();

    if (err instanceof DOMException) {
      switch (err.name) {
        case "NotAllowedError":
          setError("Microphone permission was denied.");
          break;

        case "NotFoundError":
          setError("Selected microphone was not found.");
          break;

        default:
          setError("Could not switch microphone.");
      }
    } else {
      setError("Could not switch microphone.");
    }
  } finally {
    setLoading(false);
  }
}, []);

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
