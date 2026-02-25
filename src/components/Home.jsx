import { useEffect, useState } from "react";
import { variables } from "../Variables.jsx";

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // Fetch projects and departments
  const fetchData = async () => {
    if (!token) return;

    try {
      // Fetch Projects
      const resProj = await fetch(variables.API_URL + "employee", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const projData = await resProj.json();
      setProjects(projData || []);

      // Fetch Departments
      const resDept = await fetch(variables.API_URL + "department", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const deptData = await resDept.json();
      setDepartments(deptData || []);

      setLoading(false);
    } catch (err) {
      console.error("Fetch error:", err);
      setProjects([]);
      setDepartments([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Utility to get department name
  const getDepartmentName = (depId) => {
    const dep = departments.find((d) => d.DepartmentId === depId);
    return dep ? dep.DepartmentName : "";
  };

  if (loading) return <div className="text-center p-10">Loading...</div>;

  return (
    <div className="space-y-10">
      {/* DASHBOARD STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-600 text-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-2">Total Projects</h2>
          <p className="text-3xl font-bold">{projects.length}</p>
        </div>
        <div className="bg-green-600 text-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-2">Total Developers</h2>
          <p className="text-3xl font-bold">{departments.length}</p>
        </div>
      </div>

      {/* PROJECTS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((proj) => (
          <div
            key={proj.EmployeeId}
            className="bg-white rounded-xl shadow overflow-hidden hover:shadow-lg transition"
          >
            {/* PROJECT IMAGE */}
            {proj.PhotoFileName ? (
              <img
                src={variables.PHOTO_URL + proj.PhotoFileName}
                alt={proj.EmployeeName}
                className="w-full h-48 object-cover"
              />
            ) : (
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}

            {/* PROJECT INFO */}
            <div className="p-4">
              <h3 className="text-lg font-semibold">{proj.EmployeeName}</h3>
              <p className="text-gray-600">Developer: {proj.Department}</p>
              <p className="text-gray-500 text-sm">
                Date of Listing: {proj.DateOfJoining}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
