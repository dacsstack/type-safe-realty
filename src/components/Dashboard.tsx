import axios from "axios";
import { FC, useEffect, useState } from "react";

interface Stats {
  totalProjects: number;
  totalDevelopers: number;
  totalInquiries: number;
}

interface ProjectData {
  ProjectId: number;
  ProjectName: string;
  Developer: string;
}

interface InquiryData {
  InquiryId: number;
  Name: string;
  Email: string;
  Message: string;
}

const Dashboard: FC = () => {
  const [stats, setStats] = useState<Stats>({
    totalProjects: 0,
    totalDevelopers: 0,
    totalInquiries: 0,
  });

  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [inquiries, setInquiries] = useState<InquiryData[]>([]);

  const API = axios.create({
    baseURL: "https://forthubapi-backend-production.up.railway.app/api",
  });

  API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  const deleteInquiry = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this inquiry?"))
      return;

    try {
      await API.delete(`/inquiry/${id}`);

      // remove from UI
      setInquiries(inquiries.filter((i) => i.InquiryId !== id));
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await API.get("/dashboard/stats");
        setStats(statsRes.data);

        const projectRes = await API.get("/project");
        setProjects(projectRes.data);

        const inquiryRes = await API.get("/inquiry");
        setInquiries(inquiryRes.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-600 text-white p-6 rounded-xl shadow">
          <h3>Total Projects</h3>
          <p className="text-3xl font-bold">{stats.totalProjects}</p>
        </div>

        <div className="bg-green-600 text-white p-6 rounded-xl shadow">
          <h3>Total Developers</h3>
          <p className="text-3xl font-bold">{stats.totalDevelopers}</p>
        </div>

        <div className="bg-orange-600 text-white p-6 rounded-xl shadow">
          <h3>Total Inquiries</h3>
          <p className="text-3xl font-bold">{stats.totalInquiries}</p>
        </div>
      </div>

      {/* RECENT PROJECTS */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">Recent Projects</h2>

        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">Name</th>
              <th className="text-left p-2">Developer</th>
            </tr>
          </thead>

          <tbody>
            {projects.map((p) => (
              <tr key={p.ProjectId} className="border-b">
                <td className="p-2">{p.ProjectName}</td>
                <td className="p-2">{p.Developer}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* RECENT INQUIRIES */}
      <div className="bg-white p-6 rounded-xl shadow mt-8">
        <h2 className="text-xl font-bold mb-4">Recent Inquiries</h2>

        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">Name</th>
              <th className="text-left p-2">Email</th>
              <th className="text-left p-2">Message</th>
              <th className="text-left p-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {inquiries.map((i) => (
              <tr key={i.InquiryId} className="border-b">
                <td className="p-2">{i.Name}</td>
                <td className="p-2">{i.Email}</td>
                <td className="p-2 truncate">{i.Message}</td>
                <td className="p-2">
                  <button
                    onClick={() => deleteInquiry(i.InquiryId)}
                    className="px-3 py-1 bg-red-600 text-white rounded text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
