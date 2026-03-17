import { AuthResponse } from "../types/api";
import { httpClient } from "./httpClient";

export interface LoginInput {
  username: string;
  password: string;
}

export const authService = {
  login(input: LoginInput): Promise<AuthResponse> {
    return httpClient.post<LoginInput, AuthResponse>("/login", input);
  },
};
