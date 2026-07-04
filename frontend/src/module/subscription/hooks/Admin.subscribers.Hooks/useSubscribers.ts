import { useState, useEffect, useCallback, useRef } from "react";
import { getSubscribers } from "../../api/admin-subscription.api";
import type { PaginatedSubscribers } from "../../types/subscriber.types";

interface UseSubscribersParams {
  page: number;
  limit: number;
  search?: string;
  status?: string;
}

interface UseSubscribersResult {
  data: PaginatedSubscribers | null;
  isLoading: boolean;
  isError: boolean;
  isFetching: boolean;
  refetch: () => void;
}

function normalize(
  raw: unknown,
  fallback: { page: number; limit: number },
): PaginatedSubscribers {
  if (Array.isArray(raw)) {
    return {
      data: raw,
      total: raw.length,
      page: fallback.page,
      limit: fallback.limit,
      totalPages: 1,
    };
  }

  const obj = raw as Partial<PaginatedSubscribers> & { data?: unknown };

  if (obj && Array.isArray(obj.data)) {
    return {
      data: obj.data as PaginatedSubscribers["data"],
      total: obj.total ?? obj.data.length,
      page: obj.page ?? fallback.page,
      limit: obj.limit ?? fallback.limit,
      totalPages: obj.totalPages ?? 1,
    };
  }

  return { data: [], total: 0, page: fallback.page, limit: fallback.limit, totalPages: 1 };
}

export const useSubscribers = ({
  page,
  limit,
  search,
  status,
}: UseSubscribersParams): UseSubscribersResult => {
  const [data, setData] = useState<PaginatedSubscribers | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const hasLoadedOnce = useRef(false);

  const fetchData = useCallback(async () => {
    if (!hasLoadedOnce.current) {
      setIsLoading(true);
    } else {
      setIsFetching(true);
    }

    setIsError(false);

    try {
      const result = await getSubscribers({ page, limit, search, status });
      setData(normalize(result, { page, limit }));
      hasLoadedOnce.current = true;
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
  }, [page, limit, search, status]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, isError, isFetching, refetch: fetchData };
};