import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

function AdminLayout() {
  return (
    <div className="flex min-h-screen">

      <Sidebar />

      <main className="flex-1 p-6 bg-gray-50">
        <Outlet />
      </main>

    </div>
  );
}

export default AdminLayout;