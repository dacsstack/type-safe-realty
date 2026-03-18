import { env } from "../utils/env";

const baseHeaders = {
  "Content-Type": "application/json",
};

const buildUrl = (path: string): string => {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${env.apiUrl}${normalized}`;
};

export const httpClient = {
  async get<T>(path: string, token?: string): Promise<T> {
    const response = await fetch(buildUrl(path), {
      method: "GET",
      headers: {
        ...baseHeaders,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!response.ok) {
      throw new Error(`GET ${path} failed: ${response.status}`);
    }

    return (await response.json()) as T;
  },

  async post<TRequest, TResponse>(
    path: string,
    body: TRequest,
    token?: string,
  ): Promise<TResponse> {
    const response = await fetch(buildUrl(path), {
      method: "POST",
      headers: {
        ...baseHeaders,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    });

    const text = await response.text();
    const payload = text ? ((JSON.parse(text)) as TResponse & { message?: string }) : ({} as TResponse & { message?: string });

    if (!response.ok) {
      throw new Error(
        payload.message ?? `POST ${path} failed: ${response.status}`,
      );
    }

    return payload;
  },
};
