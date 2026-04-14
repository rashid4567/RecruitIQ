import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";

import AdminProtectedRoute from "./protector/adminProtectedRoutes";
import AdminLayout from "../layout/adminLayout";
import RouteLoader from "../components/RouterLoader";

const AdminLogin = lazy(() => import("../module/admin/presentation/pages/login.tsx"));

const AdminDashboard = lazy(() => import("../module/admin/presentation/pages/dashboard.tsx"));

const RecruitersPage = lazy(
  () => import("../module/admin/presentation/pages/getRecruiterList"),
);

const RecruiterProfilePage = lazy(
  () => import("../module/admin/presentation/pages/recruiterProfile"),
);

const CandidateManagement = lazy(
  () => import("../module/admin/presentation/pages/candidateList"),
);

const CandidateProfile = lazy(
  () => import("../module/admin/presentation/pages/candidateProfile"),
);

const EmailTemplateManagement = lazy(()=> import("../module/admin/presentation/pages/emailTemplate.mangment"))


const EmailTemplateEditor = lazy(()=> import("../module/admin/presentation/pages/emailTemplate.editor"))

const EmailLogs = lazy(()=> import("../module/admin/presentation/pages/email.logs"))
const ActivityLogs = lazy(()=>import("../module/admin/presentation/pages/activity-log"))

const AdminRoutes = () => (
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
            path="/email-templates"
            element={<EmailTemplateManagement />}
          />
          <Route
            path="/email-templates/create"
            element={<EmailTemplateEditor />}
          />
          <Route
            path="/email-templates/edit/:id"
            element={<EmailTemplateEditor />}
          />
          <Route path="email-templates/:id" element={<EmailTemplateEditor/>}/>
          <Route path="/email-logs" element={<EmailLogs />} />
          <Route path="/activity-logs" element={<ActivityLogs/>}/>
        </Route>
      </Route>
    </Routes>
  </Suspense>
);

export default AdminRoutes;
