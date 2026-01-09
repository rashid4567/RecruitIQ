import { Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";

import CandidateLayout from "../layout/CandidateLayout";
import RecruiterLayout from "../layout/RecruiterLayout";
import CandidateHome from "../pages/candidate/Home";
import { CompleteProfile } from "../pages/candidate/completeProfile";
import RecruiterHome from "../pages/landing/landingPage";
import { RecruiterDetails } from "../pages/recruiter/RecruiterDetails";
import LandingPage from "../pages/landing/landingPage";
import RoleSelection from "../pages/auth/RoleSelection";
import SignIn from "../pages/auth/SignIn";
import UnifiedSignup from "../pages/auth/Signup";
import VerifyOTP from "../pages/otp/verifyOTP";
import ProtectedRoute from "./ProtectedRoute";
import LinkedInCallback from "../linkedin/LinkedInCallback";
import PrivacyPolicy from "../pages/linkedin/PrivacyPolicy";
import AdminLogin from "../pages/admin/login";
import AdminDashboard from "../pages/admin/dashboard";
import AdminProtectedRoute from "./adminProtectedRoutes";
import AdminLayout from "../layout/adminLayout";

interface NavigateToSignupWithRoleProps {
  role: "candidate" | "recruiter";
}

const AppRoutes = () => (
  <Routes>
    {/* 🌍 Public */}
    <Route path="/" element={<LandingPage />} />
    <Route path="/role-selection" element={<RoleSelection />} />
    <Route path="/signin" element={<SignIn />} />
    <Route path="/signup" element={<UnifiedSignup />} />
    <Route path="/verify-otp" element={<VerifyOTP />} />
    <Route path="/auth/linkedin/callback" element={<LinkedInCallback />} />
    <Route path="/privacy-policy" element={<PrivacyPolicy />} />

    {/* 🔁 Backward compatibility */}
    <Route
      path="/candidate/signup"
      element={<NavigateToSignupWithRole role="candidate" />}
    />
    <Route
      path="/recruiter/signup"
      element={<NavigateToSignupWithRole role="recruiter" />}
    />

    {/* 🔐 ADMIN */}
    <Route path="/admin/login" element={<AdminLogin />} />
    <Route element={<AdminProtectedRoute />}>
      <Route element={<AdminLayout />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Route>
    </Route>

    {/* 🔐 Candidate */}
    <Route element={<ProtectedRoute allowedRoles={["candidate"]} />}>
      <Route element={<CandidateLayout />}>
        <Route path="/candidate/home" element={<CandidateHome />} />
        <Route path="/candidate/profile" element={<CompleteProfile />} />
      </Route>
    </Route>

    {/* 🔐 Recruiter */}
    <Route element={<ProtectedRoute allowedRoles={["recruiter"]} />}>
      <Route element={<RecruiterLayout />}>
        <Route path="/recruiter/" element={<RecruiterHome />} />
        <Route
          path="/recruiter/complete-profile"
          element={<RecruiterDetails />}
        />
      </Route>
    </Route>
  </Routes>
);

export default AppRoutes;

const NavigateToSignupWithRole = ({ role }: NavigateToSignupWithRoleProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(`/signup?role=${role}`);
  }, [navigate, role]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p>Redirecting to signup...</p>
      </div>
    </div>
  );
};
