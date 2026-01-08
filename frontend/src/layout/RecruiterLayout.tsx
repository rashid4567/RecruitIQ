// src/layout/RecruiterLayout.tsx
import { Outlet } from "react-router-dom";

const RecruiterLayout = () => {
  return (
    <div>
      {/* Add recruiter-specific navigation here */}
      <nav>Recruiter Navigation</nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default RecruiterLayout;