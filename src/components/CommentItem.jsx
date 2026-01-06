import { useMemo, useState } from "react";
import styles from "../styles/news.module.css";

export default function CommentItem({ comment, canEdit, canDelete, onEdit, onDelete }) {
  const dt = useMemo(() => {
    if (!comment?.published_at) return null;
    try {
      return new Date(comment.published_at).toLocaleString();
    } catch {
      return null;
    }
  }, [comment]);

  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(comment?.text ?? "");

  const save = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    await onEdit(comment.id, trimmed);
    setIsEditing(false);
  };

  return (
    <div className={styles.comment}>
      <div className={styles.commentTop}>
        <div className={styles.commentMeta}>
          <span>#{comment.id}</span>
          <span>author_id: {comment.author_id}</span>
          {dt && <span>{dt}</span>}
        </div>

        <div className={styles.commentActions}>
          {canEdit && !isEditing && (
            <button className={styles.smallBtn} onClick={() => setIsEditing(true)}>
              Редактировать
            </button>
          )}
          {canDelete && (
            <button className={styles.dangerBtn} onClick={() => onDelete(comment.id)}>
              Удалить
            </button>
          )}
        </div>
      </div>

      {isEditing ? (
        <div className={styles.editBox}>
          <textarea
            className={styles.textarea}
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
          />
          <div className={styles.row}>
            <button className={styles.primaryBtn} type="button" onClick={save}>
              Сохранить
            </button>
            <button className={styles.smallBtn} type="button" onClick={() => setIsEditing(false)}>
              Отмена
            </button>
          </div>
        </div>
      ) : (
        <p className={styles.commentText}>{comment.text}</p>
      )}
    </div>
  );
}
