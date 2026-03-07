import { NavLink, Outlet, useNavigate } from "react-router-dom";

export default function AdminLayout({ setToken }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b flex flex-col items-center">
          <img
            src="/logo.png"
            alt="Fort Hub Realty"
            className="w-16 h-16 object-contain mb-2"
          />

          <h2 className="text-lg font-bold text-blue-600 text-center">
            Fort Hub Realty
          </h2>

          <p className="text-xs text-gray-500">Admin Dashboard</p>
        </div>

        <nav className="p-4 space-y-2">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `block p-3 rounded-lg ${
                isActive ? "bg-blue-600 text-white" : "hover:bg-gray-200"
              }`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/developer"
            className={({ isActive }) =>
              `block p-3 rounded-lg ${
                isActive ? "bg-blue-600 text-white" : "hover:bg-gray-200"
              }`
            }
          >
            Developers
          </NavLink>

          <NavLink
            to="/project"
            className={({ isActive }) =>
              `block p-3 rounded-lg ${
                isActive ? "bg-blue-600 text-white" : "hover:bg-gray-200"
              }`
            }
          >
            Projects
          </NavLink>

          <NavLink
            to="/banner"
            className={({ isActive }) =>
              `block p-3 rounded-lg ${
                isActive ? "bg-blue-600 text-white" : "hover:bg-gray-200"
              }`
            }
          >
            Banners
          </NavLink>
          <NavLink
            to="/features"
            className={({ isActive }) =>
              `block p-3 rounded-lg ${
                isActive ? "bg-blue-600 text-white" : "hover:bg-gray-200"
              }`
            }
          >
            Features
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `block p-3 rounded-lg ${
                isActive ? "bg-blue-600 text-white" : "hover:bg-gray-200"
              }`
            }
          >
            About Us
          </NavLink>
          <NavLink
            to="/blogs"
            className={({ isActive }) =>
              `block p-3 rounded-lg ${
                isActive ? "bg-blue-600 text-white" : "hover:bg-gray-200"
              }`
            }
          >
            Blogs
          </NavLink>

          <button
            onClick={logout}
            className="w-full text-left p-3 rounded-lg hover:bg-red-500 hover:text-white"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* MAIN */}
      <main className="flex-1">
        {/* TOPBAR */}
        <header className="bg-white shadow p-4 flex justify-between">
          <h1 className="text-xl font-semibold">Admin Dashboard</h1>

          <div>Welcome, Admin</div>
        </header>

        {/* THIS IS IMPORTANT */}
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
