import { useCallback, useEffect, useState } from "react";

import type {
  GetRecruiterApplicationsQuery,
  Pagination,
} from "../../types/getRecruiterApplications.dto";
import type { RecruiterApplication } from "../../types/application.types";

import { getRecruiterApplications } from "../../api/recruiter-application.api";

export function useAllRecruiterApplications(
  query: GetRecruiterApplicationsQuery,
) {
  const [applications, setApplications] = useState<RecruiterApplication[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await getRecruiterApplications(query);

      setApplications(result.applications);
      setPagination(result.pagination);
    } catch (err: unknown) {
      console.error(err);

      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [
    query.page,
    query.limit,
    query.search,
    query.status,
    query.recommendation,
    query.sortBy,
    query.sortOrder,
  ]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  return {
    applications,
    pagination,
    loading,
    error,
    refetch: fetchApplications,
  };
}
