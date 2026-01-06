// src/routes/candidate.routes.tsx
import { Route } from "react-router-dom";
import CandidateLayout from "../layout/CandidateLayout";
import CandidateHome from "../pages/candidate/Home";
import {CompleteProfile} from "../pages/candidate/completeProfile";

const CandidateRoutes = () => {
  return (
    <Route element={<CandidateLayout />}>
   
      <Route path="/candidate/dashboard" element={<CandidateHome />} />

      <Route
        path="/candidate/profile"
        element={<CompleteProfile />}
      />
    </Route>
  );
};

export default CandidateRoutes;
