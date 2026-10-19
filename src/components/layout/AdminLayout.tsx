import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import useAutoLogout from "../../hooks/useAutoLogout";

function AdminLayout() {
  useAutoLogout();
  return (
    <div className="flex min-h-screen min-w-0 flex-col lg:flex-row">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header />

        <main className="min-w-0 flex-1 bg-gray-50 p-3 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
