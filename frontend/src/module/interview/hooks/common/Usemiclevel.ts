import { useEffect, useRef, useState } from "react";

export function useMicLevel(
  stream: MediaStream | null,
  isMuted: boolean,
): number {
  const [level, setLevel] = useState(0);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!stream || isMuted) {
      setLevel(0);
      return;
    }

    const audioTracks = stream.getAudioTracks();
    if (audioTracks.length === 0) {
      setLevel(0);
      return;
    }

    const AudioContextCtor: typeof AudioContext | undefined =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;

    if (!AudioContextCtor) {
      setLevel(0);
      return;
    }

    const audioContext = new AudioContextCtor();
    const analyserSource = audioContext.createMediaStreamSource(
      new MediaStream(audioTracks),
    );
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 512;
    analyser.smoothingTimeConstant = 0.6;
    analyserSource.connect(analyser);

    const buffer = new Uint8Array(analyser.frequencyBinCount);
    let cancelled = false;

    const tick = () => {
      if (cancelled) return;
      analyser.getByteTimeDomainData(buffer);

      let sumOfSquares = 0;
      for (let i = 0; i < buffer.length; i += 1) {
        const centered = (buffer[i] - 128) / 128;
        sumOfSquares += centered * centered;
      }
      const rms = Math.sqrt(sumOfSquares / buffer.length);
      setLevel(Math.min(100, Math.round(rms * 300)));
      frameRef.current = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      cancelled = true;
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      analyserSource.disconnect();
      analyser.disconnect();
      audioContext.close().catch(() => undefined);
    };
  }, [stream, isMuted]);

  return level;
}
