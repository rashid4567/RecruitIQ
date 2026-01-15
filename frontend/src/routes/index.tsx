import { Routes, Route } from "react-router-dom";
import PublicRoutes from "./public.routes";
import CandidateRoutes from "./candidate.routes";
import RecruiterRoutes from "./recruiter.route";
import AdminRoutes from "./admin.routes";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/*" element={<PublicRoutes />} />
      <Route path="/candidate/*" element={<CandidateRoutes />} />
      <Route path="/recruiter/*" element={<RecruiterRoutes />} />
      <Route path="/admin/*" element={<AdminRoutes />} />
    </Routes>
  );
};

export default AppRoutes;
