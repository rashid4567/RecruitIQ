import { useState } from "react";
import { updatePasswordUC } from "@/module/auth/presentation/di/auth";
import { validateUpdatePassword } from "../validators/password.validator";

export function useCandidateSecurity() {
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const updatePassword = async () => {
    setPasswordError("");
    setPasswordSuccess("");

    const result = validateUpdatePassword(passwordData);

    if (!result.success) {
      const message = result.error.issues?.[0]?.message || "Invalid input";

      setPasswordError(message);
      return false;
    }

    try {
      setIsUpdating(true);

      await updatePasswordUC.execute({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      setPasswordSuccess("Password updated successfully");

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      return true;
    } catch (err: any) {
      setPasswordError(
        err?.message || "Failed to update password. Please try again.",
      );
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    passwordData,
    setPasswordData,
    updatePassword,
    showPassword,
    setShowPassword,
    passwordError,
    passwordSuccess,
    isUpdating,
  };
}
