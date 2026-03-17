import axios from "axios";
import { FC, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../layouts/Layout";

interface ProjectData {
  ProjectId: number;
  ProjectName: string;
  Developer: string;
  PropertyDetails: string;
  PhotoFileName: string | string[];
  [key: string]: any;
}

const ProjectDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [project, setProject] = useState<ProjectData | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);

  useEffect(() => {
    axios
      .get(
        `https://forthubapi-backend-production.up.railway.app/api/project/${id}`,
      )
      .then((res) => {
        const data: ProjectData = res.data;
        setProject(data);

        // Convert photos safely to array
        if (data.PhotoFileName) {
          if (typeof data.PhotoFileName === "string") {
            setPhotos(data.PhotoFileName.split(","));
          } else if (Array.isArray(data.PhotoFileName)) {
            setPhotos(data.PhotoFileName);
          }
        }
      })
      .catch((err: Error) => {
        console.error("Error fetching project:", err);
      });
  }, [id]);

  if (!project) {
    return (
      <div className="p-10 text-center text-gray-400">
        Loading project details...
      </div>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 transition"
        >
          ← Back
        </button>

        <h1 className="text-3xl font-bold mb-2 text-white">
          {project.ProjectName}
        </h1>
        <p className="text-white mb-4">Developer: {project.Developer}</p>
        <p className="text-gray-300 mb-6">{project.PropertyDetails}</p>

        <div className="grid grid-cols-3 gap-4">
          {photos.map((photo: string, index: number) => (
            <img
              key={index}
              src={`https://forthubapi-backend-production.up.railway.app/Photos/${photo}`}
              alt={`${project.ProjectName} photo ${index + 1}`}
              className="w-full h-64 object-cover rounded shadow hover:shadow-lg transition"
            />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default ProjectDetails;
