import Link from "next/link";

import formatDistanceToNow from "date-fns/formatDistanceToNow";

import styles from "./CommentPreview.module.css"

export default function CommentPreview({ comment, topic }) {
  let timestamp = formatDistanceToNow(new Date(Number(comment.createdAt)), {
    addSuffix: true,
  })
  .replace(/about |over |almost |/i, "");
  
  return (
    <div className={styles.container}>
      <div className={styles["topic-info"]}>
        <h2>
          <Link href={topic.path}>{topic.title}</Link>
        </h2>
      </div>
      <div className={styles["comment-info"]}>
        {comment.content.length >= 50 ? (
          <p>{comment.content.substring(0, 200)}...</p>
        ) : (
          <p>{comment.content}</p>
        )}
        {comment && (
          <Link href={`${topic.path}#${comment.index}`}>
            {timestamp[0].toUpperCase()}
            {timestamp.substring(1)}
          </Link>
        )}
      </div>
    </div>
  );
}
