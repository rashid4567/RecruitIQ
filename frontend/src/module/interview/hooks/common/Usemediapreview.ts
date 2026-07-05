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
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        setLocalStream(stream);
      } catch {
        if (!cancelled) {
          setError("Please allow camera and microphone permission.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    start();
    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
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
    let newTrack: MediaStreamTrack | undefined;
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: { exact: deviceId } },
        audio: false,
      });
      newTrack = newStream.getVideoTracks()[0];
      if (!newTrack) return;

      newTrack.enabled = isCameraEnabledRef.current;
      stream.addTrack(newTrack);

      const oldTrack = stream.getVideoTracks().find((t) => t !== newTrack);
      if (oldTrack) {
        stream.removeTrack(oldTrack);
        oldTrack.stop();
      }

      streamRef.current = stream;
      setLocalStream(stream);
    } catch {
      newTrack?.stop();
      setError("Could not switch camera.");
    }
  }, []);

  const switchMicrophone = useCallback(async (deviceId: string) => {
    const stream = streamRef.current;
    if (!stream) return;
    let newTrack: MediaStreamTrack | undefined;
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        audio: { deviceId: { exact: deviceId } },
        video: false,
      });
      newTrack = newStream.getAudioTracks()[0];
      if (!newTrack) return;

      newTrack.enabled = !isMutedRef.current;
      stream.addTrack(newTrack);

      const oldTrack = stream.getAudioTracks().find((t) => t !== newTrack);
      if (oldTrack) {
        stream.removeTrack(oldTrack);
        oldTrack.stop();
      }

      streamRef.current = stream;
      setLocalStream(stream);
    } catch {
      newTrack?.stop();
      setError("Could not switch microphone.");
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
