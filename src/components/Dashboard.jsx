import axios from "axios";
import { useEffect, useState } from "react";
import { variables } from "../Variables.jsx";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalDevelopers: 0,
    totalInquiries: 0,
  });

  const [projects, setProjects] = useState([]);
  const [inquiries, setInquiries] = useState([]);

  useEffect(() => {
    axios
      .get(`${variables.API_URL}/developer/dashboard/stats`)
      .then((res) => setStats(res.data))
      .catch(console.error);

    axios
      .get(`${variables.API_URL}/project`)
      .then((res) => setProjects(res.data))
      .catch(console.error);

    axios
      .get(`${variables.API_URL}/inquiry`)
      .then((res) => setInquiries(res.data))
      .catch(console.error);
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
            {projects.slice(0, 5).map((p) => (
              <tr key={p.ProjectId} className="border-b">
                <td className="p-2">{p.ProjectName}</td>
                <td className="p-2">{p.Developer}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* RECENT INQUIRIES */}
      <div className="mt-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-4">Recent Inquiries</h2>

          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Name</th>
                <th className="text-left p-2">Email</th>
                <th className="text-left p-2">Contact</th>
                <th className="text-left p-2">Message</th>
              </tr>
            </thead>

            <tbody>
              {inquiries.slice(0, 5).map((i) => (
                <tr key={i.InquiryId} className="border-b">
                  <td className="p-2">{i.Name}</td>
                  <td className="p-2">{i.Email}</td>
                  <td className="p-2">{i.Contact}</td>
                  <td className="p-2">{i.Message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
