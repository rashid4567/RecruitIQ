import { useCallback, useEffect, useState } from "react";

export interface MediaDeviceOption {
  deviceId: string;
  label: string;
}

export type PermissionState = "granted" | "denied" | "prompt" | "unknown";

interface UseMediaDevicesReturn {
  cameras: MediaDeviceOption[];
  microphones: MediaDeviceOption[];
  speakers: MediaDeviceOption[];
  cameraPermission: PermissionState;
  microphonePermission: PermissionState;
  supportsSpeakerSelection: boolean;
  refresh: () => Promise<void>;
}

export function useMediaDevices(hasLocalStream: boolean): UseMediaDevicesReturn {
  const [cameras, setCameras] = useState<MediaDeviceOption[]>([]);
  const [microphones, setMicrophones] = useState<MediaDeviceOption[]>([]);
  const [speakers, setSpeakers] = useState<MediaDeviceOption[]>([]);
  const [cameraPermission, setCameraPermission] = useState<PermissionState>("unknown");
  const [microphonePermission, setMicrophonePermission] = useState<PermissionState>("unknown");

  const supportsSpeakerSelection =
    typeof window !== "undefined" &&
    typeof window.HTMLMediaElement !== "undefined" &&
    "setSinkId" in window.HTMLMediaElement.prototype;

  const refresh = useCallback(async () => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.enumerateDevices) {
      return;
    }

    try {
      const devices = await navigator.mediaDevices.enumerateDevices();

      const toOption = (
        device: MediaDeviceInfo,
        fallbackLabel: string,
        index: number,
      ): MediaDeviceOption => ({
        deviceId: device.deviceId,
        label: device.label || `${fallbackLabel} ${index + 1}`,
      });

      setCameras(
        devices
          .filter((device) => device.kind === "videoinput")
          .map((device, index) => toOption(device, "Camera", index)),
      );
      setMicrophones(
        devices
          .filter((device) => device.kind === "audioinput")
          .map((device, index) => toOption(device, "Microphone", index)),
      );
      setSpeakers(
        devices
          .filter((device) => device.kind === "audiooutput")
          .map((device, index) => toOption(device, "Speaker", index)),
      );
    } catch(err) {
      console.error(err)
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const readPermissions = async () => {
      if (typeof navigator === "undefined" || !navigator.permissions?.query) {
        return;
      }

      try {
        const cameraStatus = await navigator.permissions.query({
          name: "camera" as PermissionName,
        });
        if (!cancelled) {
          setCameraPermission(cameraStatus.state as PermissionState);
          cameraStatus.onchange = () =>
            setCameraPermission(cameraStatus.state as PermissionState);
        }
      } catch(err) {
         console.error(err);
      }

      try {
        const micStatus = await navigator.permissions.query({
          name: "microphone" as PermissionName,
        });
        if (!cancelled) {
          setMicrophonePermission(micStatus.state as PermissionState);
          micStatus.onchange = () =>
            setMicrophonePermission(micStatus.state as PermissionState);
        }
      } catch(err) {
       console.error(err);
      }
    };

    readPermissions();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    refresh();
    const mediaDevices = typeof navigator !== "undefined" ? navigator.mediaDevices : undefined;
    mediaDevices?.addEventListener?.("devicechange", refresh);
    return () => mediaDevices?.removeEventListener?.("devicechange", refresh);
  }, [refresh]);

  useEffect(() => {
    if (hasLocalStream) refresh();
  }, [hasLocalStream, refresh]);

  return {
    cameras,
    microphones,
    speakers,
    cameraPermission,
    microphonePermission,
    supportsSpeakerSelection,
    refresh,
  };
}