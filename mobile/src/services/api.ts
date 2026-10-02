import { create } from "axios";
import { clearSession, getToken } from "./authStorage";

// Use your computer's LAN address in EXPO_PUBLIC_API_URL when testing on a physical device.
const configuredUrl = process.env.EXPO_PUBLIC_API_URL || "http://10.0.2.2:8000/api";
const baseURL = `${configuredUrl.replace(/\/$/, "")}${configuredUrl.replace(/\/$/, "").endsWith("/api") ? "" : "/api"}`;

const api = create({ baseURL, timeout: 15000, headers: { "Content-Type": "application/json" } });
api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) await clearSession();
    return Promise.reject(error);
  },
);
export default api;
