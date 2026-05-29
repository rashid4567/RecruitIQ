import { useState, useCallback, useRef } from "react";
import { toast } from "sonner";
import {
  createSubscriptionPaymentUC,
  verifyPaymentUC,
} from "../../di/subscription.di";

interface RazorpayPaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayPaymentFailedResponse {
  error: {
    code: string;
    description: string;
    source: string;
    step: string;
    reason: string;
    metadata: {
      payment_id: string;
      order_id: string;
    };
  };
}

interface RazorpayOptions {
  key: string;
  order_id: string;
  currency: string;
  name: string;
  description: string;

  theme?: {
    color: string;
  };

  modal?: {
    ondismiss?: () => void;
  };

  handler: (response: RazorpayPaymentResponse) => void;
}

interface RazorpayInstance {
  open(): void;
  close(): void;

  on<T = unknown>(event: string, callback: (response: T) => void): void;
}

type RazorpayConstructor = new (options: RazorpayOptions) => RazorpayInstance;

export type PaymentStatus =
  | "idle"
  | "creating"
  | "processing"
  | "verifying"
  | "success"
  | "error";

interface UseRazorpayOptions {
  onSuccess?: (subscriptionId: string) => void;
  onError?: (error: string) => void;
  onDismiss?: () => void;
}

interface UseRazorpayReturn {
  status: PaymentStatus;
  error: string | null;
  isLoading: boolean;
  initiatePayment: (planId: string) => Promise<void>;
  reset: () => void;
}

interface AuthSnapshot {
  authToken: string | null;
  userId: string | null;
  userRole: string | null;
}

function snapshotAuth(): AuthSnapshot {
  return {
    authToken: localStorage.getItem("authToken"),
    userId: localStorage.getItem("userId"),
    userRole: localStorage.getItem("userRole"),
  };
}

function restoreAuthIfWiped(snapshot: AuthSnapshot): void {
  const currentToken = localStorage.getItem("authToken");
  if (snapshot.authToken && !currentToken) {
    localStorage.setItem("authToken", snapshot.authToken);
    if (snapshot.userId) {
      localStorage.setItem("userId", snapshot.userId);
    }
    if (snapshot.userRole) {
      localStorage.setItem("userRole", snapshot.userRole);
    }
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }
    if (document.getElementById("razorpay-script")) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function useRazorpay({
  onSuccess,
  onError,
  onDismiss,
}: UseRazorpayOptions = {}): UseRazorpayReturn {
  const [status, setStatus] = useState<PaymentStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const isInProgress = useRef<boolean>(false);
  const reset = useCallback(() => {
    setStatus("idle");
    setError(null);
  }, []);

  const initiatePayment = useCallback(
    async (planId: string) => {
      if (isInProgress.current) {
        toast.warning("Payment already in progress.");
        return;
      }
      isInProgress.current = true;
      setStatus("creating");
      setError(null);
      const authSnapshot = snapshotAuth();
      if (!authSnapshot.authToken) {
        const msg = "You must be logged in.";
        toast.error(msg);
        setError(msg);
        setStatus("error");
        onError?.(msg);
        isInProgress.current = false;
        return;
      }

      const loadingToastId = toast.loading("Setting up payment...");
      try {
        const loaded = await loadRazorpayScript();
        if (!loaded) {
          throw new Error("Failed to load payment gateway.");
        }
        toast.loading("Creating order...", {
          id: loadingToastId,
        });
        const orderData = await createSubscriptionPaymentUC.execute({
          planId,
        });
        console.log("ORDER CREATED:", orderData);
        setStatus("processing");
        toast.loading("Opening payment window...", {
          id: loadingToastId,
        });
        await new Promise<void>((resolve, reject) => {
          const RazorpayClass = (
            window as unknown as {
              Razorpay: RazorpayConstructor;
            }
          ).Razorpay;
          const rzp = new RazorpayClass({
            key: orderData.razorpayKeyId,
            order_id: orderData.orderId,
            currency: orderData.currency,
            name: "RecruitIQ",
            description: orderData.planName,
            theme: {
              color: "#2563EB",
            },
            handler: async (response) => {
              try {
                setStatus("verifying");
                toast.loading("Verifying payment...", {
                  id: loadingToastId,
                });
                restoreAuthIfWiped(authSnapshot);
                const result = await verifyPaymentUC.execute({
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                });

                console.log("VERIFY RESULT:", result);
                if (result.status === "success") {
                  toast.success("Payment successful! 🎉", {
                    id: loadingToastId,
                    duration: 5000,
                  });
                  setStatus("success");
                  onSuccess?.(result.subscriptionId);
                  resolve();
                } else {
                  reject(new Error("Payment verification failed"));
                }
              } catch (err) {
                reject(err);
              }
            },

            modal: {
              ondismiss: () => {
                toast.dismiss(loadingToastId);
                toast.info("Payment cancelled.");
                setStatus("idle");
                onDismiss?.();
                resolve();
              },
            },
          });

          rzp.on<RazorpayPaymentFailedResponse>(
            "payment.failed",
            (response) => {
              reject(
                new Error(response.error?.description ?? "Payment failed."),
              );
            },
          );

          rzp.open();
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : "Payment failed.";
        toast.error(message, {
          id: loadingToastId,
          duration: 6000,
        });
        setError(message);
        setStatus("error");
        onError?.(message);
        console.error("PAYMENT ERROR:", err);
      } finally {
        isInProgress.current = false;
      }
    },
    [onSuccess, onError, onDismiss],
  );

  return {
    status,
    error,
    isLoading:
      status === "creating" ||
      status === "processing" ||
      status === "verifying",
    initiatePayment,
    reset,
  };
}
