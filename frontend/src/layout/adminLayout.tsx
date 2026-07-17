import { Outlet } from "react-router-dom";
import Sidebar from "../components/admin/sideBar"
import { AdminHeader } from "@/components/admin/AdminHeader";

const AdminLayout = () => {
  return (
    <div className="flex min-h-dvh bg-slate-50">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminHeader />
        <main className="min-w-0 flex-1 overflow-x-hidden">
          <div
            className="
              mx-auto
              w-full
              p-3
              min-[375px]:p-4
              sm:p-5
              md:p-6
              lg:p-7
              xl:p-8
            "
          >
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;