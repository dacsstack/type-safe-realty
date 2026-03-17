import { FC, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import About from "./components/About";
import AdminLayout from "./components/AdminLayout";
import Banner from "./components/Banner";
import Blog from "./components/Blog";
import Dashboard from "./components/Dashboard";
import Developer from "./components/Developer";
import Feature from "./components/Feature";
import Login from "./components/Login";
import Project from "./components/Project";
import AboutDetails from "./pages/AboutDetails";
import BlogDetails from "./pages/BlogDetails";
import LandingPage from "./pages/LandingPage";
import ProjectDetails from "./pages/ProjectDetails";
import ProtectedRoute from "./ProtectedRoute";
import { authStore } from "./store/authStore";

const App: FC = () => {
  const [token, setToken] = useState<string | null>(authStore.getToken());

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/blogs/:id" element={<BlogDetails />} />
        <Route path="/project/:id" element={<ProjectDetails />} />
        <Route path="/about/:id" element={<AboutDetails />} />
        <Route path="/login" element={<Login setToken={setToken} />} />

        <Route
          element={
            <ProtectedRoute token={token}>
              <AdminLayout setToken={setToken} />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/developer" element={<Developer />} />
          <Route path="/project" element={<Project />} />
          <Route path="/banner" element={<Banner />} />
          <Route path="/features" element={<Feature />} />
          <Route path="/about" element={<About />} />
          <Route path="/blogs" element={<Blog />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
