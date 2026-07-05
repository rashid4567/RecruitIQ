import { useCallback, useEffect, useRef, useState } from "react";
import { encodeWavMono } from "./wavEncoder";

interface UseSpeakerTestReturn {
  testing: boolean;
  error: string | null;
  playTestTone: (speakerDeviceId?: string) => Promise<void>;
  supported: boolean;
}

const supportsSetSinkId =
  typeof HTMLMediaElement !== "undefined" &&
  "setSinkId" in HTMLMediaElement.prototype;

/**
 * Generates a short real tone (no bundled audio asset needed) and plays
 * it through the selected output device via setSinkId when supported.
 */
export function useSpeakerTest(): UseSpeakerTestReturn {
  const [testing, setTesting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const urlRef = useRef<string | null>(null);
  const testingRef = useRef(false);

  // Revoke whatever object URL is still outstanding when the component
  // using this hook unmounts — otherwise the last test tone's blob URL
  // (and the memory backing it) stays allocated for the life of the tab.
  useEffect(() => {
    return () => {
      if (urlRef.current) {
        URL.revokeObjectURL(urlRef.current);
        urlRef.current = null;
      }
    };
  }, []);

  const playTestTone = useCallback(async (speakerDeviceId?: string) => {
    if (testingRef.current) return;
    testingRef.current = true;
    setTesting(true);
    setError(null);

    let audio: HTMLAudioElement | null = null;

    try {
      const AudioContextCtor =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioContextCtor) {
        setError("Your browser doesn't support playing a test tone.");
        return;
      }

      const duration = 0.7;
      const offlineCtx = new OfflineAudioContext(1, 44100 * duration, 44100);
      const oscillator = offlineCtx.createOscillator();
      const gain = offlineCtx.createGain();

      // Two notes (440Hz -> 660Hz) reads more like a real device test
      // tone than a single flat pitch.
      oscillator.frequency.setValueAtTime(440, 0);
      oscillator.frequency.setValueAtTime(660, duration / 2);

      // Smoother envelope: quick fade in, brief hold, gentle fade out.
      gain.gain.setValueAtTime(0.0001, 0);
      gain.gain.linearRampToValueAtTime(0.35, 0.1);
      gain.gain.linearRampToValueAtTime(0.2, 0.5);
      gain.gain.linearRampToValueAtTime(0.0001, duration);

      oscillator.connect(gain);
      gain.connect(offlineCtx.destination);
      oscillator.start(0);

      const rendered = await offlineCtx.startRendering();
      const blob = encodeWavMono(rendered);

      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
      const url = URL.createObjectURL(blob);
      urlRef.current = url;

      audio = new Audio(url);
      const audioWithSink = audio as HTMLAudioElement & {
        setSinkId?: (id: string) => Promise<void>;
      };

      if (speakerDeviceId && typeof audioWithSink.setSinkId === "function") {
        try {
          await audioWithSink.setSinkId(speakerDeviceId);
        } catch {
          // Some browsers reject setSinkId without a user gesture in
          // certain contexts — fall back to default output silently.
        }
      }

      await audio.play();
      await new Promise((resolve) => {
        audio!.onended = resolve;
      });
    } catch (err) {
      console.error("[useSpeakerTest] Failed to play test tone.", err);
      setError("Unable to play speaker test.");
    } finally {
      if (audio) {
        audio.pause();
        audio.src = "";
      }
      testingRef.current = false;
      setTesting(false);
    }
  }, []);

  return { testing, error, playTestTone, supported: supportsSetSinkId };
}