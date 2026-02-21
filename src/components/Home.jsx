import { useEffect, useState } from "react";
import { variables } from "../Variables.jsx";

export default function Home() {
  const [projects, setProjects] = useState([]);

  // Fetch projects from API
  const fetchProjects = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(variables.API_URL + "employee", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch projects");

      const data = await res.json();

      // Ensure PhotoFileName is array
      const formattedData = data.map((proj) => {
        let photos = [];
        if (Array.isArray(proj.PhotoFileName)) {
          photos = proj.PhotoFileName;
        } else if (proj.PhotoFileName) {
          photos = proj.PhotoFileName.split(","); // comma-separated
        }
        return { ...proj, photos };
      });

      setProjects(formattedData);
    } catch (err) {
      console.error(err);
      setProjects([]);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">
        Available Projects
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((proj) => (
          <div
            key={proj.EmployeeId}
            className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
          >
            {/* Image slider / show first image */}
            <div className="h-48 w-full overflow-hidden">
              {proj.photos.length > 0 ? (
                <img
                  src={variables.PHOTO_URL + proj.photos[0]}
                  alt={proj.EmployeeName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                  No Image
                </div>
              )}
            </div>

            {/* Project info */}
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-1">
                {proj.EmployeeName}
              </h3>
              <p className="text-gray-600 mb-1">Developer: {proj.Department}</p>
              <p className="text-gray-600 text-sm">
                Date Listed: {proj.DateOfJoining}
              </p>

              {/* Optional: show multiple images */}
              {proj.photos.length > 1 && (
                <div className="flex gap-2 mt-2 overflow-x-auto">
                  {proj.photos.map((photo, index) => (
                    <img
                      key={index}
                      src={variables.PHOTO_URL + photo}
                      alt={proj.EmployeeName + "-" + index}
                      className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
