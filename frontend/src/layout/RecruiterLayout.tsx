import { Outlet } from "react-router-dom";
import NotificationListener from "../module/notification/page/NotificationListener"

const RecruiterLayout = () => {
  return (
    <>
      <NotificationListener />

      <div>
        <nav>.</nav>

        <main>
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default RecruiterLayout;