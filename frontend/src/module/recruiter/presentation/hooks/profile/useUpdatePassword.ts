import { updatePasswordUC } from "@/module/auth/presentation/di/auth";
import { useState } from "react";
import { toast } from "sonner";

export function useUpdatePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  const resetForm = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const updatePassword = async () => {
    try {
      setLoading(true);
      setPasswordSuccess(null);

      await updatePasswordUC.execute({
        currentPassword,
        newPassword,
      });

      toast.success("Password updated successfully! 🎉");
      setPasswordSuccess("Password updated successfully");

      resetForm();
      return true;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to update password';
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const clearSuccess = () => setPasswordSuccess(null);

  return {
    currentPassword,
    newPassword,
    confirmPassword,
    loading,
    passwordSuccess,
    setCurrentPassword,
    setNewPassword,
    setConfirmPassword,
    updatePassword,
    resetForm,
    clearSuccess,
  };
}