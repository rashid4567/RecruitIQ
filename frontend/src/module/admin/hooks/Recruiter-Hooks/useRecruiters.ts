import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "use-debounce";
import { toast } from "sonner";
import type {
  RecruiterListItem,
  RecruiterQueryParams,
} from "@/module/admin/types/recruiter.types";
import {
  getRecruiters,
  rejectRecruiter,
  verifyRecruiter,
} from "@/module/admin/api/adminRecruiter.api";
import { blockUser, unblockUser } from "@/module/admin/api/adminUser.api";

type FilterTab = "all" | "pending" | "verified" | "blocked";

export function useRecruiters() {
  const [recruiters, setRecruiters] = useState<RecruiterListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const [tab, setTab] = useState<FilterTab>("all");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>(
    {},
  );

  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      page: 1,
    }));
  }, [debouncedSearch, tab]);

  const fetchRecruiters = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params: RecruiterQueryParams = {
        page: pagination.page,
        limit: pagination.limit,
      };

      if (debouncedSearch) {
        params.search = debouncedSearch;
      }

      switch (tab) {
        case "pending":
          params.verificationStatus = "pending";
          break;

        case "verified":
          params.verificationStatus = "verified";
          break;

        case "blocked":
          params.isActive = false;
          break;
      }

      const response = await getRecruiters(params);

      setRecruiters(response.recruiters);

      setPagination((prev) => ({
        ...prev,
        total: response.pagination.total,
        totalPages: Math.ceil(response.pagination.total / prev.limit),
      }));
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load recruiters";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, debouncedSearch, tab]);

  useEffect(() => {
    fetchRecruiters();
  }, [fetchRecruiters]);

  const setPage = useCallback((page: number) => {
    setPagination((prev) => ({
      ...prev,
      page,
    }));
  }, []);

  const performAction = async (
    recruiter: RecruiterListItem,
    action: "verify" | "reject" | "block" | "unblock",
  ) => {
    const id = recruiter.id;

    try {
      setActionLoading((prev) => ({
        ...prev,
        [id]: true,
      }));

      switch (action) {
        case "verify":
          await verifyRecruiter(id);
          toast.success(`${recruiter.companyName} has been verified`);
          break;
        case "reject":
          await rejectRecruiter(id);
          toast.success(`${recruiter.companyName} has been rejected`);
          break;
        case "block":
          await blockUser(id);
          toast.success(`${recruiter.companyName} has been blocked`);
          break;
        case "unblock":
          await unblockUser(id);
          toast.success(`${recruiter.companyName} has been unblocked`);
          break;
      }

      await fetchRecruiters();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Action failed");
    } finally {
      setActionLoading((prev) => ({
        ...prev,
        [id]: false,
      }));
    }
  };

  return {
    recruiters,
    loading,
    error,
    search,
    setSearch,
    tab,
    setTab,
    pagination,
    setPagination,
    setPage,
    actionLoading,
    performAction,
    fetchRecruiters,
  };
}
