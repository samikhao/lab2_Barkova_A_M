import { useState } from "react";
import styles from "../styles/news.module.css";

export default function CommentForm({ onSubmit, disabled }) {
  const [text, setText] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    await onSubmit(trimmed);
    setText("");
  };

  return (
    <form className={styles.form} onSubmit={submit}>
      <textarea
        className={styles.textarea}
        placeholder="Напишите комментарий..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        disabled={disabled}
      />
      <button className={styles.primaryBtn} type="submit" disabled={disabled}>
        Отправить
      </button>
    </form>
  );
}
