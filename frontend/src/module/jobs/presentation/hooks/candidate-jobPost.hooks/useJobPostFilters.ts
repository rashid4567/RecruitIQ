import type { JobPostFilters } from "@/module/jobs/domain/dto/JobPostDTO";
import { useState } from "react";


export const useJobPostFilters = () => {
  const [searchInput, setSearchInput] = useState<string>("");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const handleSearch = (updateFilters: (filters: Partial<JobPostFilters>) => void) => {
    updateFilters({ search: searchInput.trim() || undefined });
  };

  const handleClearSearch = (updateFilters: (filters: Partial<JobPostFilters>) => void) => {
    setSearchInput("");
    updateFilters({ search: undefined });
  };

  const handleMobileFilterClose = () => setMobileFilterOpen(false);
  const handleMobileFilterOpen = () => setMobileFilterOpen(true);

  return {
    searchInput,
    setSearchInput,
    mobileFilterOpen,
    handleSearch,
    handleClearSearch,
    handleMobileFilterClose,
    handleMobileFilterOpen,
  };
};