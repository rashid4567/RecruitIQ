import { useState } from "react";
import { deleteJob } from "@/module/jobs/api/job.api";

export const useDeleteJobPost = () => {
  const [loading, setLoading] = useState(false);

  const deleteJobPost = async (
    id: string,
  ): Promise<boolean> => {
    try {
      setLoading(true);

      await deleteJob("recruiter", id);

      return true;
    } catch (err) {
      console.error("Failed to delete job:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    deleteJobPost,
    loading,
  };
};