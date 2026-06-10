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
  () => import("../module/jobs/presentation/pages/jobpost"),
);
const JobPostEditor = lazy(
  () => import("../module/jobs/presentation/pages/jobpost.Editor"),
);
const RecruiterSettingsPage = lazy(
  () => import("../module/recruiter/presentation/pages/recruiter.profile"),
);
const SubscriptionPlans = lazy(
  () =>
    import("../module/subscription/presentation/page/Recruiter.pricePlaning"),
);
const SubscriptionSuccess = lazy(
  () =>
    import("../module/subscription/presentation/page/components/Billing/paymentSuccess"),
);
const SubscriptionFailed = lazy(
  () =>
    import("../module/subscription/presentation/page/components/Billing/paymentFailed"),
);
const CurrentSubscriptionPage = lazy(
  () =>
    import("../module/subscription/presentation/page/CurrentSubscriptionPage"),
);
const RecruiterApplication = lazy(
  () =>
    import("../module/job-application/presentation/pages/recruiter/Recruiter.application"),
);
const NotificationCenter = lazy(()=> import("../module/notification/presentation/page/notification.center"))
const CandidateScorecardPage = lazy(()=> import("../module/job-application/presentation/pages/recruiter/Application.detail.view"))
const RecruiterRoutes = () => {
  return (
    <Suspense fallback={<RouteLoader />}>
      <Routes>
        <Route element={<ProtectedRoute allowedRoles={["recruiter"]} />}>
          <Route element={<RecruiterLayout />}>
            <Route index element={<RecruiterHome />} />
            <Route path="complete-profile" element={<RecruiterDetails />} />
            <Route path="profile" element={<RecruiterSettingsPage />} />
             <Route path="notification" element={<NotificationCenter/>}/>
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
            <Route
              path="current-subscription"
              element={<CurrentSubscriptionPage />}
            />

            <Route
              path="jobs/:jobId/applications"
              element={<RecruiterApplication />}
            />
            <Route path="application-detail/:applicationId" element={<CandidateScorecardPage/>}/>
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
};

export default RecruiterRoutes;
