// export const variables = {
//   API_URL: "http://localhost:45225/api/",
//   PHOTO_URL: "http://localhost:45225/Photos/",

//   // API_URL: "https://forthubapi-production.up.railway.app/api/",
//   // PHOTO_URL: "https://forthubapi-production.up.railway.app/Photos/",
// };
const BASE =
  process.env.NODE_ENV === "production"
    ? "https://forthub-backendapi-production.up.railway.app"
    : "http://localhost:5000";
export const API_URL = `${BASE}/api`;
export const PHOTO_URL = `${BASE}/Photos`;
