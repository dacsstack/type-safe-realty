import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useToast } from "../context/ToastContext";
import { authStore } from "../store/authStore";
import { variables } from "../Variables";

interface FeatureData {
  FeatureId: number;
  FeatureProfileName: string;
}

const Feature: FC = () => {
  const toast = useToast();
  const [features, setFeatures] = useState<FeatureData[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalTitle, setModalTitle] = useState("Add Feature");
  const [featureId, setFeatureId] = useState(0);
  const [featureName, setFeatureName] = useState("");
  const [idFilter, setIdFilter] = useState("");
  const [nameFilter, setNameFilter] = useState("");

  const getToken = useCallback((): string | null => {
    const token = authStore.getToken();
    if (!token) {
      window.location.href = "/login";
      return null;
    }
    return token;
  }, []);

  const filtered = useMemo(
    () =>
      features.filter(
        (f) =>
          f.FeatureId.toString().includes(idFilter.trim()) &&
          f.FeatureProfileName.toLowerCase().includes(nameFilter.toLowerCase().trim()),
      ),
    [features, idFilter, nameFilter],
  );

  const refresh = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(variables.API_URL + "features", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        window.location.href = "/login";
        return;
      }
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data: unknown = await res.json();
      setFeatures(Array.isArray(data) ? (data as FeatureData[]) : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const resetForm = useCallback(() => {
    setModalTitle("Add Feature");
    setFeatureId(0);
    setFeatureName("");
  }, []);

  const handleCreate = useCallback(async () => {
    if (!featureName.trim()) {
      toast.error("Please enter a feature name");
      return;
    }
    const token = getToken();
    if (!token) return;
    try {
      const res = await fetch(variables.API_URL + "features", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ FeatureProfileName: featureName }),
      });
      const result = await res.json();
      if (!res.ok) {
        toast.error(result.message || "Failed to create feature");
        return;
      }
      toast.success(result.message || "Feature created");
      resetForm();
      refresh();
    } catch {
      toast.error("Error creating feature");
    }
  }, [featureName, getToken, toast, resetForm, refresh]);

  const handleUpdate = useCallback(async () => {
    if (!featureName.trim()) {
      toast.error("Please enter a feature name");
      return;
    }
    const token = getToken();
    if (!token) return;
    try {
      const res = await fetch(variables.API_URL + "features", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ FeatureId: featureId, FeatureProfileName: featureName }),
      });
      const result = await res.json();
      if (!res.ok) {
        toast.error(result.message || "Failed to update feature");
        return;
      }
      toast.success(result.message || "Feature updated");
      resetForm();
      refresh();
    } catch {
      toast.error("Error updating feature");
    }
  }, [featureId, featureName, getToken, toast, resetForm, refresh]);

  const handleDelete = useCallback(
    async (id: number) => {
      if (!window.confirm("Are you sure you want to delete this feature?")) return;
      const token = getToken();
      if (!token) return;
      try {
        const res = await fetch(variables.API_URL + `features/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await res.json();
        if (!res.ok) {
          toast.error(result.message || "Failed to delete feature");
          return;
        }
        toast.success(result.message || "Feature deleted");
        refresh();
      } catch {
        toast.error("Error deleting feature");
      }
    },
    [getToken, toast, refresh],
  );

  return (
    <div className="p-6">
      <h2 className="mb-4 text-2xl font-bold">Features</h2>

      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Filter by ID"
          value={idFilter}
          onChange={(e) => setIdFilter(e.target.value)}
          className="rounded border px-3 py-2"
        />
        <input
          type="text"
          placeholder="Filter by Name"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          className="rounded border px-3 py-2"
        />
        <button
          onClick={resetForm}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Add Feature
        </button>
      </div>

      {loading ? (
        <p className="py-4 text-gray-500">Loading...</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 text-left">ID</th>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((f) => (
              <tr key={f.FeatureId} className="border-b">
                <td className="p-2">{f.FeatureId}</td>
                <td className="p-2">{f.FeatureProfileName}</td>
                <td className="flex gap-2 p-2">
                  <button
                    onClick={() => {
                      setModalTitle("Edit Feature");
                      setFeatureId(f.FeatureId);
                      setFeatureName(f.FeatureProfileName);
                    }}
                    className="rounded bg-green-600 px-3 py-1 text-white hover:bg-green-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(f.FeatureId)}
                    className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="mt-6 rounded-xl bg-white p-6 shadow">
        <h3 className="mb-4 text-lg font-semibold">{modalTitle}</h3>
        <input
          type="text"
          placeholder="Feature Name"
          value={featureName}
          onChange={(e) => setFeatureName(e.target.value)}
          className="mb-4 w-full rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {featureId === 0 ? (
          <button
            onClick={handleCreate}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Create
          </button>
        ) : (
          <button
            onClick={handleUpdate}
            className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
          >
            Update
          </button>
        )}
      </div>
    </div>
  );
};

export default Feature;
