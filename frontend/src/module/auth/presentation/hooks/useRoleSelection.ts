import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { UserRole } from "@/module/auth/domain/constants/user-role";

export function useRoleSelection() {
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const selectRole = (role: UserRole) => {
    setSelectedRole(role);
  };

  const handleContinue = () => {
    if (!selectedRole) return;

    navigate("/signup", {
      state: { role: selectedRole },
    });
  };

  const goToSignIn = () => {
    navigate("/signin");
  };

  return {
    selectedRole,
    selectRole,
    handleContinue,
    goToSignIn,
    isRoleSelected: !!selectedRole,
  };
}
