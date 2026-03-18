import { ChangeEvent, FC, useCallback, useEffect, useState } from "react";
import { useToast } from "../context/ToastContext";
import type { About as AboutType } from "../types";
import { variables } from "../Variables";

interface Feature {
  FeatureId: number;
  FeatureProfileName: string;
}

interface ApiResponse {
  message: string;
  fileNames?: string[];
}

const About: FC = () => {
  const toast = useToast();
  const [features, setFeatures] = useState<Feature[]>([]);
  const [about, setAbout] = useState<AboutType[]>([]);
  const [modalTitle, setModalTitle] = useState<string>("Add About");
  const [aboutId, setAboutId] = useState<number>(0);
  const [title, setTitle] = useState<string>("");
  const [feature, setFeature] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [dateOfJoining, setDateOfJoining] = useState<string>("");
  const [photoFileName, setPhotoFileName] = useState<string[]>([]);
  const photoPath = variables.PHOTO_URL;

  const getToken = useCallback((): string | null => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return null;
    }
    return token;
  }, []);

  const refreshList = useCallback(async (): Promise<void> => {
    const token = getToken();
    if (!token) return;

    try {
      // Fetch About
      const aboutRes = await fetch(variables.API_URL + "about", {
        cache: "no-store",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!aboutRes.ok)
        throw new Error("About fetch error: " + aboutRes.status);
      const aboutData = await aboutRes.json();
      if (Array.isArray(aboutData)) setAbout(aboutData);
      else setAbout([]);
    } catch (err) {
      console.error(err);
    }

    try {
      // Fetch Features
      const featuresRes = await fetch(variables.API_URL + "features", {
        cache: "no-store",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!featuresRes.ok)
        throw new Error("Features fetch error: " + featuresRes.status);
      const featuresData = await featuresRes.json();
      if (Array.isArray(featuresData)) setFeatures(featuresData);
      else setFeatures([]);
    } catch (err) {
      console.error(err);
    }
  }, [getToken]);

  useEffect(() => {
    refreshList();
  }, [refreshList]);

  const handleChangeTitle = (e: ChangeEvent<HTMLInputElement>) =>
    setTitle(e.target.value);
  const handleChangeFeature = (e: ChangeEvent<HTMLSelectElement>) =>
    setFeature(e.target.value);
  const handleChangeDescription = (e: ChangeEvent<HTMLTextAreaElement>) =>
    setDescription(e.target.value);
  const handleChangeDateOfJoining = (e: ChangeEvent<HTMLInputElement>) =>
    setDateOfJoining(e.target.value);

  const handleAddClick = useCallback(() => {
    setModalTitle("Add About");
    setAboutId(0);
    setTitle("");
    setFeature("");
    setDescription("");
    setDateOfJoining("");
    setPhotoFileName([]);
  }, []);

  const handleEditClick = useCallback((item: AboutType) => {
    const photos = item.PhotoFileName
      ? typeof item.PhotoFileName === "string"
        ? item.PhotoFileName.split(",")
        : item.PhotoFileName
      : [];

    setModalTitle("Edit About");
    setAboutId(item.AboutId);
    setTitle(item.Title);
    setFeature(item.Feature || "");
    setDescription(item.Description || "");
    setDateOfJoining(item.DateOfJoining || "");
    setPhotoFileName(photos);
  }, []);

  const handleCreateClick = useCallback(async () => {
    const token = getToken();
    if (!token) return;

    try {
      const res = await fetch(variables.API_URL + "about", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          Title: title,
          Feature: feature,
          Description: description,
          DateOfJoining: dateOfJoining,
          PhotoFileName: photoFileName.join(","),
        }),
      });
      const result: ApiResponse = await res.json();
      if (!res.ok) {
        toast.error(result.message || "Failed to create about item");
        return;
      }

      toast.success(result.message);
      handleAddClick();
      refreshList();
    } catch (err) {
      console.error(err);
      toast.error("Failed");
    }
  }, [
    title,
    feature,
    description,
    dateOfJoining,
    photoFileName,
    getToken,
    handleAddClick,
    refreshList,
  ]);

  const handleUpdateClick = useCallback(async () => {
    const token = getToken();
    if (!token) return;

    const photos = [...photoFileName];

    try {
      const res = await fetch(variables.API_URL + "about", {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          AboutId: aboutId,
          Title: title,
          Feature: feature,
          Description: description,
          DateOfJoining: dateOfJoining,
          PhotoFileName: photos.join(","),
        }),
      });
      const result: ApiResponse = await res.json();
      if (!res.ok) {
        toast.error(result.message || "Failed to update about item");
        return;
      }

      setAbout((current) =>
        current.map((item) =>
          item.AboutId === aboutId
            ? {
                ...item,
                Title: title,
                Feature: feature || undefined,
                Description: description || undefined,
                DateOfJoining: dateOfJoining || undefined,
                PhotoFileName: photos,
              }
            : item,
        ),
      );

      toast.success(result.message);
      handleAddClick();
      refreshList();
    } catch (err) {
      console.error(err);
      toast.error("Failed");
    }
  }, [
    aboutId,
    title,
    feature,
    description,
    dateOfJoining,
    photoFileName,
    getToken,
    handleAddClick,
    refreshList,
  ]);

  const handleDeleteClick = useCallback(
    async (id: number) => {
      const token = getToken();
      if (!token) return;

      if (!window.confirm("Are you sure?")) return;

      try {
        const res = await fetch(variables.API_URL + "about/" + id, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        const result: ApiResponse = await res.json();
        if (!res.ok) {
          toast.error(result.message || "Failed to delete about item");
          return;
        }

        toast.success(result.message);
        refreshList();
      } catch (err) {
        console.error(err);
        toast.error("Failed");
      }
    },
    [getToken, refreshList],
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
        const res = await fetch(variables.API_URL + "about/savefile", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });

        if (!res.ok) {
          const result: ApiResponse = await res.json();
          toast.error(result.message || "Failed to upload about images");
          return;
        }

        const data: ApiResponse = await res.json();

        if (data.fileNames) {
          setPhotoFileName((prev) => [...prev, ...data.fileNames!]);
        }
      } catch (err) {
        console.error(err);
      }
    },
    [getToken],
  );

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">About</h2>
        <button
          onClick={handleAddClick}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
        >
          + Add About
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-white rounded-xl shadow mb-8">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 uppercase text-xs text-gray-600">
            <tr>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Title</th>
              <th className="px-6 py-3">Feature</th>
              <th className="px-6 py-3">Description</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {about.map((item) => (
              <tr key={item.AboutId} className="hover:bg-gray-50">
                <td className="px-6 py-4">{item.AboutId}</td>
                <td className="px-6 py-4">{item.Title}</td>
                <td className="px-6 py-4">{item.Feature}</td>
                <td className="px-6 py-4">{item.Description}</td>
                <td className="px-6 py-4">{item.DateOfJoining}</td>
                <td className="px-6 py-4 flex justify-center gap-2">
                  <button
                    onClick={() => handleEditClick(item)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-md"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(item.AboutId)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FORM */}
      <div className="bg-white p-6 rounded-xl shadow max-w-8xl">
        <h3 className="text-lg font-semibold mb-6">{modalTitle}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LEFT SIDE */}
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={handleChangeTitle}
              className="w-full border rounded-lg p-2 mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <label className="block text-sm font-medium mb-1">Feature</label>
            <select
              onChange={handleChangeFeature}
              value={feature}
              className="w-full border rounded-lg p-2 mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Select Feature</option>
              {features.map((feat) => (
                <option key={feat.FeatureId} value={feat.FeatureProfileName}>
                  {feat.FeatureProfileName}
                </option>
              ))}
            </select>

            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={handleChangeDescription}
              className="w-full border rounded-lg p-2 mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              value={dateOfJoining}
              onChange={handleChangeDateOfJoining}
              className="w-full border rounded-lg p-2 mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* RIGHT SIDE: MULTIPLE IMAGES */}
          <div className="flex flex-col items-center">
            {photoFileName.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-4">
                {photoFileName.map((file, i) => (
                  <div key={i} className="relative group">
                    <img
                      src={photoPath + file}
                      alt={file}
                      className="w-24 h-24 object-cover rounded-lg border shadow"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setPhotoFileName((prev) =>
                          prev.filter((_, idx) => idx !== i),
                        )
                      }
                      className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remove image"
                    >
                      ×
                    </button>
                    <p className="text-xs text-gray-500 mt-1 max-w-24 truncate">
                      {file}
                    </p>
                  </div>
                ))}
              </div>
            )}
            <input
              type="file"
              multiple
              onChange={handleImageUpload}
              className="border p-2 rounded-lg"
            />
          </div>
        </div>

        {/* BUTTON */}
        <div className="mt-6">
          {aboutId === 0 ? (
            <button
              onClick={handleCreateClick}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
            >
              Create
            </button>
          ) : (
            <button
              onClick={handleUpdateClick}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
            >
              Update
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default About;
