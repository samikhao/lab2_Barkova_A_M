import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";
import styles from "../styles/auth.module.css";

export default function LoginPage() {
  const { login } = useAuth();
  const nav = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    const em = email.trim();
    const pw = password.trim();
    if (!em || !pw) {
      setError("Введите email и пароль.");
      return;
    }

    setLoading(true);
    try {
      await login({ email: em, password: pw });
      nav("/");
    } catch (e2) {
      setError("Не удалось войти.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.page}>
      <h1 className={styles.h1}>Авторизация</h1>

      <form className={styles.form} onSubmit={submit}>
        {error && <div className={styles.error}>{error}</div>}

        <label className={styles.label}>
          Email
          <input
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jack@example.com"
            disabled={loading}
          />
        </label>

        <label className={styles.label}>
          Пароль
          <input
            className={styles.input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="123456"
            disabled={loading}
          />
        </label>

        <button className={styles.btn} disabled={loading} type="submit">
          {loading ? "Входим..." : "Войти"}
        </button>
      </form>
    </section>
  );
}
