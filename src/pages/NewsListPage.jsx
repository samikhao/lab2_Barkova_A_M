import { useState } from "react";
import { getNewsList } from "../api/news.js";
import NewsCard from "../components/NewsCard.jsx";
import styles from "../styles/news.module.css";

export default function NewsListPage() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setError("");
    setLoading(true);
    try {
      const data = await getNewsList();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e?.response?.data?.detail || "Не удалось загрузить новости.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.page}>
      <h1 className={styles.h1}>Новости</h1>

      <div className={styles.panel}>
        <button className={styles.smallBtn} onClick={load} disabled={loading}>
          Обновить
        </button>
      </div>

      {error && <div className={styles.errorBox}>{error}</div>}
      {loading && <div className={styles.muted}>Загрузка...</div>}

      <div className={styles.grid}>
        {items.map((it) => (
          <NewsCard key={it.id} item={it} />
        ))}
      </div>

      {!loading && !error && items.length === 0 && (
        <div className={styles.muted}>Новостей пока нет.</div>
      )}
    </section>
  );
}
