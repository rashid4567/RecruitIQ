import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import ProtectedRoute from "./protector/ProtectedRoute";
import CandidateLayout from "../layout/CandidateLayout";
import RouteLoader from "../components/RouterLoader";
import NotFoundPage from "../pages/landing/pageNotFount";

const CandidateHome = lazy(
  () => import("../module/candidate/presentation/pages/Home"),
);

const CompleteProfile = lazy(
  () => import("../module/candidate/presentation/pages/comleteProfile"),
);

const CareerPage = lazy(
  () => import("../module/jobs/presentation/pages/candidate-jobPost"),
);

const AccountSettingsPage = lazy(
  () => import("../module/candidate/presentation/pages/personal-info"),
);

const CandidateRoutes = () => {
  return (
    <Suspense fallback={<RouteLoader />}>
      <Routes>
        <Route element={<ProtectedRoute allowedRoles={["candidate"]} />}>
          <Route element={<CandidateLayout />}>
            <Route path="home" element={<CandidateHome />} />
            <Route path="profile/complete" element={<CompleteProfile />} />

            <Route path="profile/setting" element={<AccountSettingsPage />} />
            <Route path="jobs" element={<CareerPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
};

export default CandidateRoutes;
