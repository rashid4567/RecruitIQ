import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  role: "candidate" | "recruiter";
}

const NavigateToSignupWithRole = ({ role }: Props) => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(`/signup?role=${role}`);
  }, [navigate, role]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p>Redirecting to signup...</p>
      </div>
    </div>
  );
};

export default NavigateToSignupWithRole;
