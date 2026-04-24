import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "use-debounce";
import { toast } from "sonner";
import type { Recruiter } from "../../../domain/entities/recruiter.entity";
import {
  getRecruiterListUC,
  verifyRecruiterUC,
  rejectRecruiterUC,
} from "../../di/recruiter.di";
import { blockUserUC,  unblockUserUC } from "../../di/user.di"
type FilterTab = "all" | "pending" | "verified" | "blocked";

export function useRecruiters() {
  const [recruiters, setRecruiters] = useState<Recruiter[]>([]);
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

  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});

  const fetchRecruiters = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const query: any = { page: pagination.page, limit: pagination.limit };
      if (debouncedSearch) query.search = debouncedSearch;
      if (tab !== "all") {
        if (tab === "pending") query.verificationStatus = "pending";
        if (tab === "verified") query.verificationStatus = "verified";
        if (tab === "blocked") query.isActive = false;
      }

      const res = await getRecruiterListUC.execute(query);

      setRecruiters(res.recruiters ?? []);
      setPagination((p) => ({
        ...p,
        total: res.total ?? 0,
        totalPages: res.total ? Math.ceil(res.total / p.limit) : 1,
      }));
    } catch (err: any) {
      const msg = err?.message || "Failed to load recruiters";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, debouncedSearch, tab]);

  const performAction = async (recruiter: Recruiter, action: string) => {
    const id = recruiter.id;
    setActionLoading((prev) => ({ ...prev, [id]: true }));

    try {
      switch (action) {
        case "verify":
          await verifyRecruiterUC.execute(id);
          toast.success(`${recruiter.companyName} has been verified`);
          break;
        case "reject":
          await rejectRecruiterUC.execute(id);
          toast.success(`${recruiter.companyName} has been rejected`);
          break;
        case "block":
          await blockUserUC.execute(id);
          toast.success(`${recruiter.companyName} has been blocked`);
          break;
        case "unblock":
          await unblockUserUC.execute(id);
          toast.success(`${recruiter.companyName} has been unblocked`);
          break;
      }
      await fetchRecruiters();
    } catch (err: any) {
      toast.error(err?.message || "Action failed");
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  useEffect(() => {
    fetchRecruiters();
  }, [fetchRecruiters]);

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
    actionLoading,
    performAction,
    fetchRecruiters,
  };
}