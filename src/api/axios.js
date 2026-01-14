import axios from "axios";
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from "../auth/storage.js";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api/v1",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let isRefreshing = false;
let refreshQueue = [];

function queueRequest(cb) {
  refreshQueue.push(cb);
}

function flushQueue(newToken) {
  refreshQueue.forEach((cb) => cb(newToken));
  refreshQueue = [];
}

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const status = err?.response?.status;
    const original = err.config;

    const isAuthEndpoint =
      original?.url?.includes("/auth/login") ||
      original?.url?.includes("/auth/register") ||
      original?.url?.includes("/auth/refresh") ||
      original?.url?.includes("/auth/logout");

    if (status === 401 && !isAuthEndpoint && !original._retry) {
      const refresh = getRefreshToken();
      if (!refresh) return Promise.reject(err);

      original._retry = true;

      if (isRefreshing) {
        return new Promise((resolve) => {
          queueRequest((newToken) => {
            original.headers.Authorization = `Bearer ${newToken}`;
            resolve(api(original));
          });
        });
      }

      isRefreshing = true;

      try {
        const resp = await api.post("/auth/refresh", { refresh });
        setTokens(resp.data);

        const newAccess = resp.data.access;
        flushQueue(newAccess);

        original.headers.Authorization = `Bearer ${newAccess}`;
        return api(original);
      } catch (e) {
        clearTokens();
        flushQueue("");
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(err);
  }
);

export default api;
