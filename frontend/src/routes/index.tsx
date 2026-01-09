import { Routes, Route } from "react-router-dom";
import CandidateLayout from "../layout/CandidateLayout";
import RecruiterLayout from "../layout/RecruiterLayout";
import CandidateHome from "../pages/candidate/Home";
import { CompleteProfile } from "../pages/candidate/completeProfile";
import RecruiterHome from "../pages/landing/landingPage";
import { RecruiterDetails } from "../pages/recruiter/RecruiterDetails";
import LandingPage from "../pages/landing/landingPage";
import RoleSelection from "../pages/auth/RoleSelection";
import SignIn from "../pages/auth/SignIn";
import UnifiedSignup from "../pages/auth/Signup"; // Changed from CandidateSignup
import VerifyOTP from "../pages/otp/verifyOTP";
import ProtectedRoute from "./ProtectedRoute";
import LinkedInCallback from "../linkedin/LinkedInCallback";
import PrivacyPolicy from "../pages/linkedin/PrivacyPolicy";

const AppRoutes = () => (
  <Routes>
    {/* 🌍 Public Routes */}
    <Route path="/" element={<LandingPage />} />
    <Route path="/role-selection" element={<RoleSelection />} />
    <Route path="/signin" element={<SignIn />} />
    
    {/* Unified Signup Route */}
    <Route path="/signup" element={<UnifiedSignup />} />
    
    {/* Optional: Keep the old routes for backward compatibility with redirects */}
    <Route 
      path="/candidate/signup" 
      element={
        <NavigateToSignupWithRole role="candidate" />
      } 
    />
    <Route 
      path="/recruiter/signup" 
      element={
        <NavigateToSignupWithRole role="recruiter" />
      } 
    />
    
    <Route path="/verify-otp" element={<VerifyOTP />} />
    <Route path="/auth/linkedin/callback" element={<LinkedInCallback />} />
    <Route path="/privacy-policy" element={<PrivacyPolicy />} />

    {/* 🔐 Candidate Routes */}
    <Route element={<ProtectedRoute allowedRoles={["candidate"]} />}>
      <Route element={<CandidateLayout />}>
        <Route path="/candidate/home" element={<CandidateHome />} />
        <Route path="/candidate/profile" element={<CompleteProfile />} />
      </Route>
    </Route>

    {/* 🔐 Recruiter Routes */}
    <Route element={<ProtectedRoute allowedRoles={["recruiter"]} />}>
      <Route element={<RecruiterLayout />}>
        <Route path="/recruiter/" element={<RecruiterHome />} />
        <Route
          path="/recruiter/complete-profile"
          element={<RecruiterDetails />}
        />
      </Route>
    </Route>

    {/* 🔐 Admin Routes (if needed in future) */}
    {/* <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
      <Route path="/admin/*" element={<AdminLayout />} />
    </Route> */}
  </Routes>
);

export default AppRoutes;



import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface NavigateToSignupWithRoleProps {
  role: "candidate" | "recruiter";
}

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