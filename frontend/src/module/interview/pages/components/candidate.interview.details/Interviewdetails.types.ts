import type { ReactNode } from "react";

export interface MyInterviewDetailsProps {
  id?: string;
  onBack?: () => void;
}

export interface StatusConfig {
  label: string;
  pill: string;
  dot: string;
  ring: string;
  icon: ReactNode;
}

export interface TimelineItem {
  label: string;
  time?: string;
  done: boolean;
  muted?: boolean;
}