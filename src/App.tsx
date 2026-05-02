import { FC, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import About from "./components/About";
import AdminLayout from "./components/AdminLayout";
import Banner from "./components/Banner";
import Blog from "./components/Blog";
import Dashboard from "./components/Dashboard";
import Developer from "./components/Developer";
import ErrorBoundary from "./components/ErrorBoundary";
import Feature from "./components/Feature";
import Login from "./components/Login";
import Project from "./components/Project";
import Users from "./components/Users";
import { ToastProvider } from "./context/ToastContext";
import AboutDetails from "./pages/AboutDetails";
import BlogDetails from "./pages/BlogDetails";
import LandingPage from "./pages/LandingPage";
import ProjectDetails from "./pages/ProjectDetails";
import ProtectedRoute from "./ProtectedRoute";
import RoleProtectedRoute from "./RoleProtectedRoute";
import { authStore } from "./store/authStore";

const App: FC = () => {
  const [token, setToken] = useState<string | null>(authStore.getToken());
  const [role, setRole] = useState<string | null>(authStore.getRole());

  return (
    <ErrorBoundary>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/blogs/:id" element={<BlogDetails />} />
            <Route path="/project/:id" element={<ProjectDetails />} />
            <Route path="/about/:id" element={<AboutDetails />} />
            <Route
              path="/login"
              element={<Login setToken={setToken} setRole={setRole} />}
            />

            <Route
              element={
                <ProtectedRoute token={token}>
                  <AdminLayout setToken={setToken} />
                </ProtectedRoute>
              }
            >
              <Route
                path="/dashboard"
                element={
                  <RoleProtectedRoute
                    role={role}
                    allowedRoles={["admin", "user"]}
                  >
                    <Dashboard />
                  </RoleProtectedRoute>
                }
              />
              <Route
                path="/developer"
                element={
                  <RoleProtectedRoute role={role} allowedRoles={["admin"]}>
                    <Developer />
                  </RoleProtectedRoute>
                }
              />
              <Route path="/project" element={<Project />} />
              <Route path="/banner" element={<Banner />} />
              <Route
                path="/features"
                element={
                  <RoleProtectedRoute role={role} allowedRoles={["admin"]}>
                    <Feature />
                  </RoleProtectedRoute>
                }
              />
              <Route path="/about" element={<About />} />
              <Route path="/blogs" element={<Blog />} />
              <Route
                path="/users"
                element={
                  <RoleProtectedRoute role={role} allowedRoles={["admin"]}>
                    <Users />
                  </RoleProtectedRoute>
                }
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </ErrorBoundary>
  );
};

export default App;
