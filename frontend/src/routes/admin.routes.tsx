import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";

import AdminProtectedRoute from "./protector/adminProtectedRoutes";
import AdminLayout from "../layout/adminLayout";
import RouteLoader from "../components/RouterLoader";
import NotFoundPage from "../pages/landing/pageNotFount";

const AdminLogin = lazy(() => import("../module/admin/pages/login.tsx"));
const AdminDashboard = lazy(
  () => import("../module/dashboard/pages/admin.dashboard.tsx"),
);
const RecruitersPage = lazy(
  () => import("../module/admin/pages/getRecruiterList.tsx"),
);
const RecruiterProfilePage = lazy(
  () => import("../module/admin/pages/recruiterProfile.tsx"),
);
const CandidateManagement = lazy(
  () => import("../module/admin/pages/candidateList.tsx"),
);
const CandidateProfile = lazy(
  () => import("../module/admin/pages/candidateProfile.tsx"),
);

const PlanController = lazy(
  () => import("../module/subscription/pages/plan-controller.tsx"),
);
const PlanEditor = lazy(
  () => import("../module/subscription/pages/subscription.plan.tsx"),
);

const EmailTemplateManagement = lazy(
  () => import("../module/email/pages/emailTemplate.mangment.tsx"),
);
const EmailTemplateEditor = lazy(
  () => import("../module/email/pages/emailTemplate.editor.tsx"),
);

const EmailLogs = lazy(() => import("../module/email/pages/email.logs.tsx"));

const ActivityLogs = lazy(
  () => import("../module/activity.logger/pages/activity-log.tsx"),
);

const JobPostManagement = lazy(
  () => import("../module/jobs/pages/jobPost.managment.tsx"),
);

const SubscribersPage = lazy(
  () => import("../module/subscription/pages/subscribers.list.tsx"),
);

const ChangeAdminPassword = lazy(()=> import("../module/admin/pages/adminpassword.tsx"))

const AdminRoutes = () => {
  return (
    <Suspense fallback={<RouteLoader />}>
      <Routes>
        <Route path="login" element={<AdminLogin />} />
        <Route element={<AdminProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="recruiters" element={<RecruitersPage />} />
            <Route path="recruiters/:id" element={<RecruiterProfilePage />} />
            <Route path="candidates" element={<CandidateManagement />} />
            <Route
              path="candidates/:candidateId"
              element={<CandidateProfile />}
            />
            <Route
              path="email-templates"
              element={<EmailTemplateManagement />}
            />
            <Route
              path="email-templates/create"
              element={<EmailTemplateEditor />}
            />
            <Route
              path="email-templates/edit/:id"
              element={<EmailTemplateEditor />}
            />
            <Route
              path="email-templates/:id"
              element={<EmailTemplateEditor />}
            />
            <Route path="email-logs" element={<EmailLogs />} />
            <Route path="activity-logs" element={<ActivityLogs />} />
            <Route path="jobPosts" element={<JobPostManagement />} />
            <Route path="plans" element={<PlanController />} />
            <Route path="plans/create" element={<PlanEditor />} />
            <Route path="plans/edit/:id" element={<PlanEditor />} />
            <Route path="subscribers" element={<SubscribersPage />} />
            <Route path="/settings" element={<ChangeAdminPassword/>}/>
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AdminRoutes;
