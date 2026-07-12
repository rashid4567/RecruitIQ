import { useEffect, useState } from "react";
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

  const fetchApplications = async () => {
    try {
      setLoading(true);

      console.log("Calling API...");

      const result = await getRecruiterApplications(query);

      console.log("API Result:", result);

      setApplications(result.applications);
      setPagination(result.pagination);
      setError(null);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error ? err.message : "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("useEffect running");
    fetchApplications();
  }, [
    query.page,
    query.limit,
    query.search,
    query.status,
    query.recommendation,
    query.sortBy,
    query.sortOrder,
  ]);

  return {
    applications,
    pagination,
    loading,
    error,
    refetch: fetchApplications,
  };
}