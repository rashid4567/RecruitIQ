import PublicRoutes from "./public.routes";
import CandidateRoutes from "./candidate.routes";
import RecruiterRoutes from "./recruiter.route";
import AdminRoutes from "./admin.routes";

const AppRoutes = () => (
  <>
    <PublicRoutes />
    <CandidateRoutes />
    <RecruiterRoutes />
    <AdminRoutes />
  </>
);

export default AppRoutes;
