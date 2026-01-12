import { Outlet } from "react-router-dom";

const RecruiterLayout = () => {
  return (
    <div>
     
      <nav>Recruiter Navigation</nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default RecruiterLayout;