import { useState, useEffect, useCallback } from "react";
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

  const fetchData = useCallback(async () => {
    if (data === null) {
      setIsLoading(true);
    } else {
      setIsFetching(true);
    }

    setIsError(false);

    try {
      const result = await getSubscribers({
        page,
        limit,
        search,
        status,
      });
      setData(result);
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