import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";

import AdminProtectedRoute from "./protector/adminProtectedRoutes";

import AdminLayout from "../layout/adminLayout";

import RouteLoader from "../components/RouterLoader";

import NotFoundPage from "../pages/landing/pageNotFount";

const AdminLogin = lazy(
  () =>
    import(
      "../module/admin/presentation/pages/login.tsx"
    )
);

const AdminDashboard = lazy(
  () =>
    import(
      "../module/admin/presentation/pages/dashboard.tsx"
    )
);

const RecruitersPage = lazy(
  () =>
    import(
      "../module/admin/presentation/pages/getRecruiterList"
    )
);

const RecruiterProfilePage = lazy(
  () =>
    import(
      "../module/admin/presentation/pages/recruiterProfile"
    )
);

const CandidateManagement = lazy(
  () =>
    import(
      "../module/admin/presentation/pages/candidateList"
    )
);

const CandidateProfile = lazy(
  () =>
    import(
      "../module/admin/presentation/pages/candidateProfile"
    )
);

const PlanController = lazy(
  () =>
    import(
      "../module/subscription/presentation/page/plan-controller.tsx"
    )
);

const PlanEditor = lazy(
  () =>
    import(
      "../module/subscription/presentation/page/subscription.plan.tsx"
    )
);

const EmailTemplateManagement = lazy(
  () =>
    import(
      "../module/email/presentation/pages/emailTemplate.mangment.tsx"
    )
);

const EmailTemplateEditor = lazy(
  () =>
    import(
      "../module/email/presentation/pages/emailTemplate.editor.tsx"
    )
);

const EmailLogs = lazy(
  () =>
    import(
      "../module/email/presentation/pages/email.logs.tsx"
    )
);

const ActivityLogs = lazy(
  () =>
    import(
      "../module/activity.logger/presentation/pages/activity-log.tsx"
    )
);

const JobPostManagement = lazy(
  () =>
    import(
      "../module/jobs/presentation/pages/jobPost.managment.tsx"
    )
);

const AdminRoutes = () => {
  return (
    <Suspense fallback={<RouteLoader />}>
      <Routes>
        {/* Public Admin Route */}
        <Route
          path="login"
          element={<AdminLogin />}
        />

        {/* Protected Admin Routes */}
        <Route element={<AdminProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route
              path="dashboard"
              element={<AdminDashboard />}
            />

            {/* Recruiters */}
            <Route
              path="recruiters"
              element={<RecruitersPage />}
            />

            <Route
              path="recruiters/:id"
              element={
                <RecruiterProfilePage />
              }
            />

            {/* Candidates */}
            <Route
              path="candidates"
              element={<CandidateManagement />}
            />

            <Route
              path="candidates/:candidateId"
              element={<CandidateProfile />}
            />

            {/* Email Templates */}
            <Route
              path="email-templates"
              element={
                <EmailTemplateManagement />
              }
            />

            <Route
              path="email-templates/create"
              element={
                <EmailTemplateEditor />
              }
            />

            <Route
              path="email-templates/edit/:id"
              element={
                <EmailTemplateEditor />
              }
            />

            <Route
              path="email-templates/:id"
              element={
                <EmailTemplateEditor />
              }
            />

            {/* Email Logs */}
            <Route
              path="email-logs"
              element={<EmailLogs />}
            />

            {/* Activity Logs */}
            <Route
              path="activity-logs"
              element={<ActivityLogs />}
            />

            {/* Job Posts */}
            <Route
              path="jobPosts"
              element={
                <JobPostManagement />
              }
            />

            {/* Plans */}
            <Route
              path="plans"
              element={<PlanController />}
            />

            <Route
              path="plans/create"
              element={<PlanEditor />}
            />

            <Route
              path="plans/edit/:id"
              element={<PlanEditor />}
            />

            {/* Admin 404 */}
            <Route
              path="*"
              element={<NotFoundPage />}
            />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AdminRoutes;