import { useEffect, useState } from "react";
import { getCurrentSubscription } from "../../api/subscription.api";
import type { RecruiterSubscription } from "../../types/RecruiterSubscription.types";

export const useCurrentSubscription = () => {
  const [data, setData] = useState<RecruiterSubscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const result = await getCurrentSubscription();
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);

  return {
    data,
    isLoading,
    error,
  };
};