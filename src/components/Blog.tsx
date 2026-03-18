import axios from "axios";
import { FC, useEffect, useState } from "react";
import { useToast } from "../context/ToastContext";
import { authStore } from "../store/authStore";
import type { Blog } from "../types";
import { variables } from "../Variables";

const BlogAdmin: FC = () => {
  const toast = useToast();
  const role = authStore.getRole();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [editing, setEditing] = useState<Blog | null>(null);
  const [form, setForm] = useState<Omit<Blog, "BlogId">>({
    Title: "",
    Description: "",
    VideoUrl: "",
  });

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Not logged in");
      return null;
    }
    return { Authorization: `Bearer ${token}` };
  };

  // Fetch blogs
  const fetchBlogs = async () => {
    try {
      const res = await axios.get<Blog[]>(variables.API_URL + "blogs");
      setBlogs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // CREATE or UPDATE blog
  const handleSubmit = async () => {
    const headers = getAuthHeader();
    if (!headers) return;
    try {
      if (editing) {
        await axios.put(
          variables.API_URL + "blogs",
          { ...form, BlogId: editing.BlogId },
          { headers },
        );
      } else {
        await axios.post(variables.API_URL + "blogs", form, { headers });
      }
      setForm({ Title: "", Description: "", VideoUrl: "" });
      setEditing(null);
      fetchBlogs();
    } catch (err) {
      console.error(err);
      toast.error("Save failed. Check console for details.");
    }
  };

  // DELETE blog
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;
    const headers = getAuthHeader();
    if (!headers) return;
    try {
      await axios.delete(variables.API_URL + `blogs/${id}`, { headers });
      fetchBlogs();
    } catch (err) {
      console.error(err);
    }
  };

  // Edit blog
  const handleEdit = (blog: Blog) => {
    setEditing(blog);
    setForm({
      Title: blog.Title,
      Description: blog.Description || "",
      VideoUrl: blog.VideoUrl || "",
    });
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Blog Admin Portal</h1>

      <div className="mb-6 p-4 border rounded shadow">
        <h2 className="text-xl font-semibold mb-2">
          {editing ? "Edit Blog" : "Add New Blog"}
        </h2>

        <input
          type="text"
          placeholder="Title"
          value={form.Title}
          onChange={(e) => setForm({ ...form, Title: e.target.value })}
          className="border p-2 rounded w-full mb-2"
        />

        <textarea
          placeholder="Description"
          value={form.Description || ""}
          onChange={(e) => setForm({ ...form, Description: e.target.value })}
          className="border p-2 rounded w-full mb-2"
        />

        <input
          type="text"
          placeholder="Video URL (optional)"
          value={form.VideoUrl || ""}
          onChange={(e) => setForm({ ...form, VideoUrl: e.target.value })}
          className="border p-2 rounded w-full mb-2"
        />

        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
        >
          {editing ? "Update Blog" : "Add Blog"}
        </button>

        {editing && (
          <button
            onClick={() => {
              setEditing(null);
              setForm({ Title: "", Description: "", VideoUrl: "" });
            }}
            className="ml-2 bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition"
          >
            Cancel
          </button>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {blogs.map((b) => (
          <div
            key={b.BlogId}
            className="p-4 border rounded shadow flex justify-between items-center"
          >
            <div>
              <h3 className="font-bold">{b.Title}</h3>
              <p className="text-sm text-gray-600">{b.Description}</p>
              {b.VideoUrl && (
                <p className="text-blue-600 text-sm">Video: {b.VideoUrl}</p>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(b)}
                className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 transition"
              >
                Edit
              </button>
              {role === "admin" && (
                <button
                  onClick={() => handleDelete(b.BlogId)}
                  className="bg-red-600 text-white p-2 rounded hover:bg-red-700 transition"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogAdmin;
