import { Routes, Route, Router } from "react-router-dom";
import { Suspense, lazy } from "react";

import AdminProtectedRoute from "./protector/adminProtectedRoutes";
import AdminLayout from "../layout/adminLayout";
import RouteLoader from "../components/RouterLoader";

const AdminLogin = lazy(() => import("../pages/admin/login"));
const AdminDashboard = lazy(() => import("../pages/admin/dashboard"));
const RecruitersPage = lazy(
  () => import("../pages/admin/recruiterManagment/recruiterList")
);
const RecruiterProfilePage = lazy(
  () => import("../pages/admin/recruiterManagment/recruiterProfile")
);
// const CandidateManagement = lazy(
//   () => import("../pages/admin/candidateManagment/candidateList")
// );

const CandidateManagement = lazy(()=> import("../module/admin/presentation/pages/candidateList"))
// const CandidateProfile = lazy(
//   () => import("../pages/admin/candidateManagment/candidateProfile")
// );

const CandidateProfile = lazy(()=> import("../module/admin/presentation/pages/candidateProfile"))
const EmailTemplateManagement = lazy(
  () => import("../pages/admin/email-templates/emailTemplate.mangment")
);
const EmailTemplateEditor = lazy(
  () => import("../pages/admin/email-templates/emailTemplate.editort")
);

const EmailLogs = lazy(()=> import("../pages/admin/email-logs/EmailLogsPage"))

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
        <Route path="/email-logs" element={<EmailLogs/>}/>
        </Route>
      </Route>
    </Routes>
  </Suspense>
);

export default AdminRoutes;
