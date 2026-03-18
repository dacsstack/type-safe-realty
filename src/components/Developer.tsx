import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useToast } from "../context/ToastContext";
import { authStore } from "../store/authStore";
import { variables } from "../Variables";

interface DeveloperData {
  DeveloperId: number;
  DeveloperName: string;
}

const Developer: FC = () => {
  const toast = useToast();
  const [developers, setDevelopers] = useState<DeveloperData[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalTitle, setModalTitle] = useState("Add Developer");
  const [developerId, setDeveloperId] = useState(0);
  const [developerName, setDeveloperName] = useState("");
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
      developers.filter(
        (d) =>
          d.DeveloperId.toString().includes(idFilter.trim()) &&
          d.DeveloperName.toLowerCase().includes(
            nameFilter.toLowerCase().trim(),
          ),
      ),
    [developers, idFilter, nameFilter],
  );

  const refresh = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(variables.API_URL + "developer", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        window.location.href = "/login";
        return;
      }
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data: unknown = await res.json();
      setDevelopers(Array.isArray(data) ? (data as DeveloperData[]) : []);
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
    setModalTitle("Add Developer");
    setDeveloperId(0);
    setDeveloperName("");
  }, []);

  const handleCreate = useCallback(async () => {
    if (!developerName.trim()) {
      toast.error("Please enter developer name");
      return;
    }
    const token = getToken();
    if (!token) return;
    try {
      const res = await fetch(variables.API_URL + "developers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ DeveloperName: developerName }),
      });
      const result = await res.json();
      if (!res.ok) {
        toast.error(result.message || "Failed to create developer");
        return;
      }
      toast.success(result.message || "Developer created");
      resetForm();
      refresh();
    } catch {
      toast.error("Error creating developer");
    }
  }, [developerName, getToken, toast, resetForm, refresh]);

  const handleUpdate = useCallback(async () => {
    if (!developerName.trim()) {
      toast.error("Please enter developer name");
      return;
    }
    const token = getToken();
    if (!token) return;
    try {
      const res = await fetch(variables.API_URL + "developers", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          DeveloperId: developerId,
          DeveloperName: developerName,
        }),
      });
      const result = await res.json();
      if (!res.ok) {
        toast.error(result.message || "Failed to update developer");
        return;
      }
      toast.success(result.message || "Developer updated");
      resetForm();
      refresh();
    } catch {
      toast.error("Error updating developer");
    }
  }, [developerId, developerName, getToken, toast, resetForm, refresh]);

  const handleDelete = useCallback(
    async (id: number) => {
      if (!window.confirm("Are you sure you want to delete this developer?"))
        return;
      const token = getToken();
      if (!token) return;
      try {
        const res = await fetch(variables.API_URL + `developers/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await res.json();
        if (!res.ok) {
          toast.error(result.message || "Failed to delete developer");
          return;
        }
        toast.success(result.message || "Developer deleted");
        refresh();
      } catch {
        toast.error("Error deleting developer");
      }
    },
    [getToken, toast, refresh],
  );

  return (
    <div className="p-6">
      <h2 className="mb-4 text-2xl font-bold">Developers</h2>

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
          Add Developer
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
            {filtered.map((d) => (
              <tr key={d.DeveloperId} className="border-b">
                <td className="p-2">{d.DeveloperId}</td>
                <td className="p-2">{d.DeveloperName}</td>
                <td className="flex gap-2 p-2">
                  <button
                    onClick={() => {
                      setModalTitle("Edit Developer");
                      setDeveloperId(d.DeveloperId);
                      setDeveloperName(d.DeveloperName);
                    }}
                    className="rounded bg-green-600 px-3 py-1 text-white hover:bg-green-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(d.DeveloperId)}
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
          placeholder="Developer Name"
          value={developerName}
          onChange={(e) => setDeveloperName(e.target.value)}
          className="mb-4 w-full rounded-lg border p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        {developerId === 0 ? (
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

export default Developer;
