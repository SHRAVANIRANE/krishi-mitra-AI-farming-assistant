import { NavLink } from "react-router-dom";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: "DB" },
  { to: "/weather", label: "Weather", icon: "WX" },
  { to: "/crop-health", label: "Crop Health", icon: "CH" },
  { to: "/irrigation", label: "Irrigation", icon: "IR" },
];

function Sidebar() {
  return (
    <aside className="hidden w-72 shrink-0 border-r border-teal-100 bg-white/75 p-5 backdrop-blur md:block md:min-h-[calc(100vh-73px)]">
      <div className="mb-5 rounded-2xl border border-teal-100 bg-gradient-to-br from-teal-50 to-emerald-50 p-4 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">
          Control Panel
        </p>
        <h2 className="mt-1 text-lg font-bold text-slate-900">Workspace</h2>
        <p className="mt-1 text-xs text-slate-600">Navigate core farm operations</p>
      </div>

      <nav className="space-y-2">
        {links.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `group flex items-center justify-between rounded-xl border px-3 py-3 text-sm font-medium transition ${
                isActive
                  ? "border-teal-600 bg-teal-600 text-white shadow"
                  : "border-transparent text-slate-700 hover:border-teal-100 hover:bg-teal-50 hover:text-teal-700"
              }`
            }
          >
            <span>{item.label}</span>
            
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;