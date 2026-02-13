import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";

import ProtectedRoute from "./protector/ProtectedRoute";
import RecruiterLayout from "../layout/RecruiterLayout";
import RouteLoader from "../components/RouterLoader";

const RecruiterHome = lazy(() => import("../pages/landing/landingPage"));
const RecruiterDetails = lazy(
  () => import("../pages/recruiter/RecruiterDetails"),
);

const RecruiterSettingsPage = lazy(
  () => import("../module/recruiter/presentation/pages/recruiter.profile"),
);

const RecruiterRoutes = () => (
  <Suspense fallback={<RouteLoader />}>
    <Routes>
      <Route element={<ProtectedRoute allowedRoles={["recruiter"]} />}>
        <Route element={<RecruiterLayout />}>
          <Route index element={<RecruiterHome />} />
          <Route path="complete-profile" element={<RecruiterDetails />} />
          <Route path="profile" element={<RecruiterSettingsPage />} />
        </Route>
      </Route>
    </Routes>
  </Suspense>
);

export default RecruiterRoutes;
