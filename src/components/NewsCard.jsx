import { Link } from "react-router-dom";
import styles from "../styles/news.module.css";

export default function NewsCard({ item }) {
  const dt = item?.published_at ? new Date(item.published_at) : null;

  return (
    <article className={styles.card}>
      <h3 className={styles.cardTitle}>
        <Link to={`/news/${item.id}`} className={styles.cardLink}>
          {item.title}
        </Link>
      </h3>

      <div className={styles.meta}>
        <span>ID: {item.id}</span>
        <span>Author ID: {item.author_id}</span>
        {dt && <span>{dt.toLocaleString()}</span>}
      </div>

      {item.cover_url && <img className={styles.cover} src={item.cover_url} alt="cover" />}
    </article>
  );
}
