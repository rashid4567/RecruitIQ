import { Routes, Route } from "react-router-dom";

import PublicRoutes from "./public.routes";
import CandidateRoutes from "./candidate.routes";
import RecruiterRoutes from "./recruiter.route";
import AdminRoutes from "./admin.routes";

import NotFoundPage from "../pages/landing/pageNotFount";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/candidate/*" element={<CandidateRoutes />} />
      <Route path="/recruiter/*" element={<RecruiterRoutes />} />
      <Route path="/admin/*" element={<AdminRoutes />} />
      <Route path="/*" element={<PublicRoutes />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
