import { useEffect, useState } from "react";
import { getCurrentSubscriptionUC } from "../../di/subscription.di";
import type { RecruiterSubscription } from "@/module/subscription/domain/entity/RecruiterSubscription.entity";

interface CurrentSubscriptionData {
  subscription: RecruiterSubscription | null;
}

export const useCurrentSubscription = () => {
  const [data, setData] = useState<CurrentSubscriptionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const result = await getCurrentSubscriptionUC.execute();
       
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  return { data, isLoading, error };
};