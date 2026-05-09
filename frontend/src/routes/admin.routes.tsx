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
      "../module/admin/presentation/pages/plan-controller.tsx"
    )
);

const PlanEditor = lazy(
  () =>
    import(
      "../module/admin/presentation/pages/subscription.plan.tsx"
    )
);

const EmailTemplateManagement = lazy(
  () =>
    import(
      "../module/admin/presentation/pages/emailTemplate.mangment"
    )
);

const EmailTemplateEditor = lazy(
  () =>
    import(
      "../module/admin/presentation/pages/emailTemplate.editor"
    )
);

const EmailLogs = lazy(
  () =>
    import(
      "../module/admin/presentation/pages/email.logs"
    )
);

const ActivityLogs = lazy(
  () =>
    import(
      "../module/admin/presentation/pages/activity-log"
    )
);

const JobPostManagement = lazy(
  () =>
    import(
      "../module/admin/presentation/pages/jobPost.managment.tsx"
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