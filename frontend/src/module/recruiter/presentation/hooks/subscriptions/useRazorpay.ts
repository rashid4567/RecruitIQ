import { CreateSubscriptionPaymentUseCase } from "@/module/recruiter/Application/use-Cases/subscription/CreateSubscriptionPaymentUseCase";
import { VerifyPaymentUseCase } from "@/module/recruiter/Application/use-Cases/subscription/VerifyPaymentUseCase";
import { ApiPaymentRepository } from "@/module/recruiter/infrastructure/repositories/ApiPayment.repository";
import { useState, useCallback, useRef } from "react";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

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

// ─── Razorpay type extensions ─────────────────────────────────────────────────
// The community @types/razorpay package omits the `on()` method.
// We extend the instance type locally rather than casting to `any` everywhere.

interface RazorpayPaymentFailedResponse {
  error: {
    code: string;
    description: string;
    source: string;
    step: string;
    reason: string;
    metadata: {
      payment_id: string;
      order_id?: string;
    };
  };
}

interface RazorpayHandlerResponse {
  razorpay_payment_id: string;
  razorpay_subscription_id: string;
  razorpay_signature: string;
}

interface RazorpayInstanceExtended {
  open(): void;
  close(): void;
  on(event: "payment.failed", handler: (response: RazorpayPaymentFailedResponse) => void): void;
}

interface RazorpayOptions {
  key: string;
  subscription_id: string;
  name: string;
  description: string;
  theme: { color: string };
  handler: (response: RazorpayHandlerResponse) => void;
  modal: {
    ondismiss: () => void;
  };
}

declare global {
  interface RazorpayInstance {
    on<T = unknown>(
      event: string,
      callback: (response: T) => void
    ): void;
  }
}
// ─── Auth snapshot helpers ────────────────────────────────────────────────────

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
    console.warn(
      "[useRazorpay] authToken was wiped from localStorage (likely by Razorpay SDK). Restoring..."
    );
    localStorage.setItem("authToken", snapshot.authToken);
    if (snapshot.userId) localStorage.setItem("userId", snapshot.userId);
    if (snapshot.userRole) localStorage.setItem("userRole", snapshot.userRole);
    console.info("[useRazorpay] Auth token restored successfully.");
  }
}

// ─── Script loader ────────────────────────────────────────────────────────────

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      console.error("[useRazorpay] window is undefined — cannot load Razorpay script.");
      resolve(false);
      return;
    }

    if (document.getElementById("razorpay-script")) {
      console.info("[useRazorpay] Razorpay script already loaded.");
      resolve(true);
      return;
    }

    console.info("[useRazorpay] Loading Razorpay checkout script...");

    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => {
      console.info("[useRazorpay] Razorpay script loaded successfully.");
      resolve(true);
    };
    script.onerror = () => {
      console.error(
        "[useRazorpay] Failed to load Razorpay script. Check network/CSP settings."
      );
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useRazorpay({
  onSuccess,
  onError,
  onDismiss,
}: UseRazorpayOptions = {}): UseRazorpayReturn {
  const [status, setStatus] = useState<PaymentStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const isInProgress = useRef(false);

  const reset = useCallback(() => {
    setStatus("idle");
    setError(null);
  }, []);

  const initiatePayment = useCallback(
    async (planId: string) => {
      if (isInProgress.current) {
        console.warn("[useRazorpay] Payment already in progress. Ignoring duplicate call.");
        toast.warning("Payment is already in progress. Please wait.");
        return;
      }

      isInProgress.current = true;
      setStatus("creating");
      setError(null);

      // ✅ Snapshot auth BEFORE Razorpay can touch localStorage
      const authSnapshot = snapshotAuth();

      if (!authSnapshot.authToken) {
        const msg = "You must be logged in to subscribe.";
        console.error("[useRazorpay] No authToken found before payment initiation.");
        toast.error(msg);
        setError(msg);
        setStatus("error");
        onError?.(msg);
        isInProgress.current = false;
        return;
      }

      const loadingToastId = toast.loading("Setting up payment...");

      try {
        // Step 1 — Load SDK
        const loaded = await loadRazorpayScript();
        if (!loaded) {
          throw new Error(
            "Payment gateway failed to load. Please check your internet connection and try again."
          );
        }

        // Step 2 — Create subscription on backend
        console.info(`[useRazorpay] Creating subscription for planId: ${planId}`);
        toast.loading("Creating your subscription...", { id: loadingToastId });

        const paymentRepo = new ApiPaymentRepository();
        const createUC = new CreateSubscriptionPaymentUseCase(paymentRepo);
        const verifyUC = new VerifyPaymentUseCase(paymentRepo);

        const orderData = await createUC.execute(planId);

        console.info("[useRazorpay] Subscription created.", {
          razorpaySubscriptionId: orderData.razorpaySubscriptionId,
          planName: orderData.planName,
          billingCycle: orderData.billingCycle,
        });

        setStatus("processing");
        toast.loading("Opening payment window...", { id: loadingToastId });

        // Step 3 — Open Razorpay modal
        await new Promise<void>((resolve, reject) => {
          const rzp = new window.Razorpay({
            key: orderData.razorpayKeyId,
            subscription_id: orderData.razorpaySubscriptionId,
            name: "Your App Name",
            description: `${orderData.planName} — ${orderData.billingCycle}`,
            theme: { color: "#2563EB" },

            handler: async (response: RazorpayHandlerResponse) => {
              console.info("[useRazorpay] Payment captured by Razorpay.", {
                paymentId: response.razorpay_payment_id,
                subscriptionId: response.razorpay_subscription_id,
              });

              setStatus("verifying");
              toast.loading("Verifying your payment...", { id: loadingToastId });

              // ✅ Restore token if Razorpay wiped it during checkout
              restoreAuthIfWiped(authSnapshot);

              try {
                console.info("[useRazorpay] Calling verify payment API...");

                const result = await verifyUC.execute({
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_subscription_id: response.razorpay_subscription_id,
                  razorpay_signature: response.razorpay_signature,
                });

                if (result.success) {
                  console.info("[useRazorpay] Payment verified successfully.", {
                    subscriptionId: result.subscriptionId,
                  });

                  toast.success(
                    "Payment successful! Your subscription is now active. 🎉",
                    { id: loadingToastId, duration: 5000 }
                  );

                  setStatus("success");
                  onSuccess?.(result.subscriptionId);
                  resolve();
                } else {
                  const msg =
                    result.message ??
                    "Payment verification failed. Please contact support.";
                  console.error("[useRazorpay] Verification returned failure.", { result });
                  reject(new Error(msg));
                }
              } catch (err) {
                console.error("[useRazorpay] Exception during payment verification:", err);
                reject(err);
              }
            },

            modal: {
              ondismiss: () => {
                console.info("[useRazorpay] Razorpay modal dismissed by user.");
                toast.dismiss(loadingToastId);
                toast.info("Payment cancelled.");
                setStatus("idle");
                onDismiss?.();
                resolve();
              },
            },
          });

          // ✅ Typed correctly — no more ts(2339)
          rzp.on("payment.failed", (response: RazorpayPaymentFailedResponse) => {
            console.error("[useRazorpay] Razorpay payment.failed event:", {
              code: response.error.code,
              description: response.error.description,
              reason: response.error.reason,
              paymentId: response.error.metadata?.payment_id,
            });
            reject(
              new Error(
                response.error?.description ??
                  "Payment failed at the gateway. Please try again."
              )
            );
          });

          console.info("[useRazorpay] Opening Razorpay modal.");
          rzp.open();
        });
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Something went wrong during payment. Please try again.";

        console.error("[useRazorpay] Payment flow failed:", err);

        toast.error(message, { id: loadingToastId, duration: 6000 });

        setError(message);
        setStatus("error");
        onError?.(message);
      } finally {
        isInProgress.current = false;
      }
    },
    [onSuccess, onError, onDismiss]
  );

  return {
    status,
    error,
    isLoading:
      status === "creating" || status === "processing" || status === "verifying",
    initiatePayment,
    reset,
  };
}