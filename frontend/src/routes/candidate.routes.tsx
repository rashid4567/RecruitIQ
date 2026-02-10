import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";

import ProtectedRoute from "./protector/ProtectedRoute";
import CandidateLayout from "../layout/CandidateLayout";
import RouteLoader from "../components/RouterLoader";

const CandidateHome = lazy(() => import("../pages/candidate/Home"));

const CompleteProfile = lazy(()=> import("../module/candidate/presentation/pages/comleteProfile"))



const AccountSettingsPage = lazy(
  () => import("../module/candidate/presentation/pages/personal-info")
);

const CandidateRoutes = () => (
  <Suspense fallback={<RouteLoader />}>
    <Routes>
      <Route element={<ProtectedRoute allowedRoles={["candidate"]} />}>
        <Route element={<CandidateLayout />}>
          <Route path="home" element={<CandidateHome />} />
          <Route path="profile/complete" element={<CompleteProfile />} />
          <Route path="profile/setting" element={<AccountSettingsPage />} />
        </Route>
      </Route>
    </Routes>
  </Suspense>
);

export default CandidateRoutes;




