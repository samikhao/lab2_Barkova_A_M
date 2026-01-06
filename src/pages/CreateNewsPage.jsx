import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createNews } from "../api/news.js";
import { useAuth } from "../auth/AuthContext.jsx";
import styles from "../styles/news.module.css";

export default function CreateNewsPage() {
  const { user, isAuthenticated } = useAuth();
  const nav = useNavigate();

  const canCreate = useMemo(() => {
    return Boolean(isAuthenticated && (user?.is_admin || user?.is_verified_author));
  }, [isAuthenticated, user]);

  const [title, setTitle] = useState("");
  const [contentText, setContentText] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!canCreate) {
      setError("Недостаточно прав для создания новости (нужен verified author или admin).");
      return;
    }

    const t = title.trim();
    const c = contentText.trim();
    if (!t || !c) {
      setError("Заполните заголовок и контент.");
      return;
    }

    setSaving(true);
    try {
      const created = await createNews({ title: t, content: { text: c }, cover_url: null });
      nav(`/news/${created.id}`);
    } catch (e2) {
      setError(e2?.response?.data?.detail || "Не удалось создать новость.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className={styles.page}>
      <h1 className={styles.h1}>Создать новость</h1>

      {!canCreate && (
        <div className={styles.errorBox}>
          Доступ запрещён. Нужно быть <b>verified author</b> или <b>admin</b>.
        </div>
      )}

      {error && <div className={styles.errorBox}>{error}</div>}

      <form className={styles.form} onSubmit={submit}>
        <input
          className={styles.input}
          placeholder="Заголовок"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={!canCreate || saving}
        />

        <textarea
          className={styles.textarea}
          placeholder="Контент (текст)"
          value={contentText}
          onChange={(e) => setContentText(e.target.value)}
          rows={10}
          disabled={!canCreate || saving}
        />

        <button className={styles.primaryBtn} type="submit" disabled={!canCreate || saving}>
          {saving ? "Сохранение..." : "Создать"}
        </button>
      </form>
    </section>
  );
}
