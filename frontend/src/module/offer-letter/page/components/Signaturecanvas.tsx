import { useCallback, useRef, useState } from "react";
import SignaturePad from "react-signature-canvas";
import { Eraser, PenTool, CheckCircle2 } from "lucide-react";

interface SignatureCanvasProps {
  onChange: (file: File | null) => void;
  disabled?: boolean;
}

export default function SignatureCanvas({
  onChange,
  disabled = false,
}: SignatureCanvasProps) {
  const padRef = useRef<SignaturePad>(null);
  const [isEmpty, setIsEmpty] = useState(true);

  const dataUrlToFile = useCallback((dataUrl: string, filename: string) => {
    const [header, base64] = dataUrl.split(",");
    const mimeMatch = header.match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : "image/png";
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new File([bytes], filename, { type: mime });
  }, []);

  const handleEnd = useCallback(() => {
    const pad = padRef.current;
    if (!pad) return;

    if (pad.isEmpty()) {
      setIsEmpty(true);
      onChange(null);
      return;
    }

    try {
      const dataUrl = pad.toDataURL("image/png");
      const file = dataUrlToFile(dataUrl, `signature-${Date.now()}.png`);

      setIsEmpty(false);
      onChange(file);
    } catch (err) {
      console.error("Failed to capture signature", err);
      setIsEmpty(true);
      onChange(null);
    }
  }, [dataUrlToFile, onChange]);

  const handleClear = useCallback(() => {
    padRef.current?.clear();
    setIsEmpty(true);
    onChange(null);
  }, [onChange]);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-[#0F172A] flex items-center gap-1.5">
          <PenTool className="w-3.5 h-3.5 text-[#2563EB]" />
          Sign below
        </p>
        {!isEmpty && (
          <span className="text-xs text-[#16A34A] flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Captured
          </span>
        )}
      </div>

      <div
        className={[
          "relative rounded-lg border bg-[#F8FAFC] overflow-hidden touch-none",
          disabled ? "opacity-60 pointer-events-none" : "",
          isEmpty ? "border-[#E2E8F0]" : "border-[#2563EB]",
        ].join(" ")}
      >
        <SignaturePad
          ref={padRef}
          onEnd={handleEnd}
          canvasProps={{
            className: "w-full h-40 cursor-crosshair",
          }}
          penColor="#0F172A"
        />
        {isEmpty && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="text-xs text-[#94A3B8]">
              Draw your signature here
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-2">
        <button
          type="button"
          onClick={handleClear}
          disabled={disabled || isEmpty}
          className="flex items-center gap-1.5 text-xs text-[#64748B] hover:text-[#EF4444] font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Eraser className="w-3.5 h-3.5" />
          Clear
        </button>
        <span className="text-[11px] text-[#94A3B8]">
          Use your mouse, trackpad, or finger
        </span>
      </div>
    </div>
  );
}
