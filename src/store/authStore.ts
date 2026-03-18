const TOKEN_KEY = "token";
const ROLE_KEY = "role";

export const authStore = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  getRole(): string | null {
    return localStorage.getItem(ROLE_KEY);
  },

  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  },

  setRole(role: string): void {
    localStorage.setItem(ROLE_KEY, role);
  },

  setAuth(token: string, role: string): void {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(ROLE_KEY, role);
  },

  clear(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ROLE_KEY);
  },
};
