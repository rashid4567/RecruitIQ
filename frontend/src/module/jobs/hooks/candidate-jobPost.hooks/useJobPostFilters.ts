import { useState } from "react";
import type { JobPostFilters } from "@/module/jobs/types/JobPostDTO";

export const useJobPostFilters = () => {
  const [searchInput, setSearchInput] = useState("");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const handleSearch = (
    updateFilters: (filters: Partial<JobPostFilters>) => void,
  ) => {
    updateFilters({
      search: searchInput.trim() || undefined,
    });
  };

  const handleClearSearch = (
    updateFilters: (filters: Partial<JobPostFilters>) => void,
  ) => {
    setSearchInput("");

    updateFilters({
      search: undefined,
    });
  };

  const handleMobileFilterOpen = () => {
    setMobileFilterOpen(true);
  };

  const handleMobileFilterClose = () => {
    setMobileFilterOpen(false);
  };

  return {
    searchInput,
    setSearchInput,

    mobileFilterOpen,

    handleSearch,
    handleClearSearch,

    handleMobileFilterOpen,
    handleMobileFilterClose,
  };
};
