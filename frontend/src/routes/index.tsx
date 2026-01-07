// src/routes/AppRoutes.tsx
import { Routes, Route } from "react-router-dom";
import CandidateLayout from "../layout/CandidateLayout";
import RecruiterLayout from "../layout/RecruiterLayout.js"; // You'll need to create this
import CandidateHome from "../pages/candidate/Home";
import { CompleteProfile } from "../pages/candidate/completeProfile";
import RecruiterHome from "../pages/landing/landingPage"; // You'll need to create this
import { RecruiterDetails } from "../pages/recruiter/RecruiterDetails"; // Your existing component
import LandingPage from "../pages/landing/landingPage";
import RoleSelection from "../pages/auth/RoleSelection";
import SignIn from "../pages/auth/SignIn";
import SignUp from "../pages/auth/CandidateSignup";
import RecruiterSignup from "../pages/auth/RecruiterSignUp";
import VerifyOTP from "../pages/otp/verifyOTP";
import ProtectedRoute from "./ProtectedRoute"; // You should create this

const AppRoutes = () => (
  <Routes>
    {/* 🌍 Public Routes */}
    <Route path="/" element={<LandingPage />} />
    <Route path="/role-selection" element={<RoleSelection />} />
    <Route path="/signin" element={<SignIn />} />
    <Route path="/signup" element={<SignUp />} />
    <Route path="/recruiter/signup" element={<RecruiterSignup />} />
    <Route path="/verify-otp" element={<VerifyOTP />} />

    {/* 🔐 Candidate Protected Routes */}
    <Route element={<ProtectedRoute allowedRoles={["candidate"]} />}>
      <Route element={<CandidateLayout />}>
        <Route path="/candidate/home" element={<CandidateHome />} />
        <Route path="/candidate/profile" element={<CompleteProfile />} />
      </Route>
    </Route>

    {/* 🔐 Recruiter Protected Routes */}
    <Route element={<ProtectedRoute allowedRoles={["recruiter"]} />}>
      <Route element={<RecruiterLayout />}>
        <Route path="/recruiter/home" element={<RecruiterHome />} />
        <Route path="/recruiter/complete-profile" element={<RecruiterDetails />} />
      </Route>
    </Route>
  </Routes>
);

export default AppRoutes;