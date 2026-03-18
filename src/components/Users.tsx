import { FC, useCallback, useEffect, useState } from "react";
import { useToast } from "../context/ToastContext";
import { authStore } from "../store/authStore";
import { variables } from "../Variables";

interface UserItem {
  id: number;
  username: string;
  role: "admin" | "user";
}

interface ApiMessage {
  message?: string;
}

const Users: FC = () => {
  const toast = useToast();
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(false);

  const [userId, setUserId] = useState<number>(0);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "user">("user");

  const getToken = useCallback((): string | null => {
    const token = authStore.getToken();
    if (!token) {
      window.location.href = "/login";
      return null;
    }
    return token;
  }, []);

  const resetForm = useCallback(() => {
    setUserId(0);
    setUsername("");
    setPassword("");
    setRole("user");
  }, []);

  const refreshUsers = useCallback(async () => {
    const token = getToken();
    if (!token) return;

    setLoading(true);
    try {
      const res = await fetch(variables.API_URL + "users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401 || res.status === 403) {
        toast.error("Unauthorized. Admin access required.");
        return;
      }

      if (!res.ok) {
        throw new Error(`Failed to fetch users: ${res.status}`);
      }

      const data: unknown = await res.json();
      setUsers(Array.isArray(data) ? (data as UserItem[]) : []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [getToken, toast]);

  useEffect(() => {
    refreshUsers();
  }, [refreshUsers]);

  const handleCreate = useCallback(async () => {
    if (!username.trim()) {
      toast.error("Username is required");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    const token = getToken();
    if (!token) return;

    try {
      const res = await fetch(variables.API_URL + "users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username, password, role }),
      });

      const result = (await res.json()) as ApiMessage;
      if (!res.ok) {
        toast.error(result.message || "Failed to create user");
        return;
      }

      toast.success(result.message || "User created successfully");
      resetForm();
      refreshUsers();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create user");
    }
  }, [getToken, password, refreshUsers, resetForm, role, toast, username]);

  const handleUpdate = useCallback(async () => {
    if (!username.trim()) {
      toast.error("Username is required");
      return;
    }
    if (password && password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    const token = getToken();
    if (!token) return;

    try {
      const payload = {
        id: userId,
        username,
        role,
        ...(password ? { password } : {}),
      };

      const res = await fetch(variables.API_URL + "users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = (await res.json()) as ApiMessage;
      if (!res.ok) {
        toast.error(result.message || "Failed to update user");
        return;
      }

      toast.success(result.message || "User updated successfully");
      resetForm();
      refreshUsers();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update user");
    }
  }, [
    getToken,
    password,
    refreshUsers,
    resetForm,
    role,
    toast,
    userId,
    username,
  ]);

  const handleEdit = useCallback((item: UserItem) => {
    setUserId(item.id);
    setUsername(item.username);
    setRole(item.role);
    setPassword("");
  }, []);

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Users</h2>
        <button
          onClick={resetForm}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          + Add User
        </button>
      </div>

      <div className="mb-8 overflow-x-auto rounded-xl bg-white shadow">
        {loading ? (
          <p className="p-4 text-gray-500">Loading users...</p>
        ) : (
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-100 text-xs uppercase text-gray-600">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Username</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{item.id}</td>
                  <td className="px-4 py-3">{item.username}</td>
                  <td className="px-4 py-3 capitalize">{item.role}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleEdit(item)}
                      className="rounded bg-yellow-500 px-3 py-1 text-white hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="max-w-2xl rounded-xl bg-white p-6 shadow">
        <h3 className="mb-4 text-lg font-semibold">
          {userId === 0 ? "Create User" : "Edit User"}
        </h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as "admin" | "user")}
              className="w-full rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label className="mb-1 block text-sm font-medium">
            {userId === 0 ? "Password" : "New Password (optional)"}
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mt-6 flex gap-3">
          {userId === 0 ? (
            <button
              onClick={handleCreate}
              className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
            >
              Create User
            </button>
          ) : (
            <button
              onClick={handleUpdate}
              className="rounded-lg bg-green-600 px-5 py-2 text-white hover:bg-green-700"
            >
              Update User
            </button>
          )}

          <button
            onClick={resetForm}
            className="rounded-lg border px-5 py-2 text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Users;
