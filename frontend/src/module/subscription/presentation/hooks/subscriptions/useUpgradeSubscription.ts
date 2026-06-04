// import { useState } from "react";
// import { toast } from "sonner";
// import { upgradeSubscriptionUC } from "../../di/subscription.di";

// export const useUpgradeSubscription = () => {
//   const [isLoading, setIsLoading] = useState(false);

//   const upgradeSubscription = async (planId: string): Promise<boolean> => {
//     try {
//       setIsLoading(true);

//       await upgradeSubscriptionUC.execute(planId);

//       toast.success("Subscription upgraded successfully!");

//       return true;
//     } catch (error) {
//       console.error("Upgrade subscription failed:", error);

//       toast.error(
//         error instanceof Error
//           ? error.message
//           : "Failed to upgrade subscription",
//       );

//       return false;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return {
//     isLoading,
//     upgradeSubscription,
//   };
// };
