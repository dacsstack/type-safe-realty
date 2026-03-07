import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../layouts/Layout";
export default function BlogDetails() {
  const { id } = useParams();
  const [blogs, setBlogs] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/blogs/${id}`)
      .then((res) => res.json())
      .then((data) => setBlogs(data));
  }, [id]);

  if (!blogs) return <div>Loading...</div>;

  return (
    <Layout>
      <div className="container mx-auto py-16">
        <h1 className="text-4xl font-bold mb-6 text-white">{blogs.Title}</h1>

        {blogs.VideoUrl && (
          <div className="aspect-video mb-6">
            {/* <ReactPlayer
              url={blogs.VideoUrl}
              width="100%"
              height="100%"
              controls
            /> */}
            <iframe
              className="w-full h-full rounded-t-2xl"
              src={blogs.VideoUrl.replace("watch?v=", "embed/")}
              title="Blog Video"
              allowFullScreen
            />
          </div>
        )}

        <p className="text-gray-700 leading-relaxed text-white">
          {blogs.Description}
        </p>
      </div>
    </Layout>
  );
}
