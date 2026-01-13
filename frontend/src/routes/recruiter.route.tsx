import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";

import ProtectedRoute from "./protector/ProtectedRoute";
import RecruiterLayout from "../layout/RecruiterLayout";
import RouteLoader from "../components/RouterLoader";

const RecruiterHome = lazy(() => import("../pages/landing/landingPage"));
const RecruiterDetails = lazy(
  () => import("../pages/recruiter/RecruiterDetails")
);
const RecruiterSettingsPage = lazy(
  () => import("../pages/recruiter/recruiterProfile")
);

const RecruiterRoutes = () => (
  <Suspense fallback={<RouteLoader />}>
    <Routes>
      <Route element={<ProtectedRoute allowedRoles={["recruiter"]} />}>
        <Route element={<RecruiterLayout />}>
          <Route path="/recruiter/" element={<RecruiterHome />} />
          <Route
            path="/recruiter/complete-profile"
            element={<RecruiterDetails />}
          />
          <Route
            path="/recruiter/profile"
            element={<RecruiterSettingsPage />}
          />
        </Route>
      </Route>
    </Routes>
  </Suspense>
);

export default RecruiterRoutes;
