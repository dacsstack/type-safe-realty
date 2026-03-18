import { ChangeEvent, FC, useCallback, useEffect, useState } from "react";
import { useToast } from "../context/ToastContext";
import { authStore } from "../store/authStore";
import { variables } from "../Variables";

interface DeveloperOption {
  DeveloperId: number;
  DeveloperName: string;
}

interface ProjectData {
  ProjectId: number;
  ProjectName: string;
  Developer: string;
  PropertyDetails: string;
  DateOfJoining: string;
  PhotoFileName: string | string[];
  Location: string;
  Price: number | null;
  PropertyType: string | null;
  Latitude: number | null;
  Longitude: number | null;
}

interface ApiResponse {
  message: string;
  fileNames?: string[];
}

const Project: FC = () => {
  const toast = useToast();
  const role = authStore.getRole();
  const [developers, setDevelopers] = useState<DeveloperOption[]>([]);
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(false);

  const [modalTitle, setModalTitle] = useState("Add Property");
  const [projectId, setProjectId] = useState(0);
  const [projectName, setProjectName] = useState("");
  const [developer, setDeveloper] = useState("");
  const [propertyDetails, setPropertyDetails] = useState("");
  const [dateOfJoining, setDateOfJoining] = useState("");
  const [photoFileName, setPhotoFileName] = useState<string[]>([]);
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const getToken = useCallback((): string | null => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return null;
    }
    return token;
  }, []);

  const refreshList = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    setLoading(true);
    try {
      const [projectsRes, devsRes] = await Promise.all([
        fetch(variables.API_URL + "project", {
          cache: "no-store",
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(variables.API_URL + "developer", {
          cache: "no-store",
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (!projectsRes.ok)
        throw new Error("Projects fetch error: " + projectsRes.status);
      if (!devsRes.ok)
        throw new Error("Developers fetch error: " + devsRes.status);

      const projectsData: unknown = await projectsRes.json();
      const devsData: unknown = await devsRes.json();

      setProjects(
        Array.isArray(projectsData) ? (projectsData as ProjectData[]) : [],
      );
      setDevelopers(
        Array.isArray(devsData) ? (devsData as DeveloperOption[]) : [],
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    refreshList();
  }, [refreshList]);

  const resetForm = useCallback(() => {
    setModalTitle("Add Property");
    setProjectId(0);
    setProjectName("");
    setDeveloper("");
    setPropertyDetails("");
    setDateOfJoining("");
    setPhotoFileName([]);
    setLocation("");
    setPrice("");
    setPropertyType("");
    setLatitude("");
    setLongitude("");
  }, []);

  const handleEditClick = useCallback((item: ProjectData) => {
    const photos = item.PhotoFileName
      ? typeof item.PhotoFileName === "string"
        ? item.PhotoFileName.split(",")
        : item.PhotoFileName
      : [];

    setModalTitle("Edit Property");
    setProjectId(item.ProjectId);
    setProjectName(item.ProjectName);
    setDeveloper(item.Developer ?? "");
    setPropertyDetails(item.PropertyDetails ?? "");
    setDateOfJoining(item.DateOfJoining ?? "");
    setPhotoFileName(photos);
    setLocation(item.Location ?? "");
    setPrice(item.Price != null ? String(item.Price) : "");
    setPropertyType(item.PropertyType ?? "");
    setLatitude(item.Latitude != null ? String(item.Latitude) : "");
    setLongitude(item.Longitude != null ? String(item.Longitude) : "");
  }, []);

  const buildPayload = useCallback(
    () => ({
      ProjectName: projectName,
      Developer: developer,
      PropertyDetails: propertyDetails,
      DateOfJoining: dateOfJoining,
      PhotoFileName: photoFileName.join(","),
      Location: location,
      Price: price ? Number(price) : null,
      PropertyType: propertyType || null,
      Latitude: latitude ? Number(latitude) : null,
      Longitude: longitude ? Number(longitude) : null,
    }),
    [
      projectName,
      developer,
      propertyDetails,
      dateOfJoining,
      photoFileName,
      location,
      price,
      propertyType,
      latitude,
      longitude,
    ],
  );

  const handleCreate = useCallback(async () => {
    if (!projectName.trim()) {
      toast.error("Please enter a project name");
      return;
    }
    const token = getToken();
    if (!token) return;
    try {
      const res = await fetch(variables.API_URL + "project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(buildPayload()),
      });
      const result: ApiResponse = await res.json();
      if (!res.ok) {
        toast.error(result.message || "Failed to create project");
        return;
      }
      toast.success(result.message || "Project created");
      resetForm();
      refreshList();
    } catch {
      toast.error("Error creating project");
    }
  }, [projectName, getToken, buildPayload, toast, resetForm, refreshList]);

  const handleUpdate = useCallback(async () => {
    if (!projectName.trim()) {
      toast.error("Please enter a project name");
      return;
    }
    const token = getToken();
    if (!token) return;
    try {
      const res = await fetch(variables.API_URL + "project", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ProjectId: projectId, ...buildPayload() }),
      });
      const result: ApiResponse = await res.json();
      if (!res.ok) {
        toast.error(result.message || "Failed to update project");
        return;
      }
      toast.success(result.message || "Project updated");
      resetForm();
      refreshList();
    } catch {
      toast.error("Error updating project");
    }
  }, [
    projectName,
    projectId,
    getToken,
    buildPayload,
    toast,
    resetForm,
    refreshList,
  ]);

  const handleDelete = useCallback(
    async (id: number) => {
      if (!window.confirm("Are you sure you want to delete this project?"))
        return;
      const token = getToken();
      if (!token) return;
      try {
        const res = await fetch(variables.API_URL + `project/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        const result: ApiResponse = await res.json();
        if (!res.ok) {
          toast.error(result.message || "Failed to delete project");
          return;
        }
        toast.success(result.message || "Project deleted");
        refreshList();
      } catch {
        toast.error("Error deleting project");
      }
    },
    [getToken, toast, refreshList],
  );

  const handleImageUpload = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      const token = getToken();
      if (!token) return;
      const files = e.target.files;
      if (!files || !files.length) return;
      const formData = new FormData();
      for (const file of files) {
        formData.append("files", file, file.name);
      }
      try {
        const res = await fetch(variables.API_URL + "project/savefile", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        if (!res.ok) {
          const result: ApiResponse = await res.json();
          toast.error(result.message || "Failed to upload images");
          return;
        }
        const data: ApiResponse = await res.json();
        if (data.fileNames) {
          setPhotoFileName((prev) => [...prev, ...data.fileNames!]);
        }
      } catch {
        toast.error("Error uploading images");
      }
    },
    [getToken, toast],
  );

  const handleRemovePhoto = useCallback((name: string) => {
    setPhotoFileName((prev) => prev.filter((p) => p !== name));
  }, []);

  const getPhotos = (item: ProjectData): string[] => {
    if (!item.PhotoFileName) return [];
    if (typeof item.PhotoFileName === "string")
      return item.PhotoFileName.split(",").filter(Boolean);
    return item.PhotoFileName.filter(Boolean);
  };

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Projects / Properties</h2>
        <button
          onClick={resetForm}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white shadow hover:bg-blue-700"
        >
          + Add Property
        </button>
      </div>

      {/* TABLE */}
      {loading ? (
        <p className="py-4 text-gray-500">Loading...</p>
      ) : (
        <div className="mb-8 overflow-x-auto rounded-xl bg-white shadow">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-100 text-xs uppercase text-gray-600">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Developer</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Photos</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {projects.map((item) => (
                <tr key={item.ProjectId} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{item.ProjectId}</td>
                  <td className="px-4 py-3">{item.ProjectName}</td>
                  <td className="px-4 py-3">{item.Developer}</td>
                  <td className="px-4 py-3">{item.Location}</td>
                  <td className="px-4 py-3">
                    {item.Price != null
                      ? `₱${item.Price.toLocaleString()}`
                      : "—"}
                  </td>
                  <td className="px-4 py-3">{item.PropertyType ?? "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {getPhotos(item).map((photo) => (
                        <img
                          key={photo}
                          src={variables.PHOTO_URL + photo}
                          alt={photo}
                          className="h-12 w-12 rounded object-cover"
                        />
                      ))}
                    </div>
                  </td>
                  <td className="flex justify-center gap-2 px-4 py-3">
                    <button
                      onClick={() => handleEditClick(item)}
                      className="rounded bg-yellow-400 px-3 py-1 text-white hover:bg-yellow-500"
                    >
                      Edit
                    </button>
                    {role === "admin" && (
                      <button
                        onClick={() => handleDelete(item.ProjectId)}
                        className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* FORM */}
      <div className="max-w-4xl rounded-xl bg-white p-6 shadow">
        <h3 className="mb-6 text-lg font-semibold">{modalTitle}</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Left column */}
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">
                Project Name
              </label>
              <input
                type="text"
                value={projectName}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setProjectName(e.target.value)
                }
                className="w-full rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Project name"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                Developer
              </label>
              <select
                value={developer}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setDeveloper(e.target.value)
                }
                className="w-full rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">— Select Developer —</option>
                {developers.map((d) => (
                  <option key={d.DeveloperId} value={d.DeveloperName}>
                    {d.DeveloperName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                Property Details
              </label>
              <textarea
                value={propertyDetails}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                  setPropertyDetails(e.target.value)
                }
                rows={3}
                className="w-full rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Property details..."
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Date</label>
              <input
                type="date"
                value={dateOfJoining}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setDateOfJoining(e.target.value)
                }
                className="w-full rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setLocation(e.target.value)
                }
                className="w-full rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Location"
              />
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">
                Price (₱)
              </label>
              <input
                type="number"
                value={price}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setPrice(e.target.value)
                }
                className="w-full rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                Property Type
              </label>
              <select
                value={propertyType}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setPropertyType(e.target.value)
                }
                className="w-full rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">— Select Type —</option>
                <option value="House and Lot">House and Lot</option>
                <option value="Condominium">Condominium</option>
                <option value="Townhouse">Townhouse</option>
                <option value="Lot Only">Lot Only</option>
                <option value="Commercial">Commercial</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Latitude</label>
              <input
                type="number"
                step="any"
                value={latitude}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setLatitude(e.target.value)
                }
                className="w-full rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. 14.5995"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                Longitude
              </label>
              <input
                type="number"
                step="any"
                value={longitude}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setLongitude(e.target.value)
                }
                className="w-full rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. 120.9842"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Photos</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="w-full rounded-lg border p-2"
              />
              {photoFileName.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {photoFileName.map((photo) => (
                    <div key={photo} className="group relative">
                      <img
                        src={variables.PHOTO_URL + photo}
                        alt={photo}
                        className="h-24 w-24 rounded object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(photo)}
                        className="absolute top-0 right-0 hidden h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs text-white group-hover:flex"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-6 flex gap-3">
          {projectId === 0 ? (
            <button
              onClick={handleCreate}
              className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
            >
              Create
            </button>
          ) : (
            <button
              onClick={handleUpdate}
              className="rounded-lg bg-green-600 px-6 py-2 text-white hover:bg-green-700"
            >
              Update
            </button>
          )}
          <button
            onClick={resetForm}
            className="rounded-lg border px-6 py-2 text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Project;
