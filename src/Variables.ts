// Variables.ts
export const variables = {
  API_URL: (import.meta.env.VITE_API_URL || "http://localhost:5000/api") + "/",
  PHOTO_URL:
    (import.meta.env.VITE_PHOTO_URL || "http://localhost:5000/Photos") + "/",
  UPLOADS_URL:
    (import.meta.env.VITE_UPLOADS_URL || "http://localhost:5000/uploads") + "/",
};
