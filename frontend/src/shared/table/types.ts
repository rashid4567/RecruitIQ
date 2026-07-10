import type { ReactNode } from "react";

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface DataTableProps {
  title?: ReactNode;
  description?: ReactNode;
  rightSlot?: ReactNode;
  headerContent?: ReactNode;
  loading: boolean;
  isError?: boolean;
  errorState?: ReactNode;
  isEmpty: boolean;
  skeletonRows: ReactNode;
  emptyState: ReactNode;
  header: ReactNode;
  children: ReactNode;
  pagination?: PaginationInfo;
  onPageChange?: (page: number) => void;
  hideFooterOnSinglePage?: boolean; 
  minWidth?: string;
}