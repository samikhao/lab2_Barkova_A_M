import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getNewsList, deleteNews, patchNews } from "../api/news.js";
import { listComments, createComment, patchComment, deleteComment } from "../api/comments.js";
import { useAuth } from "../auth/AuthContext.jsx";
import CommentForm from "../components/CommentForm.jsx";
import CommentItem from "../components/CommentItem.jsx";
import styles from "../styles/news.module.css";

function renderContent(content) {
  if (!content) return "";
  if (typeof content === "string") return content;
  if (typeof content === "object") {
    if (Array.isArray(content.blocks)) return content.blocks.join("\n");
    if (typeof content.text === "string") return content.text;
    return JSON.stringify(content, null, 2);
  }
  return String(content);
}

export default function NewsDetailPage() {
  const { id } = useParams();
  const newsId = Number(id);
  const nav = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [news, setNews] = useState(null);
  const [comments, setComments] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [editMode, setEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const isOwnerNews = useMemo(() => {
    if (!user || !news) return false;
    return String(user.id) === String(news.author_id);
  }, [user, news]);

  const canEditOrDeleteNews = Boolean(isAuthenticated && (user?.is_admin || isOwnerNews));

  const load = async () => {
    setError("");
    setLoading(true);
    try {
      if (!isAuthenticated) throw new Error("Missing bearer token");

      const list = await getNewsList();
      const n = (Array.isArray(list) ? list : []).find((x) => x.id === newsId);
      if (!n) throw new Error("News not found");
      setNews(n);
      setEditTitle(n.title || "");
      setEditContent(renderContent(n.content));

      const all = await listComments();
      const filtered = (Array.isArray(all) ? all : []).filter((c) => c.news_id === newsId);
      setComments(filtered);
    } catch (e) {
      setError(e?.response?.data?.detail || e.message || "Не удалось загрузить новость.");
      setNews(null);
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [newsId, isAuthenticated]);

  const onAddComment = async (text) => {
    try {
      await createComment({ text, news_id: newsId });
      await load();
    } catch (e) {
      alert(e?.response?.data?.detail || "Не удалось добавить комментарий.");
    }
  };

  const onEditComment = async (commentId, text) => {
    try {
      await patchComment(commentId, { text });
      await load();
    } catch (e) {
      alert(e?.response?.data?.detail || "Не удалось отредактировать комментарий.");
    }
  };

  const onDeleteComment = async (commentId) => {
    if (!confirm("Удалить комментарий?")) return;
    try {
      await deleteComment(commentId);
      await load();
    } catch (e) {
      alert(
        e?.response?.data?.detail || "Не удалось удалить комментарий.");
    }
  };

  const onDeleteNews = async () => {
    if (!confirm("Удалить новость?")) return;
    try {
      await deleteNews(newsId);
      nav("/");
    } catch (e) {
      alert(e?.response?.data?.detail || "Не удалось удалить новость.");
    }
  };

  const onSaveNews = async () => {
    try {
      const t = editTitle.trim();
      const c = editContent.trim();
      if (!t || !c) return alert("Заполните заголовок и контент.");

      await patchNews(newsId, { title: t, content: { text: c } });
      setEditMode(false);
      await load();
    } catch (e) {
      alert(e?.response?.data?.detail || "Не удалось сохранить изменения новости.");
    }
  };

  const contentText = useMemo(() => renderContent(news?.content), [news]);

  return (
    <section className={styles.page}>
      <div className={styles.breadcrumbs}>
        <Link to="/" className={styles.linkInline}>← к списку</Link>
      </div>

      {!isAuthenticated && (
        <div className={styles.errorBox}>
          Чтобы увидеть новость и комментарии — нужно войти (эндпоинты защищены <code>require_authenticated</code>).
        </div>
      )}

      {error && <div className={styles.errorBox}>{error}</div>}
      {loading && <div className={styles.muted}>Загрузка...</div>}

      {news && (
        <>
          <div className={styles.newsHeader}>
            <h1 className={styles.h1}>{news.title}</h1>
            <div className={styles.meta}>
              <span>ID: {news.id}</span>
              <span>Author ID: {news.author_id}</span>
              {news.published_at && <span>{new Date(news.published_at).toLocaleString()}</span>}
            </div>

            {canEditOrDeleteNews && (
              <div className={styles.row}>
                <button className={styles.smallBtn} onClick={() => setEditMode((v) => !v)}>
                  {editMode ? "Закрыть редактор" : "Редактировать"}
                </button>
                <button className={styles.dangerBtn} onClick={onDeleteNews}>
                  Удалить новость
                </button>
              </div>
            )}
          </div>

          {editMode ? (
            <div className={styles.form}>
              <input
                className={styles.input}
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Заголовок"
              />
              <textarea
                className={styles.textarea}
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={10}
                placeholder="Контент"
              />
              <button className={styles.primaryBtn} type="button" onClick={onSaveNews}>
                Сохранить
              </button>
            </div>
          ) : (
            <>
              {news.cover_url && <img className={styles.coverBig} src={news.cover_url} alt="cover" />}
              <pre className={styles.content}>{contentText}</pre>
            </>
          )}

          <hr className={styles.hr} />

          <h2 className={styles.h2}>Комментарии</h2>

          {isAuthenticated ? (
            <CommentForm onSubmit={onAddComment} />
          ) : (
            <div className={styles.muted}>Войдите, чтобы оставлять комментарии.</div>
          )}

          <div className={styles.commentsList}>
            {comments.map((c) => {
              const isOwner = user?.id != null && String(user.id) === String(c.author_id);
              const canEdit = Boolean(isAuthenticated && (user?.is_admin || isOwner));
              const canDelete = Boolean(isAuthenticated && (user?.is_admin || isOwner));
              return (
                <CommentItem
                  key={c.id}
                  comment={c}
                  canEdit={canEdit}
                  canDelete={canDelete}
                  onEdit={onEditComment}
                  onDelete={onDeleteComment}
                />
              );
            })}
          </div>

          {comments.length === 0 && <div className={styles.muted}>Комментариев пока нет.</div>}
        </>
      )}
    </section>
  );
}
