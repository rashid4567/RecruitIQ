import { Outlet } from "react-router-dom";

const RecruiterLayout = () => {
  return (
    <div>
     
      <nav>.</nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default RecruiterLayout;