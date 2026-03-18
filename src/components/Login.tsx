import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { authStore } from "../store/authStore";

interface LoginProps {
  setToken: (token: string) => void;
  setRole: (role: string) => void;
}

export default function Login({ setToken, setRole }: LoginProps) {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await authService.login({ username, password });

      if (data.token) {
        authStore.setAuth(data.token, data.role);
        setRole(data.role);
        setToken(data.token);
        navigate("/dashboard");
      } else {
        setError("Login failed: no token received");
      }
    } catch (err: unknown) {
      console.error(err);
      const message = err instanceof Error ? err.message : "Server error";

      if (message.toLowerCase().includes("failed to fetch")) {
        setError("Cannot reach API server. Please start backend on http://localhost:5000.");
      } else {
        setError(message || "Server error, try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white/10 p-8 shadow-2xl backdrop-blur-md border border-white/20">
      <div className="w-full max-w-md  border-white/30 text-white rounded-xl p-8 bg-white/10 focus:outline-none focus:border-white">
        {/* LOGO */}
        <div className="flex justify-center mb-4">
          <img
            src="/logo.png"
            alt="Fort Hub Realty Logo"
            className="h-20 object-contain"
          />
        </div>

        <h2 className="text-2xl font-bold text-center mb-6 text-gray-300">
          Fort Hub Realty System Login
        </h2>

        {error && (
          <div className="mb-4 text-red-600 font-medium text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            {/* <label
              className="block text-sm font-medium mb-1 text-white"
              htmlFor="username"
            >
              Username
            </label> */}
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter your username"
              required
              autoFocus
            />
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-500"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-lg shadow transition duration-300 ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-300">
          &copy; {new Date().getFullYear()} Fort Hub Realty Management System
        </p>
      </div>
    </div>
  );
}
