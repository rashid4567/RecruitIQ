export type InterviewStatusModalType = "info" | "warning" | "error";

export interface InterviewStatusMessage {
  title: string;
  message: string;
  type: InterviewStatusModalType;
  retryable: boolean;
}

interface ErrorRule {
  match: (msg: string) => boolean;
  content: InterviewStatusMessage;
}

const RULES: ErrorRule[] = [
  {
    match: (m) => /not\s*started/i.test(m),
    content: {
      title: "Interview Not Started",
      message: "The recruiter hasn't started the interview yet. Please wait and try again shortly.",
      type: "warning",
      retryable: true,
    },
  },
  {
    match: (m) => /already\s*ended|has\s*ended/i.test(m),
    content: {
      title: "Interview Ended",
      message: "This interview has already ended.",
      type: "info",
      retryable: false,
    },
  },
  {
    match: (m) => /cancel/i.test(m),
    content: {
      title: "Interview Cancelled",
      message: "This interview was cancelled by the recruiter.",
      type: "info",
      retryable: false,
    },
  },
  {
    match: (m) => /room.*(unavailable|not\s*ready)/i.test(m),
    content: {
      title: "Room Not Ready",
      message: "The interview room is still being prepared. Please try again in a moment.",
      type: "warning",
      retryable: true,
    },
  },
  {
    match: (m) => /not\s*authorized|unauthorized|permission/i.test(m),
    content: {
      title: "Access Denied",
      message: "You don't have permission to join this interview.",
      type: "error",
      retryable: false,
    },
  },
];

const DEFAULT_CONTENT: InterviewStatusMessage = {
  title: "Unable to Join Interview",
  message: "Unable to join the interview at this time. Please try again.",
  type: "warning",
  retryable: true,
};

export function resolveInterviewError(rawMessage: string | null): InterviewStatusMessage {
  if (!rawMessage) return DEFAULT_CONTENT;
  const rule = RULES.find((r) => r.match(rawMessage));
  return rule?.content ?? { ...DEFAULT_CONTENT, message: rawMessage };
}