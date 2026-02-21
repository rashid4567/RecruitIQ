import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Mail,
  Lock,
  Send,
  Loader2,
  RefreshCw,
  Clock,
  Edit,
  CheckCircle,
  AlertCircle,
  Info,
  HelpCircle,
} from "lucide-react";

interface EmailUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendOtp: (email: string) => Promise<void>;
  onVerifyOtp: (otp: string) => Promise<void>;
  onResendOtp: () => Promise<void>;
}

export function EmailUpdateModal({
  isOpen,
  onClose,
  onSendOtp,
  onVerifyOtp,
  onResendOtp,
}: EmailUpdateModalProps) {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [newEmail, setNewEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const handleClose = () => {
    setStep('email');
    setNewEmail('');
    setOtp('');
    setError('');
    setIsSendingOtp(false);
    setIsVerifyingOtp(false);
    setCountdown(0);
    onClose();
  };

  const handleSendOtp = async () => {
    if (!newEmail) return;
    
    setIsSendingOtp(true);
    setError('');
    
    try {
      await onSendOtp(newEmail);
      setStep('otp');
      startCountdown();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send verification code');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) return;
    
    setIsVerifyingOtp(true);
    setError('');
    
    try {
      await onVerifyOtp(otp);
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid verification code');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;
    
    try {
      await onResendOtp();
      startCountdown();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend code');
    }
  };

  const startCountdown = () => {
    setCountdown(60);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-120 p-0 overflow-hidden border-0 shadow-2xl">
        <div className="relative bg-linear-to-br from-indigo-600 via-purple-600 to-blue-700 px-6 pt-8 pb-6">
          <div className="absolute inset-0 bg-grid-white/5"></div>
          <div className="relative">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg">
                <Lock className="h-7 w-7 text-white" />
              </div>
              <div className="flex-1">
                <DialogTitle className="text-2xl font-bold text-white mb-1">
                  {step === 'otp' ? "Verify Your Email" : "Secure Email Update"}
                </DialogTitle>
                <DialogDescription className="text-indigo-100/90 text-sm">
                  {step === 'otp'
                    ? "Enter the 6-digit verification code sent to your email"
                    : "Enter your new email address to receive a verification code"}
                </DialogDescription>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-6">
          {step === 'email' ? (
            <div className="space-y-5">
              <div className="space-y-3">
                <Label htmlFor="modal-email" className="text-sm font-semibold text-gray-700">
                  New Email Address <span className="text-red-500">*</span>
                </Label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-indigo-600" />
                  <Input
                    id="modal-email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    disabled={isSendingOtp}
                    className={`pl-12 h-12 text-base rounded-xl border-2 transition-all duration-200 ${
                      error
                        ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                        : "border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                    }`}
                    autoFocus
                  />
                </div>
                {error && (
                  <div className="flex items-start gap-3 rounded-xl bg-red-50 border border-red-100 p-3.5">
                    <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                    <p className="text-sm font-medium text-red-700">{error}</p>
                  </div>
                )}
              </div>

              <div className="rounded-xl bg-linear-to-br from-indigo-50/80 to-purple-50/80 border border-indigo-100 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100">
                    <Info className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div className="space-y-2 flex-1">
                    <p className="text-sm font-semibold text-gray-800">What happens next?</p>
                    <ul className="space-y-1.5 text-sm text-gray-600">
                      <li className="flex items-start gap-2">
                        <span className="text-indigo-500 mt-0.5">•</span>
                        <span>You'll receive a 6-digit verification code</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-indigo-500 mt-0.5">•</span>
                        <span>The code expires in 15 minutes</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-indigo-500 mt-0.5">•</span>
                        <span>Your email won't change until verified</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold text-gray-700">
                    Verification Code <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 border border-gray-200">
                    <Mail className="h-3.5 w-3.5 text-gray-500" />
                    <span className="text-xs font-medium text-gray-700 truncate max-w-35">
                      {newEmail}
                    </span>
                  </div>
                </div>

                <div className="relative">
                  <input
                    id="otp-input"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    autoComplete="one-time-code"
                    value={otp}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                      setOtp(value);
                    }}
                    onFocus={(e) => e.target.select()}
                    disabled={isVerifyingOtp}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-default"
                    autoFocus
                    maxLength={6}
                  />

                  <div className="flex justify-center gap-3">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <div
                        key={index}
                        onClick={() => document.getElementById("otp-input")?.focus()}
                        className={`h-14 w-12 rounded-xl border-2 flex items-center justify-center cursor-text transition-all duration-200 ${
                          otp[index]
                            ? "bg-linear-to-b from-indigo-50 to-white border-indigo-500 shadow-sm shadow-indigo-500/20"
                            : index === otp.length
                            ? "border-indigo-400 ring-4 ring-indigo-100"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <span className="text-2xl font-bold text-gray-800">{otp[index] || ""}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {error && (
                  <div className="flex items-start gap-3 rounded-xl bg-red-50 border border-red-100 p-3.5">
                    <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                    <p className="text-sm font-medium text-red-700">{error}</p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={countdown > 0 || isSendingOtp}
                    className="flex items-center gap-2 font-medium text-indigo-600 hover:text-indigo-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-all hover:gap-3"
                  >
                    {isSendingOtp ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sending new code...
                      </>
                    ) : countdown > 0 ? (
                      <>
                        <Clock className="h-4 w-4" />
                        Resend in {countdown}s
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4" />
                        Resend verification code
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setStep('email');
                      setOtp('');
                      setError('');
                    }}
                    className="flex items-center gap-2 font-medium text-gray-600 hover:text-gray-800 transition-all hover:gap-3"
                  >
                    <Edit className="h-4 w-4" />
                    Change email
                  </button>
                </div>

                <div className="rounded-xl bg-linear-to-br from-amber-50/80 to-orange-50/80 border border-amber-100 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100">
                      <HelpCircle className="h-5 w-5 text-amber-600" />
                    </div>
                    <div className="space-y-1 flex-1">
                      <p className="text-sm font-semibold text-gray-800">Can't find the code?</p>
                      <p className="text-sm text-gray-600">
                        Check your spam folder or wait a few moments. Codes are valid for 15 minutes.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-3 px-6 py-4 bg-gray-50 border-t border-gray-100">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSendingOtp || isVerifyingOtp}
            className="px-6 h-11 rounded-xl font-semibold border-2 hover:bg-gray-100 transition-all"
          >
            Cancel
          </Button>
          {step === 'email' ? (
            <Button
              onClick={handleSendOtp}
              disabled={isSendingOtp || !newEmail}
              className="gap-2 px-6 h-11 rounded-xl font-semibold bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/30 transition-all hover:shadow-xl hover:shadow-indigo-500/40 disabled:opacity-50"
            >
              {isSendingOtp ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending Code...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Send Verification Code
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={handleVerifyOtp}
              disabled={isVerifyingOtp || otp.length !== 6}
              className="gap-2 px-6 h-11 rounded-xl font-semibold bg-linear-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow-lg shadow-indigo-500/30 transition-all hover:shadow-xl hover:shadow-indigo-500/40 disabled:opacity-50"
            >
              {isVerifyingOtp ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Verify & Update Email
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}