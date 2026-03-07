import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../layouts/Layout";
export default function AboutDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [about, setAbout] = useState(null);
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    axios
      .get(
        `https://forthubapi-backend-production.up.railway.app/api/about/${id}`,
      )
      .then((res) => {
        const data = res.data;

        setAbout(data);

        // convert photos safely
        if (data.PhotoFileName) {
          if (typeof data.PhotoFileName === "string") {
            setPhotos(data.PhotoFileName.split(","));
          } else if (Array.isArray(data.PhotoFileName)) {
            setPhotos(data.PhotoFileName);
          }
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, [id]);

  if (!about) {
    return <div className="p-10 text-center">Loading about details...</div>;
  }

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 bg-gray-200 px-4 py-2 rounded"
        >
          ← Back
        </button>

        <h1 className="text-3xl font-bold mb-2 text-white">{about.Title}</h1>

        <p className="text-gray-300 mb-4">Feature: {about.Feature}</p>

        <p className="mb-6 text-white">{about.Description}</p>

        <div className="grid grid-cols-3 gap-4">
          {photos.map((photo, index) => (
            <img
              key={index}
              src={`http://localhost:5000/Photos/${photo}`}
              className="w-full h-64 object-cover rounded shadow"
            />
          ))}
        </div>
      </div>
    </Layout>
  );
}
