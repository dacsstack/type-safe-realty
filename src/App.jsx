import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Navigate,
  NavLink,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";

import Department from "./components/Department.jsx";
import Employee from "./components/Employee.jsx";
import Home from "./components/Home.jsx";
import Login from "./components/Login.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";

function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

function App() {
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* HEADER */}
      <header className="bg-blue-600 text-white p-4 shadow-md flex justify-between items-center">
        <h1 className="text-2xl font-bold text-center flex-1">
          Fort Hub Realty Management System
        </h1>

        {token && (
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-lg text-white font-medium"
          >
            Logout
          </button>
        )}
      </header>

      {/* NAVIGATION */}
      {token && (
        <nav className="bg-white shadow-md">
          <div className="flex justify-center gap-4 p-3">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg font-medium transition ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 hover:bg-blue-500 hover:text-white"
                }`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/department"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg font-medium transition ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 hover:bg-blue-500 hover:text-white"
                }`
              }
            >
              Developer
            </NavLink>

            <NavLink
              to="/employee"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg font-medium transition ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 hover:bg-blue-500 hover:text-white"
                }`
              }
            >
              Project
            </NavLink>
          </div>
        </nav>
      )}

      {/* CONTENT */}
      <main className="flex-1 p-6">
        <div className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow-md">
          <Routes>
            {/* LOGIN ROUTE */}
            <Route
              path="/login"
              element={
                token ? (
                  <Navigate to="/" replace />
                ) : (
                  <Login setToken={setToken} />
                )
              }
            />

            {/* HOME ROUTE */}
            <Route
              path="/"
              element={token ? <Home /> : <Navigate to="/login" replace />}
            />

            {/* PROTECTED ROUTES */}
            <Route
              path="/department"
              element={
                <ProtectedRoute token={token}>
                  <Department />
                </ProtectedRoute>
              }
            />

            <Route
              path="/employee"
              element={
                <ProtectedRoute token={token}>
                  <Employee />
                </ProtectedRoute>
              }
            />

            {/* CATCH ALL */}
            <Route
              path="*"
              element={<Navigate to={token ? "/" : "/login"} replace />}
            />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default AppWrapper;
