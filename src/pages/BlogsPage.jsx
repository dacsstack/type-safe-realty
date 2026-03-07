// src/pages/BlogsPage.tsx
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function BlogsPage() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/blogs")
      .then((res) => setBlogs(res.data))
      .catch(console.error);
  }, []);

  return (
    <div className="container mx-auto py-16">
      <h2 className="text-4xl font-bold mb-8">All Blogs</h2>

      <div className="grid md:grid-cols-3 gap-10">
        {blogs.map((b) => (
          <div
            key={b.BlogId}
            className="border-white/30 text-white rounded-xl p-3 bg-white/10 focus:outline-none focus:border-white"
          >
            {b.VideoUrl ? (
              <div className="aspect-video overflow-hidden">
                <img
                  src={`https://img.youtube.com/vi/${b.VideoUrl.split("v=")[1]}/hqdefault.jpg`}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <img
                src={`https://forthubapi-backend-production.up.railway.app/uploads/${b.Image}`}
                alt={b.Title}
                className="w-full h-52 object-cover"
              />
            )}

            <div className="p-6">
              <p className="text-gray-400 text-sm">
                {new Date(b.CreatedAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>

              <h3 className="text-lg font-bold mb-3">{b.Title}</h3>
              <p className="text-gray-200 text-sm line-clamp-3">
                {b.Description}
              </p>

              <button
                onClick={() => navigate(`/blogs/${b.BlogId}`)}
                className="mt-4 text-blue-200 font-semibold hover:underline"
              >
                Read More →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
