import { useState } from "react";
import { toast } from "react-hot-toast";
import { updatePasswordUC } from "@/module/auth/presentation/di/auth";
import { validateUpdatePassword } from "../validators/password.validator";
export function useCandidateSecurity() {
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isUpdating, setIsUpdating] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const updatePassword = async () => {
    const result = validateUpdatePassword(passwordData);
    if (!result.success) {
      toast.error(result.error.issues?.[0]?.message || "Invalid input");
      return false;
    }
    try {
      setIsUpdating(true);
      setPasswordSuccess(null);
      await updatePasswordUC.execute({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      toast.success("Password updated successfully! 🎉");
      setPasswordSuccess("Password updated successfully");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      return true;
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to update password. Please try again.";
      toast.error(message);
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  const clearSuccess = () => setPasswordSuccess(null);

  return {
    passwordData,
    setPasswordData,
    updatePassword,
    isUpdating,
    passwordSuccess,
    clearSuccess,
  };
}
