import api from "./axios.js";

export async function getNewsList() {
  const res = await api.get("/news/");
  return res.data;
}

export async function createNews({ title, content, cover_url = null }) {
  const res = await api.post("/news/", { title, content, cover_url });
  return res.data;
}

export async function patchNews(newsId, patch) {
  const res = await api.patch(`/news/${newsId}`, patch);
  return res.data;
}

export async function deleteNews(newsId) {
  await api.delete(`/news/${newsId}`);
}
