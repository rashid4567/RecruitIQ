import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import ProtectedRoute from "./protector/ProtectedRoute";
import CandidateLayout from "../layout/CandidateLayout";
import RouteLoader from "../components/RouterLoader";
import NotFoundPage from "../pages/landing/pageNotFount";

const CandidateHome = lazy(() => import("../module/candidate/pages/Home"));

const CompleteProfile = lazy(
  () => import("../module/candidate/pages/comleteProfile"),
);

const CareerPage = lazy(() => import("../module/jobs/pages/candidate-jobPost"));

const AccountSettingsPage = lazy(
  () => import("../module/candidate/pages/personal-info"),
);

const MyApplication = lazy(
  () => import("../module/job-application/pages/candidate/myApplication"),
);
const JobApplicationDetail = lazy(
  () =>
    import("../module/job-application/pages/candidate/job.detail.application"),
);

const NotificationCenter = lazy(
  () => import("../module/notification/page/notification.center"),
);

const PreMeetingLobby = lazy(
  () => import("../module/interview/pages/pre-meating.waiting.loby"),
);
const LiveMeetingPage = lazy(
  () => import("../module/interview/pages/live.meeting"),
);
const MyInterviews = lazy(
  () => import("../module/interview/pages/candidate.all.interview"),
);
const MyInterviewDeatails = lazy(
  () => import("../module/interview/pages/candidate.interview.detail"),
);
const EmploymentOfferPage = lazy(
  () => import("../module/offer-letter/page/offer-letter"),
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
            <Route path="notification" element={<NotificationCenter />} />
            <Route path="applications" element={<MyApplication />} />
            <Route
              path="applications/:applicationId"
              element={<JobApplicationDetail />}
            />
            <Route path="jobs" element={<CareerPage />} />
            <Route path="interviews" element={<MyInterviews />} />
            <Route
              path="interview/:interviewId"
              element={<MyInterviewDeatails />}
            />
            <Route
              path="interviews/:interviewId/lobby"
              element={<PreMeetingLobby />}
            />
            <Route
              path="interviews/:interviewId/room"
              element={<LiveMeetingPage />}
            />
            <Route path="/offer/:offerId" element={<EmploymentOfferPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
};

export default CandidateRoutes;
