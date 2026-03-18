import { ChangeEvent, FC, useCallback, useEffect, useState } from "react";
import { useToast } from "../context/ToastContext";
import { authStore } from "../store/authStore";
import type { Banner as BannerType, Developer } from "../types";
import { variables } from "../Variables";

interface ApiResponse {
  message: string;
  fileNames?: string[];
}

const Banner: FC = () => {
  const toast = useToast();
  const role = authStore.getRole();
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [banners, setBanners] = useState<BannerType[]>([]);
  const [modalTitle, setModalTitle] = useState<string>("");
  const [bannerId, setBannerId] = useState<number>(0);
  const [bannerName, setBannerName] = useState<string>("");
  const [developer, setDeveloper] = useState<string>("");
  const [bannerDetails, setBannerDetails] = useState<string>("");
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
      // Fetch Banners
      const bannersRes = await fetch(variables.API_URL + "banner", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!bannersRes.ok)
        throw new Error("Banner fetch error: " + bannersRes.status);
      const bannersData = await bannersRes.json();
      if (Array.isArray(bannersData)) setBanners(bannersData);
      else setBanners([]);
    } catch (err) {
      console.error(err);
    }

    try {
      // Fetch Developers
      const developersRes = await fetch(variables.API_URL + "developer", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!developersRes.ok)
        throw new Error("Developer fetch error: " + developersRes.status);
      const developersData = await developersRes.json();
      if (Array.isArray(developersData)) setDevelopers(developersData);
      else setDevelopers([]);
    } catch (err) {
      console.error(err);
    }
  }, [getToken]);

  useEffect(() => {
    refreshList();
  }, [refreshList]);

  const handleChangeBannerName = (e: ChangeEvent<HTMLInputElement>) =>
    setBannerName(e.target.value);
  const handleChangeDeveloper = (e: ChangeEvent<HTMLSelectElement>) =>
    setDeveloper(e.target.value);
  const handleChangeBannerDetails = (e: ChangeEvent<HTMLTextAreaElement>) =>
    setBannerDetails(e.target.value);
  const handleChangeDateOfJoining = (e: ChangeEvent<HTMLInputElement>) =>
    setDateOfJoining(e.target.value);

  const handleAddClick = useCallback(() => {
    setModalTitle("Add Banner");
    setBannerId(0);
    setBannerName("");
    setDeveloper("");
    setBannerDetails("");
    setDateOfJoining("");
    setPhotoFileName([]);
  }, []);

  const handleEditClick = useCallback((item: BannerType) => {
    const photos = item.PhotoFileName
      ? typeof item.PhotoFileName === "string"
        ? item.PhotoFileName.split(",")
        : item.PhotoFileName
      : [];

    setModalTitle("Edit Banner");
    setBannerId(item.BannerId);
    setBannerName(item.BannerName);
    setDeveloper(item.Developer || "");
    setBannerDetails(item.BannerDetails || "");
    setDateOfJoining(item.DateOfJoining || "");
    setPhotoFileName(photos);
  }, []);

  const handleCreateClick = useCallback(async () => {
    const token = getToken();
    if (!token) return;

    try {
      const res = await fetch(variables.API_URL + "banner", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          BannerName: bannerName,
          Developer: developer,
          BannerDetails: bannerDetails,
          DateOfJoining: dateOfJoining,
          PhotoFileName: photoFileName.join(","),
        }),
      });
      const result: ApiResponse = await res.json();
      toast.success(result.message);
      refreshList();
    } catch (err) {
      console.error(err);
      toast.error("Failed");
    }
  }, [
    bannerName,
    developer,
    bannerDetails,
    dateOfJoining,
    photoFileName,
    getToken,
    refreshList,
  ]);

  const handleUpdateClick = useCallback(async () => {
    const token = getToken();
    if (!token) return;

    const photos = Array.isArray(photoFileName)
      ? photoFileName.join(",")
      : photoFileName;

    try {
      const res = await fetch(variables.API_URL + "banner", {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          BannerId: bannerId,
          BannerName: bannerName,
          Developer: developer,
          BannerDetails: bannerDetails,
          DateOfJoining: dateOfJoining,
          PhotoFileName: photos,
        }),
      });
      const result: ApiResponse = await res.json();
      toast.success(result.message);
      refreshList();
    } catch (err) {
      console.error(err);
      toast.error("Failed");
    }
  }, [
    bannerId,
    bannerName,
    developer,
    bannerDetails,
    dateOfJoining,
    photoFileName,
    getToken,
    refreshList,
  ]);

  const handleDeleteClick = useCallback(
    async (id: number) => {
      const token = getToken();
      if (!token) return;

      if (!window.confirm("Are you sure?")) return;

      try {
        const res = await fetch(variables.API_URL + "banner/" + id, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        const result: ApiResponse = await res.json();
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
        const res = await fetch(variables.API_URL + "banner/savefile", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
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
        <h2 className="text-2xl font-bold">Banner</h2>
        <button
          onClick={handleAddClick}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
        >
          + Add Banner
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-white rounded-xl shadow mb-8">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 uppercase text-xs text-gray-600">
            <tr>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Developer</th>
              <th className="px-6 py-3">Details</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {banners.map((ban) => (
              <tr key={ban.BannerId} className="hover:bg-gray-50">
                <td className="px-6 py-4">{ban.BannerId}</td>
                <td className="px-6 py-4">{ban.BannerName}</td>
                <td className="px-6 py-4">{ban.Developer}</td>
                <td className="px-6 py-4">{ban.BannerDetails}</td>
                <td className="px-6 py-4">{ban.DateOfJoining}</td>
                <td className="px-6 py-4 flex justify-center gap-2">
                  <button
                    onClick={() => handleEditClick(ban)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-md"
                  >
                    Edit
                  </button>
                  {role === "admin" && (
                    <button
                      onClick={() => handleDeleteClick(ban.BannerId)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
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

      {/* FORM */}
      <div className="bg-white p-6 rounded-xl shadow max-w-8xl">
        <h3 className="text-lg font-semibold mb-6">{modalTitle}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* LEFT SIDE */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Banner Name
            </label>
            <input
              type="text"
              value={bannerName}
              onChange={handleChangeBannerName}
              className="w-full border rounded-lg p-2 mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <label className="block text-sm font-medium mb-1">Developer</label>
            <select
              onChange={handleChangeDeveloper}
              value={developer}
              className="w-full border rounded-lg p-2 mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Select Developer</option>
              {developers.map((dev) => (
                <option key={dev.DeveloperId} value={dev.DeveloperName}>
                  {dev.DeveloperName}
                </option>
              ))}
            </select>

            <label className="block text-sm font-medium mb-1">
              Banner Details
            </label>
            <textarea
              value={bannerDetails}
              onChange={handleChangeBannerDetails}
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
          {bannerId === 0 ? (
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

export default Banner;
