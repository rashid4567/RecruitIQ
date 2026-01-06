import { Routes, Route } from "react-router-dom";
import CandidateLayout from "../layout/CandidateLayout";
import CandidateHome from "../pages/candidate/Home";
import { CompleteProfile} from "../pages/candidate/completeProfile";

import LandingPage from "../pages/landing/landingPage";
import RoleSelection from "../pages/auth/RoleSelection";
import SignIn from "../pages/auth/SignIn";
import SignUp from "../pages/auth/CandidateSignup";
import VerifyOTP from "../pages/otp/verifyOTP";

const AppRoutes = () => (
  <Routes>
    {/* 🌍 Public Routes */}
    <Route path="/" element={<LandingPage />} />
    <Route path="/role-selection" element={<RoleSelection />} />
    <Route path="/signin" element={<SignIn />} />
    <Route path="/signup" element={<SignUp />} />
    <Route path="/verify-otp" element={<VerifyOTP />} />

    🔐 Candidate Protected Routes
    <Route element={<CandidateLayout />}>
      <Route
        path="/candidate/home"
        element={<CandidateHome />}
      />

      {/* First-time profile completion */}
      <Route
        path="/candidate/profile"
        element={<CompleteProfile />}
      />
    </Route>
  </Routes>
);

export default AppRoutes;
