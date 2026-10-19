import { NavLink } from "react-router-dom";

function Sidebar() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `block px-4 py-2 rounded ${
      isActive ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-200"
    }`;

  return (
    <aside className="w-full shrink-0 border-b bg-white p-3 sm:p-4 lg:w-64 lg:border-b-0 lg:border-r">
      <h2 className="mb-3 text-lg font-bold sm:text-xl lg:mb-6">
        Portfolio Admin
      </h2>

      <nav className="flex flex-wrap gap-1 lg:flex-col lg:gap-0 lg:space-y-2">
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
