import { useEffect, useState } from "react";

interface SubscriptionFailedProps {
  errorCode?: string;
  onRetryClick?: () => void;
  onBackClick?: () => void;
  onSupportClick?: () => void;
}

export default function SubscriptionFailed({
  errorCode = "ERR_PAYMENT_DECLINED",
  onRetryClick = () => {},
  onBackClick = () => {},
  onSupportClick = () => {},
}: SubscriptionFailedProps) {
  const [mounted, setMounted] = useState(false);
  const [refId] = useState(
    () => "PYM-" + Math.random().toString(36).substr(2, 8).toUpperCase(),
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  const reasons = [
    "Insufficient funds or credit limit reached",
    "Billing address mismatch with card records",
    "Card expired or temporarily blocked by issuer",
    "Gateway connection timeout during processing",
  ];

  const steps = [
    {
      num: "01",
      title: "Verify your card",
      desc: "Check number, expiry date, and CVV are correct",
    },
    {
      num: "02",
      title: "Check billing address",
      desc: "Must match exactly what's on file at your bank",
    },
    {
      num: "03",
      title: "Try another method",
      desc: "Use an alternate card or contact your bank",
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(145deg, #fdf8f8 0%, #fdf5f5 40%, #fff9f9 100%)",
        fontFamily: "'Georgia', 'Times New Roman', serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
     
      <div
        style={{
          position: "absolute",
          top: "-8%",
          right: "-6%",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(180,40,55,0.13) 0%, transparent 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-5%",
          left: "-8%",
          width: 460,
          height: 460,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(155,30,45,0.09) 0%, transparent 70%)",
          filter: "blur(70px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(180,40,55,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(180,40,55,0.04) 1px,transparent 1px)",
          backgroundSize: "64px 64px",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 10,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "3rem 1.5rem",
        }}
      >
        <div style={{ width: "100%", maxWidth: 720 }}>
        
          <div
            style={{
              textAlign: "center",
              marginBottom: "1.75rem",
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(-14px)",
              transition: "all 0.6s ease",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "5px 18px",
                borderRadius: 100,
                border: "1px solid rgba(180,40,55,0.32)",
                background: "rgba(180,40,55,0.08)",
                fontSize: 10,
                letterSpacing: "0.2em",
                textTransform: "uppercase" as const,
                fontWeight: 700,
                color: "#9B2335",
                fontFamily: "Arial, sans-serif",
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#C83040",
                  boxShadow: "0 0 6px rgba(180,40,55,0.6)",
                  display: "inline-block",
                  animation: "blink 2s infinite",
                }}
              />
              Transaction Declined
            </span>
          </div>

          <div
            style={{
              background: "#ffffff",
              border: "1px solid rgba(180,40,55,0.16)",
              borderRadius: 20,
              overflow: "hidden",
              boxShadow:
                "0 4px 6px rgba(180,40,55,0.04), 0 20px 60px rgba(180,40,55,0.07)",
              opacity: mounted ? 1 : 0,
              transform: mounted
                ? "translateY(0) scale(1)"
                : "translateY(24px) scale(0.98)",
              transition: "all 0.8s cubic-bezier(0.16,1,0.3,1)",
            }}
          >
          
            <div
              style={{
                padding: "2.5rem 2.5rem 2rem",
                background:
                  "linear-gradient(160deg, #fff8f8 0%, #fdf0f0 60%, #fef5f5 100%)",
                borderBottom: "1px solid rgba(180,40,55,0.1)",
                textAlign: "center",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 100,
                  height: 3,
                  borderRadius: "0 0 4px 4px",
                  background:
                    "linear-gradient(90deg, transparent, #B42837, transparent)",
                }}
              />

           
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1.25rem",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    width: 88,
                    height: 88,
                    borderRadius: "50%",
                    border: "1.5px solid rgba(180,40,55,0.2)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    width: 110,
                    height: 110,
                    borderRadius: "50%",
                    border: "1px solid rgba(180,40,55,0.09)",
                  }}
                />
                <div
                  style={{
                    width: 68,
                    height: 68,
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg, #9B2335, #C83040, #D4404F)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow:
                      "0 4px 20px rgba(180,40,55,0.35), 0 2px 8px rgba(0,0,0,0.07)",
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? "scale(1)" : "scale(0)",
                    transition: "all 0.9s cubic-bezier(0.34,1.56,0.64,1) 0.1s",
                  }}
                >
                  <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                    <path
                      d="M7 7L19 19M19 7L7 19"
                      stroke="white"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>

              <h1
                style={{
                  margin: 0,
                  fontSize: "clamp(1.5rem,4vw,2.1rem)",
                  fontWeight: 400,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.2,
                  color: "#8B1A28",
                  marginBottom: "0.5rem",
                }}
              >
                Payment Could Not Be Processed
              </h1>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.9rem",
                  color: "#9a4a52",
                  fontFamily: "Arial, sans-serif",
                  lineHeight: 1.5,
                }}
              >
                This is typically temporary and straightforward to resolve.
              </p>
            </div>

            {/* Body */}
            <div style={{ padding: "1.75rem 2.5rem 2.25rem" }}>
              {/* Error detail */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                  padding: "1rem 1.2rem",
                  background: "rgba(180,40,55,0.05)",
                  border: "1px solid rgba(180,40,55,0.18)",
                  borderRadius: 13,
                  marginBottom: "1.5rem",
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: "rgba(180,40,55,0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#B42837"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: "Arial,sans-serif",
                      fontSize: 12,
                      color: "#8B1A28",
                      fontWeight: 700,
                      marginBottom: 4,
                    }}
                  >
                    What went wrong?
                  </div>
                  <div
                    style={{
                      fontFamily: "Arial,sans-serif",
                      fontSize: 11,
                      color: "#9a5058",
                      lineHeight: 1.6,
                      marginBottom: 6,
                    }}
                  >
                    Your bank or payment provider declined the authorization.
                    This is often due to security flags or account limits — not
                    an issue on our end.
                  </div>
                  <div
                    style={{
                      fontFamily: "monospace",
                      fontSize: 10,
                      color: "#B42837",
                      fontWeight: 600,
                    }}
                  >
                    Error: {errorCode} · Ref: {refId}
                  </div>
                </div>
              </div>

              {/* Reasons */}
              <p
                style={{
                  margin: "0 0 0.7rem",
                  fontFamily: "Arial,sans-serif",
                  fontSize: 10,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase" as const,
                  fontWeight: 700,
                  color: "#B42837",
                }}
              >
                Common causes
              </p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column" as const,
                  gap: 5,
                  marginBottom: "1.5rem",
                }}
              >
                {reasons.map((r, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "0.55rem 0.9rem",
                      borderRadius: 8,
                      border: "1px solid rgba(180,40,55,0.1)",
                      background: "rgba(180,40,55,0.03)",
                      cursor: "default",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLDivElement).style.borderColor =
                        "rgba(180,40,55,0.28)";
                      (e.currentTarget as HTMLDivElement).style.background =
                        "rgba(180,40,55,0.07)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.borderColor =
                        "rgba(180,40,55,0.1)";
                      (e.currentTarget as HTMLDivElement).style.background =
                        "rgba(180,40,55,0.03)";
                    }}
                  >
                    <span
                      style={{
                        width: 5,
                        height: 5,
                        borderRadius: "50%",
                        background: "#C83040",
                        flexShrink: 0,
                        display: "inline-block",
                      }}
                    />
                    <span
                      style={{
                        fontFamily: "Arial,sans-serif",
                        fontSize: 12,
                        color: "#6a3035",
                      }}
                    >
                      {r}
                    </span>
                  </div>
                ))}
              </div>

              {/* Steps */}
              <p
                style={{
                  margin: "0 0 0.7rem",
                  fontFamily: "Arial,sans-serif",
                  fontSize: 10,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase" as const,
                  fontWeight: 700,
                  color: "#B42837",
                }}
              >
                Resolution steps
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
                  gap: 8,
                  marginBottom: "1.5rem",
                }}
              >
                {steps.map((s, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "1rem 0.9rem",
                      background: "#fafafa",
                      border: "1px solid rgba(0,0,0,0.07)",
                      borderRadius: 12,
                      cursor: "default",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLDivElement).style.borderColor =
                        "rgba(180,40,55,0.3)";
                      (e.currentTarget as HTMLDivElement).style.background =
                        "rgba(180,40,55,0.04)";
                      (e.currentTarget as HTMLDivElement).style.transform =
                        "translateY(-2px)";
                      (e.currentTarget as HTMLDivElement).style.boxShadow =
                        "0 4px 16px rgba(180,40,55,0.1)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.borderColor =
                        "rgba(0,0,0,0.07)";
                      (e.currentTarget as HTMLDivElement).style.background =
                        "#fafafa";
                      (e.currentTarget as HTMLDivElement).style.transform =
                        "translateY(0)";
                      (e.currentTarget as HTMLDivElement).style.boxShadow =
                        "none";
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "monospace",
                        fontSize: 10,
                        letterSpacing: "0.15em",
                        fontWeight: 700,
                        color: "#B42837",
                        marginBottom: 6,
                      }}
                    >
                      {s.num}
                    </div>
                    <div
                      style={{
                        fontFamily: "Arial,sans-serif",
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#2a1a1c",
                        marginBottom: 4,
                      }}
                    >
                      {s.title}
                    </div>
                    <div
                      style={{
                        fontFamily: "Arial,sans-serif",
                        fontSize: 11,
                        color: "#888",
                        lineHeight: 1.5,
                      }}
                    >
                      {s.desc}
                    </div>
                  </div>
                ))}
              </div>

              {/* Buttons */}
              <div
                style={{ display: "flex", gap: 10, flexWrap: "wrap" as const }}
              >
                <button
                  onClick={onRetryClick}
                  style={{
                    flex: 1,
                    minWidth: 160,
                    padding: "0.875rem 1.25rem",
                    borderRadius: 11,
                    border: "none",
                    cursor: "pointer",
                    background:
                      "linear-gradient(135deg, #9B2335, #C83040, #D4404F)",
                    color: "#fff",
                    fontFamily: "Arial,sans-serif",
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                    boxShadow: "0 4px 16px rgba(180,40,55,0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.transform =
                      "translateY(-2px)";
                    (e.currentTarget as HTMLButtonElement).style.boxShadow =
                      "0 8px 28px rgba(180,40,55,0.4)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.transform =
                      "translateY(0)";
                    (e.currentTarget as HTMLButtonElement).style.boxShadow =
                      "0 4px 16px rgba(180,40,55,0.3)";
                  }}
                >
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                    <path d="M21 3v5h-5" />
                    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                  </svg>
                  Retry Payment
                </button>
                <button
                  onClick={onBackClick}
                  style={{
                    flex: 1,
                    minWidth: 150,
                    padding: "0.875rem 1.25rem",
                    borderRadius: 11,
                    border: "1.5px solid rgba(180,40,55,0.3)",
                    cursor: "pointer",
                    background: "transparent",
                    color: "#9B2335",
                    fontFamily: "Arial,sans-serif",
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "rgba(180,40,55,0.06)";
                    (e.currentTarget as HTMLButtonElement).style.borderColor =
                      "rgba(180,40,55,0.55)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "transparent";
                    (e.currentTarget as HTMLButtonElement).style.borderColor =
                      "rgba(180,40,55,0.3)";
                  }}
                >
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                  </svg>
                  Back to Pricing
                </button>
                <button
                  onClick={onSupportClick}
                  style={{
                    flex: 1,
                    minWidth: 140,
                    padding: "0.875rem 1.25rem",
                    borderRadius: 11,
                    border: "1px solid rgba(0,0,0,0.08)",
                    cursor: "pointer",
                    background: "#f4f4f4",
                    color: "#666",
                    fontFamily: "Arial,sans-serif",
                    fontSize: 13,
                    fontWeight: 600,
                    letterSpacing: "0.04em",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "#ebebeb";
                    (e.currentTarget as HTMLButtonElement).style.color = "#333";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "#f4f4f4";
                    (e.currentTarget as HTMLButtonElement).style.color = "#666";
                  }}
                >
                  Contact Support
                </button>
              </div>
            </div>
          </div>

          <p
            style={{
              textAlign: "center",
              marginTop: "1.5rem",
              fontFamily: "Arial,sans-serif",
              fontSize: 11,
              color: "#aaa",
            }}
          >
            No charge was made to your account · Reference: {refId}
          </p>
        </div>
      </div>

      <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.25} }`}</style>
    </div>
  );
}
