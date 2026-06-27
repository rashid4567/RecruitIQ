import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { UserRole } from "../types/auth.types";

const ROLE_STORAGE_KEY = "selected_role";

export function useRoleSelection() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(() => {
    const stored = sessionStorage.getItem(ROLE_STORAGE_KEY);
    return (stored as UserRole) ?? null;
  });

  const selectRole = (role: UserRole) => {
    setSelectedRole(role);
    sessionStorage.setItem(ROLE_STORAGE_KEY, role);
  };

  const handleContinue = () => {
    if (!selectedRole) return;

    navigate(`/signup?role=${selectedRole}`, {
      state: { role: selectedRole },
    });
  };

  const goToSignIn = () => navigate("/signin");

  return {
    selectedRole,
    selectRole,
    handleContinue,
    goToSignIn,
    isRoleSelected: !!selectedRole,
  };
}