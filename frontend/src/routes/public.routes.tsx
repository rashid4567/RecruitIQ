import { Routes, Route } from "react-router-dom";
import LandingPage from "../pages/landing/landingPage";
import RoleSelection from "../pages/auth/RoleSelection";
import SignIn from "../pages/auth/SignIn";
import SignUp from "../pages/auth/CandidateSignup";

const PublicRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/role-selection" element={<RoleSelection />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
    </Routes>
  );
};

export default PublicRoutes;
