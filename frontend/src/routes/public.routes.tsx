import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";

import RouteLoader from "../components/RouterLoader";
import NavigateToSignupWithRole from "./protector/NavigateToSignupWithRole";

const LandingPage = lazy(() => import("../pages/landing/landingPage"));
const RoleSelection = lazy(() => import("../pages/auth/RoleSelection"));
const SignIn = lazy(() => import("../pages/auth/SignIn"));
const Signup = lazy(() => import("../pages/auth/Signup"));
const VerifyOTP = lazy(() => import("../pages/otp/verifyOTP"));
const LinkedInCallback = lazy(() => import("../linkedin/LinkedInCallback"));
const PrivacyPolicy = lazy(
  () => import("../pages/linkedin/PrivacyPolicy")
);

const ForgotPassword = lazy(() => import("../pages/auth/ForgotPassword"));
const ResetPassword = lazy(()=> import("../pages/auth/ResetPassword"));


const PublicRoutes = () => (
  <Suspense fallback={<RouteLoader />}>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/role-selection" element={<RoleSelection />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />
      <Route path="/auth/linkedin/callback" element={<LinkedInCallback />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
<Route path="/reset-password" element={<ResetPassword />} />

      <Route
        path="/candidate/signup"
        element={<NavigateToSignupWithRole role="candidate" />}
      />
      <Route
        path="/recruiter/signup"
        element={<NavigateToSignupWithRole role="recruiter" />}
      />
    </Routes>
  </Suspense>
);

export default PublicRoutes;
