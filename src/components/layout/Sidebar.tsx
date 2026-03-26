import { NavLink } from "react-router-dom";

function Sidebar() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `block px-4 py-2 rounded ${
      isActive ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-200"
    }`;

  return (
    <aside className="w-64 bg-white border-r p-4">
      <h2 className="text-xl font-bold mb-6">Portfolio Admin</h2>

      <nav className="space-y-2">
        <NavLink to="/admin/profile" className={linkClass}>
          Profile
        </NavLink>

        <NavLink to="/admin/projects" className={linkClass}>
          Projects
        </NavLink>

        <NavLink to="/admin/skills" className={linkClass}>
          Skills
        </NavLink>

        <NavLink to="/admin/contacts" className={linkClass}>
          Contact Details
        </NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;
