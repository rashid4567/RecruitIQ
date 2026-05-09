import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import ProtectedRoute from "./protector/ProtectedRoute";
import RecruiterLayout from "../layout/RecruiterLayout";
import RouteLoader from "../components/RouterLoader";
import NotFoundPage from "../pages/landing/pageNotFount";
const RecruiterHome = lazy(() => import("../pages/landing/landingPage"));
const RecruiterDetails = lazy(
  () => import("../module/recruiter/presentation/pages/completeProfile"),
);

const MyJobPost = lazy(
  () => import("../module/recruiter/presentation/pages/jobpost"),
);

const JobPostEditor = lazy(
  () => import("../module/recruiter/presentation/pages/createJobPost"),
);

const RecruiterSettingsPage = lazy(
  () => import("../module/recruiter/presentation/pages/recruiter.profile"),
);

const SubscriptionPlans = lazy(
  () => import("../module/recruiter/presentation/pages/pricePlaning"),
);

const SubscriptionSuccess = lazy(
  () => import("../module/recruiter/presentation/pages/paymentSuccess"),
);

const SubscriptionFailed = lazy(
  () => import("../module/recruiter/presentation/pages/paymentFailed"),
);

const RecruiterRoutes = () => {
  return (
    <Suspense fallback={<RouteLoader />}>
      <Routes>
        <Route element={<ProtectedRoute allowedRoles={["recruiter"]} />}>
          <Route element={<RecruiterLayout />}>
            <Route index element={<RecruiterHome />} />

            <Route path="complete-profile" element={<RecruiterDetails />} />

            <Route path="profile" element={<RecruiterSettingsPage />} />

            <Route path="jobs" element={<MyJobPost />} />

            <Route path="job-editor" element={<JobPostEditor />} />

            <Route path="job-editor/:id" element={<JobPostEditor />} />

            <Route path="plans" element={<SubscriptionPlans />} />

            <Route
              path="subscription/success"
              element={<SubscriptionSuccess />}
            />

            <Route
              path="subscription/failed"
              element={<SubscriptionFailed />}
            />

            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
};

export default RecruiterRoutes;
