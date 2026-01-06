import api from "./axios.js";
import { getRefreshToken } from "../auth/storage.js";

export async function login({ email, password }) {
  const res = await api.post("/auth/login", { email, password });
  return res.data;
}

export async function register({ name, email, password }) {
  const res = await api.post("/auth/register", { name, email, password });
  return res.data;
}

export async function logout() {
  const refresh = getRefreshToken();
  if (!refresh) return;
  await api.post("/auth/logout", { refresh }); // 204
}

export async function listSessions() {
  const res = await api.get("/auth/sessions");
  return res.data;
}
