import api from "./axios.js";

export async function listComments() {
  const res = await api.get("/comments/");
  return res.data;
}

export async function createComment({ text, news_id }) {
  const res = await api.post("/comments/", { text, news_id });
  return res.data;
}

export async function patchComment(commentId, patch) {
  const res = await api.patch(`/comments/${commentId}`, patch);
  return res.data;
}

export async function deleteComment(commentId) {
  await api.delete(`/comments/${commentId}`);
}
