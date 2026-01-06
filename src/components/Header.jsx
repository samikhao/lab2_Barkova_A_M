import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import styles from "../styles/layout.module.css";

export default function Header() {
  const { user, isAuthenticated, logout, loading } = useAuth();
  const navigate = useNavigate();

  const canCreateNews = Boolean(user?.is_admin || user?.is_verified_author);

  const onLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <Link to="/" className={styles.brand}>
          ITMO News
        </Link>

        <nav className={styles.nav}>
          <NavLink to="/" className={({ isActive }) => (isActive ? styles.active : styles.link)}>
            Новости
          </NavLink>

          {isAuthenticated && canCreateNews && (
            <NavLink
              to="/news/create"
              className={({ isActive }) => (isActive ? styles.active : styles.link)}
            >
              Создать новость
            </NavLink>
          )}
        </nav>

        <div className={styles.right}>
          {loading ? (
            <span className={styles.muted}>...</span>
          ) : isAuthenticated ? (
            <div className={styles.userBox}>
              <div className={styles.userLine}>
                <span className={styles.userName}>{user?.name || user?.email || `id=${user?.id}`}</span>
                <span className={styles.badges}>
                  {user?.is_admin && <span className={styles.badge}>admin</span>}
                  {user?.is_verified_author && <span className={styles.badge}>author</span>}
                </span>
              </div>
              <button className={styles.btn} onClick={onLogout}>
                Выйти
              </button>
            </div>
          ) : (
            <Link to="/login" className={styles.btnLink}>
              Войти
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
