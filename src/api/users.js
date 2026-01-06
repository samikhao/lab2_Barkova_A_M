import api from "./axios.js";

export async function listUsers() {
  const res = await api.get("/users/");
  return res.data;
}

export async function verifyUser(userId, is_verified_author) {
  const res = await api.post(`/users/${userId}/verify`, { is_verified_author });
  return res.data;
}
