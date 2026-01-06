import { Link } from "react-router-dom";
import styles from "../styles/layout.module.css";

export default function NotFoundPage() {
  return (
    <div className={styles.notFound}>
      <h1>404</h1>
      <p>Страница не найдена.</p>
      <Link to="/" className={styles.btnLink}>На главную</Link>
    </div>
  );
}
