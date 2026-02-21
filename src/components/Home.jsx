import { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { variables } from "../Variables.jsx";

export default function Home() {
  const [projects, setProjects] = useState([]);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(variables.API_URL + "employee", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch projects");

      const data = await res.json();
      setProjects(data);
    } catch (err) {
      console.error(err);
      setProjects([]);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  if (!projects.length) {
    return <p className="text-center mt-10 text-gray-500">No projects found</p>;
  }

  // Carousel settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: true,
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">Our Projects</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((proj) => {
          const photos = proj.PhotoFileName
            ? proj.PhotoFileName.split(",")
            : [];
          const mainPhoto = photos[0] || "default-project.jpg";

          return (
            <div
              key={proj.EmployeeId}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              {/* Carousel */}
              <div className="w-full h-64 overflow-hidden">
                {photos.length > 1 ? (
                  <Slider {...settings}>
                    {photos.map((photo, index) => (
                      <img
                        key={index}
                        src={variables.PHOTO_URL + photo}
                        alt={`Project ${proj.EmployeeName} ${index + 1}`}
                        className="w-full h-64 object-cover rounded-t-xl"
                      />
                    ))}
                  </Slider>
                ) : (
                  <img
                    src={variables.PHOTO_URL + mainPhoto}
                    alt={proj.EmployeeName}
                    className="w-full h-64 object-cover rounded-t-xl"
                  />
                )}
              </div>

              {/* Project Info */}
              <div className="p-4">
                <h3 className="font-semibold text-lg">{proj.EmployeeName}</h3>
                <p className="text-gray-500">{proj.Department}</p>
                <p className="text-gray-400 text-sm">
                  Date of Listing: {proj.DateOfJoining}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
