import { NavLink, Outlet } from "react-router-dom";

export default function Projects() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Projects</h1>

      <div className="flex gap-4 mb-6">
        <NavLink
          to="/admin/projects"
          end
          className={({ isActive }) =>
            isActive
              ? "bg-blue-700 text-white px-4 py-2 rounded"
              : "bg-blue-500 text-white px-4 py-2 rounded"
          }
        >
          All Projects
        </NavLink>

        <NavLink
          to="/admin/projects/import"
          className={({ isActive }) =>
            isActive
              ? "bg-green-700 text-white px-4 py-2 rounded"
              : "bg-green-500 text-white px-4 py-2 rounded"
          }
        >
          Import from GitHub
        </NavLink>
      </div>

      <Outlet />
    </div>
  );
}