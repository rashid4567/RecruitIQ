import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import {
  Mail,
  Send,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TestEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  templateName: string;
  testEmail: string;
  setTestEmail: (email: string) => void;
  onSendTest: () => Promise<void>;
  isSending: boolean;
  error: string;
  setError: (error: string) => void;
}

export function TestEmailModal({
  isOpen,
  onClose,
  templateName,
  testEmail,
  setTestEmail,
  onSendTest,
  isSending,
  error,
  setError,
}: TestEmailModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-3xl border-0 shadow-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-white"
          >
            {/* Dark Header */}
            <div className="relative bg-gradient-to-br from-indigo-600 to-slate-900 px-8 pt-10 pb-8 overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/10 -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-28 h-28 rounded-full bg-white/10 translate-y-1/2 -translate-x-1/2" />

              <div className="relative flex flex-col items-center text-center">
                <div className="h-14 w-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mb-4">
                  <Mail className="h-7 w-7 text-white" strokeWidth={1.8} />
                </div>
                <h2 className="text-2xl font-bold text-white">Send Test Email</h2>
                <p className="text-indigo-100 mt-2 text-base">
                  {templateName}
                </p>
              </div>
            </div>

            {/* Body */}
            <div className="px-8 py-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                  Recipient Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    type="email"
                    placeholder="your-email@example.com"
                    value={testEmail}
                    onChange={(e) => {
                      setTestEmail(e.target.value);
                      if (error) setError("");
                    }}
                    disabled={isSending}
                    className={cn(
                      "pl-10 h-12 rounded-2xl border-2 text-base",
                      error
                        ? "border-red-300 focus-visible:border-red-400"
                        : "border-slate-200 focus-visible:border-indigo-600"
                    )}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && testEmail && !isSending) {
                        onSendTest();
                      }
                    }}
                  />
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-100 rounded-2xl">
                        <AlertCircle className="h-4 w-4 text-red-500" />
                        <p className="text-sm text-red-600">{error}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm text-slate-600">
                A test email will be sent using the current template. This helps you preview how it looks before sending to real users.
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={onClose}
                  disabled={isSending}
                  className="flex-1 h-12 rounded-2xl border-2 border-slate-200 hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </Button>
                <Button
                  onClick={onSendTest}
                  disabled={isSending || !testEmail.trim()}
                  className="flex-1 h-12 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg shadow-indigo-600/30 disabled:bg-slate-200"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Sending Test...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Test Email
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}