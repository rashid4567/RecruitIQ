import { Routes, Route } from "react-router-dom"
import { Suspense, lazy } from "react"

import AdminProtectedRoute from "./protector/adminProtectedRoutes"
import AdminLayout from "../layout/adminLayout"
import RouteLoader from "../components/RouterLoader"

const AdminLogin = lazy(() => import("../pages/admin/login"))
const AdminDashboard = lazy(() => import("../pages/admin/dashboard"))
const RecruitersPage = lazy(() => import("../pages/admin/recruiterManagment/recruiterList"))
const RecruiterProfilePage = lazy(() => import("../pages/admin/recruiterManagment/recruiterProfile"))
const CandidateManagement = lazy(() => import("../pages/admin/candidateManagment/candidateList"))
const CandidateProfile = lazy(() => import("../pages/admin/candidateManagment/candidateProfile"))
const ComingSoonPage = lazy(() => import("../components/comingSoon"))

const AdminRoutes = () => (
  <Suspense fallback={<RouteLoader />}>
    <Routes>

      <Route path="/admin/login" element={<AdminLogin />} />
      <Route element={<AdminProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/recruiters" element={<RecruitersPage />} />
          <Route path="/admin/recruiters/:id" element={<RecruiterProfilePage />} />
          <Route path="/admin/candidates" element={<CandidateManagement />} />
          <Route path="/admin/candidates/:candidateId" element={<CandidateProfile />} />


          <Route path="/admin/coming-soon" element={<ComingSoonPage />} />

  
          <Route path="/admin/*" element={<ComingSoonPage />} />
        </Route>
      </Route>
    </Routes>
  </Suspense>
)

export default AdminRoutes
