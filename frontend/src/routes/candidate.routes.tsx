import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";

import ProtectedRoute from "./ProtectedRoute";
import CandidateLayout from "../layout/CandidateLayout";
import RouteLoader from "../components/RouterLoader";

const CandidateHome = lazy(() => import("../pages/candidate/Home"));
const CompleteProfile = lazy(
  () => import("../pages/candidate/completeProfile")
);
const CandidateProfilePage = lazy(
  () => import("../pages/candidate/profilePage")
);
const AccountSettingsPage = lazy(
  () => import("../pages/candidate/account-setting")
);

const CandidateRoutes = () => (
  <Suspense fallback={<RouteLoader />}>
    <Routes>
      <Route element={<ProtectedRoute allowedRoles={["candidate"]} />}>
        <Route element={<CandidateLayout />}>
          <Route path="/candidate/home" element={<CandidateHome />} />
          <Route
            path="/candidate/profile/complete"
            element={<CompleteProfile />}
          />
          <Route
            path="/candidate/profile"
            element={<CandidateProfilePage />}
          />
          <Route
            path="/candidate/profile/setting"
            element={<AccountSettingsPage />}
          />
        </Route>
      </Route>
    </Routes>
  </Suspense>
);

export default CandidateRoutes;
