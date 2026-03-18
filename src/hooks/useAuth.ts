import { useMemo, useState } from "react";
import { authService } from "../services/authService";
import { authStore } from "../store/authStore";

export const useAuth = () => {
  const [token, setTokenState] = useState<string | null>(authStore.getToken());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const login = async (
    username: string,
    password: string,
  ): Promise<string | null> => {
    setLoading(true);
    setError("");
    try {
      const result = await authService.login({ username, password });
      authStore.setAuth(result.token, result.role);
      setTokenState(result.token);
      return result.token;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Login failed");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authStore.clear();
    setTokenState(null);
  };

  return useMemo(
    () => ({ token, loading, error, login, logout }),
    [token, loading, error],
  );
};
