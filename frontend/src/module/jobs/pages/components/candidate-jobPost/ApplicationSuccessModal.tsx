import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface ApplicationSuccessModalProps {
  applicationId: string;
  jobTitle: string;
  companyName?: string;
  status: string;
  appliedAt: Date;
  onClose: () => void;
}

const ApplicationSuccessModal: React.FC<ApplicationSuccessModalProps> = ({
  applicationId,
  jobTitle,
  companyName,
  status,
  appliedAt,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(applicationId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  const handleViewApplications = () => {
    onClose();
    navigate("/candidate/applications");
  };

  const handleBrowseJobs = () => {
    onClose();
    navigate("/candidate/jobs");
  };

  const formattedDate = new Date(appliedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const steps = [
    {
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="11" width="18" height="10" rx="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          <circle cx="12" cy="16" r="1" />
        </svg>
      ),
      iconBg: "#ede9fe",
      iconBorder: "#c4b5fd",
      iconColor: "#7c3aed",
      title: "AI resume screening",
      time: "Within 24 hrs",
      description:
        "Your resume is evaluated automatically against the job requirements.",
    },
    {
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
          <path d="M11 8v3l2 2" />
        </svg>
      ),
      iconBg: "#dbeafe",
      iconBorder: "#93c5fd",
      iconColor: "#1d4ed8",
      title: "Recruiter review",
      time: "2–5 days",
      description: "Shortlisted candidates are reviewed by the hiring team.",
    },
    {
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
          <path d="m9 16 2 2 4-4" />
        </svg>
      ),
      iconBg: "#d1fae5",
      iconBorder: "#6ee7b7",
      iconColor: "#047857",
      title: "Interview process",
      time: "As scheduled",
      description:
        "You'll receive interview invites and status updates directly.",
    },
  ];

  return (
    <>
      <style>{`
        @keyframes _slideUp {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes _ringPop {
          0%   { transform: scale(0); opacity: 0; }
          60%  { transform: scale(1.12); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes _fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes _pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes _confetti {
          0%   { transform: translateY(-8px) rotate(0deg); opacity: 0; }
          20%  { opacity: 1; }
          100% { transform: translateY(60px) rotate(360deg); opacity: 0; }
        }
        .asm-modal      { animation: _slideUp 0.3s cubic-bezier(0.22,1,0.36,1) both; }
        .asm-ring       { animation: _ringPop 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.1s both; }
        .asm-check      { animation: _fadeUp 0.4s ease 0.3s both; }
        .asm-f1         { animation: _fadeUp 0.35s ease 0.3s both; }
        .asm-f2         { animation: _fadeUp 0.35s ease 0.42s both; }
        .asm-f3         { animation: _fadeUp 0.35s ease 0.54s both; }
        .asm-f4         { animation: _fadeUp 0.35s ease 0.66s both; }
        .asm-pulse      { animation: _pulse 2s infinite; }
        .asm-confetti   { animation: _confetti 1.2s ease-out both; }

        .asm-copy-btn {
          cursor: pointer;
          border: 0.5px solid #e2e8f0;
          background: #f8fafc;
          border-radius: 6px;
          padding: 3px 8px;
          font-size: 12px;
          color: #64748b;
          transition: all 0.15s;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          line-height: 1.6;
        }
        .asm-copy-btn:hover { border-color: #cbd5e1; color: #1e293b; background: #f1f5f9; }

        .asm-primary {
          background: #2563eb;
          color: #fff;
          border: none;
          border-radius: 10px;
          padding: 11px 0;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          flex: 1;
          transition: opacity 0.15s, transform 0.1s;
        }
        .asm-primary:hover { opacity: 0.92; }
        .asm-primary:active { transform: scale(0.98); }

        .asm-ghost {
          background: #f8fafc;
          color: #334155;
          border: 0.5px solid #e2e8f0;
          border-radius: 10px;
          padding: 11px 0;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          flex: 1;
          transition: background 0.15s, transform 0.1s;
        }
        .asm-ghost:hover { background: #f1f5f9; }
        .asm-ghost:active { transform: scale(0.98); }
      `}</style>

      <div
        onClick={(e) => e.target === e.currentTarget && onClose()}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem",
          background: "rgba(15,23,42,0.6)",
          backdropFilter: "blur(6px)",
        }}
      >
        <div
          className="asm-modal"
          onClick={(e) => e.stopPropagation()}
          style={{
            background: "#fff",
            borderRadius: 20,
            border: "0.5px solid #e2e8f0",
            width: "100%",
            maxWidth: 420,
            maxHeight: "min(94vh, 820px)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "16px 20px 0",
            }}
          >
            <span
              style={{
                fontSize: 11,
                color: "#94a3b8",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Application confirmed
            </span>
            <button
              onClick={onClose}
              aria-label="Close"
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                border: "0.5px solid #e2e8f0",
                background: "#f8fafc",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#64748b",
                transition: "background 0.15s",
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div style={{ flex: 1, overflowY: "auto" }}>
            <div
              className="asm-f1"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "24px 20px 20px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: 72,
                  height: 72,
                  marginBottom: 16,
                }}
              >
                {[
                  { top: 0, left: 14, bg: "#2563eb", delay: "0.4s", size: 6 },
                  { top: 2, right: 10, bg: "#7c3aed", delay: "0.55s", size: 6 },
                  { top: 6, left: 4, bg: "#0891b2", delay: "0.65s", size: 4 },
                  { top: 0, right: 2, bg: "#059669", delay: "0.5s", size: 4 },
                ].map((dot, i) => (
                  <div
                    key={i}
                    className="asm-confetti"
                    style={{
                      position: "absolute",
                      width: dot.size,
                      height: dot.size,
                      borderRadius: "50%",
                      background: dot.bg,
                      animationDelay: dot.delay,
                      top: dot.top,
                      ...(dot.left !== undefined ? { left: dot.left } : {}),
                      ...("right" in dot ? { right: (dot as any).right } : {}),
                    }}
                  />
                ))}

                <div
                  className="asm-ring"
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "50%",
                    border: "2px solid #10b981",
                    opacity: 0.35,
                  }}
                />

                <div
                  className="asm-ring"
                  style={{
                    position: "absolute",
                    inset: 8,
                    borderRadius: "50%",
                    background: "#d1fae5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg
                    className="asm-check"
                    width="26"
                    height="26"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#059669"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </div>
              </div>

              <h2
                style={{
                  margin: "0 0 6px",
                  fontSize: 20,
                  fontWeight: 600,
                  color: "#0f172a",
                  letterSpacing: "-0.02em",
                }}
              >
                Application submitted!
              </h2>
              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  color: "#64748b",
                  lineHeight: 1.6,
                  maxWidth: 280,
                }}
              >
                You're all set. A confirmation email is on its way to your
                inbox.
              </p>
            </div>

            <div
              className="asm-f2"
              style={{
                margin: "0 20px 16px",
                borderRadius: 12,
                border: "0.5px solid #e2e8f0",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "10px 14px",
                  background: "#f8fafc",
                  borderBottom: "0.5px solid #e2e8f0",
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                    color: "#94a3b8",
                  }}
                >
                  Application details
                </span>
              </div>

              <div style={{ padding: "0 14px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 0",
                    borderBottom: "0.5px solid #f1f5f9",
                  }}
                >
                  <span
                    style={{
                      fontSize: 12,
                      color: "#64748b",
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
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
                    >
                      <line x1="4" y1="6" x2="20" y2="6" />
                      <line x1="4" y1="12" x2="14" y2="12" />
                      <line x1="4" y1="18" x2="10" y2="18" />
                    </svg>
                    App ID
                  </span>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <span
                      style={{
                        fontFamily: "monospace",
                        fontSize: 12,
                        color: "#1e293b",
                      }}
                    >
                      {applicationId}
                    </span>
                    <button
                      className="asm-copy-btn"
                      onClick={handleCopy}
                      aria-label="Copy application ID"
                    >
                      {copied ? (
                        <>
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#059669"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                          >
                            <path d="M20 6 9 17l-5-5" />
                          </svg>
                          Copied
                        </>
                      ) : (
                        <>
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          >
                            <rect x="9" y="9" width="13" height="13" rx="2" />
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                          </svg>
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    padding: "10px 0",
                    borderBottom: "0.5px solid #f1f5f9",
                    gap: 12,
                  }}
                >
                  <span
                    style={{
                      fontSize: 12,
                      color: "#64748b",
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
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
                    >
                      <rect x="2" y="7" width="20" height="14" rx="2" />
                      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                    </svg>
                    Position
                  </span>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 500,
                      color: "#1e293b",
                      textAlign: "right",
                      lineHeight: 1.4,
                    }}
                  >
                    {jobTitle}
                  </span>
                </div>

                {companyName && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px 0",
                      borderBottom: "0.5px solid #f1f5f9",
                      gap: 12,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 12,
                        color: "#64748b",
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
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
                      >
                        <path d="M3 21h18M3 7v14M21 7v14M6 21V3h12v4" />
                        <path d="M9 21v-4h6v4" />
                      </svg>
                      Company
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 500,
                        color: "#1e293b",
                      }}
                    >
                      {companyName}
                    </span>
                  </div>
                )}

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 0",
                    borderBottom: "0.5px solid #f1f5f9",
                  }}
                >
                  <span style={{ fontSize: 12, color: "#64748b" }}>Status</span>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                      padding: "3px 10px",
                      background: "#d1fae5",
                      borderRadius: 999,
                      fontSize: 11,
                      fontWeight: 600,
                      color: "#065f46",
                      letterSpacing: "0.04em",
                    }}
                  >
                    <span
                      className="asm-pulse"
                      style={{
                        width: 5,
                        height: 5,
                        borderRadius: "50%",
                        background: "#059669",
                        display: "inline-block",
                      }}
                    />
                    {status}
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 0",
                  }}
                >
                  <span
                    style={{
                      fontSize: 12,
                      color: "#64748b",
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
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
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 6v6l4 2" />
                    </svg>
                    Applied on
                  </span>
                  <span style={{ fontSize: 12, color: "#1e293b" }}>
                    {formattedDate}
                  </span>
                </div>
              </div>
            </div>

            <div className="asm-f3" style={{ margin: "0 20px 24px" }}>
              <div
                style={{
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                  color: "#94a3b8",
                  marginBottom: 14,
                }}
              >
                What happens next
              </div>

              <div style={{ display: "flex", gap: 14 }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: 36,
                    flexShrink: 0,
                  }}
                >
                  {steps.map((step, idx) => (
                    <React.Fragment key={idx}>
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 10,
                          background: step.iconBg,
                          border: `0.5px solid ${step.iconBorder}`,
                          color: step.iconColor,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        {step.icon}
                      </div>
                      {idx < steps.length - 1 && (
                        <div
                          style={{
                            width: 1,
                            background: "#e2e8f0",
                            flex: 1,
                            margin: "4px auto",
                            minHeight: 20,
                          }}
                        />
                      )}
                    </React.Fragment>
                  ))}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  {steps.map((step, idx) => (
                    <div
                      key={idx}
                      style={{ paddingBottom: idx < steps.length - 1 ? 20 : 0 }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "baseline",
                          justifyContent: "space-between",
                          gap: 8,
                          marginBottom: 2,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: 500,
                            color: "#0f172a",
                          }}
                        >
                          {step.title}
                        </span>
                        <span
                          style={{
                            fontSize: 11,
                            color: "#94a3b8",
                            flexShrink: 0,
                          }}
                        >
                          {step.time}
                        </span>
                      </div>
                      <p
                        style={{
                          margin: 0,
                          fontSize: 12,
                          color: "#64748b",
                          lineHeight: 1.55,
                        }}
                      >
                        {step.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div
            className="asm-f4"
            style={{
              borderTop: "0.5px solid #e2e8f0",
              padding: "14px 20px",
              display: "flex",
              gap: 10,
            }}
          >
            <button className="asm-primary" onClick={handleViewApplications}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M3 10h18M10 4v6M7 14h.01M11 14h.01M15 14h.01M7 18h.01M11 18h.01M15 18h.01" />
              </svg>
              My applications
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
            <button className="asm-ghost" onClick={handleBrowseJobs}>
              Browse jobs
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ApplicationSuccessModal;
