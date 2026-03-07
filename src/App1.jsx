import { useState } from "react";
import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom";

import Developer from "./components/Developer.jsx";
import Home from "./components/Home.jsx";
import Login from "./components/Login.jsx";
import Project from "./components/Project.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";

function App() {
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC LANDING PAGE */}
        <Route path="/landing" element={<LandingPage />} />

        {/* LOGIN */}
        <Route path="/login" element={<Login setToken={setToken} />} />

        {/* ADMIN DASHBOARD LAYOUT */}
        <Route
          path="/*"
          element={
            token ? (
              <div className="min-h-screen bg-gray-100 flex flex-col">
                {/* HEADER */}
                <header className="bg-blue-600 text-white p-4 shadow-md flex justify-between items-center">
                  <h1 className="text-2xl font-bold flex-1 text-center">
                    Fort Hub Realty Management System
                  </h1>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-lg text-white font-medium"
                  >
                    Logout
                  </button>
                </header>

                {/* NAVBAR */}
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
                      to="/developer"
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
                      to="/project"
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

                {/* CONTENT */}
                <main className="flex-1 p-6">
                  <div className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow-md">
                    <Routes>
                      <Route
                        path="/"
                        element={
                          <ProtectedRoute token={token}>
                            <Home />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/developer"
                        element={
                          <ProtectedRoute token={token}>
                            <Developer />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/project"
                        element={
                          <ProtectedRoute token={token}>
                            <Project />
                          </ProtectedRoute>
                        }
                      />
                    </Routes>
                  </div>
                </main>
              </div>
            ) : (
              <Login setToken={setToken} />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
