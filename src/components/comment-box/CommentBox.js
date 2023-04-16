import { useState } from "react";

import Link from "next/link"

import formatDistanceToNow from "date-fns/formatDistanceToNow"

import useAuthContext from "./../../hooks/useAuthContext.js";
import useCommentsContext from "./../../hooks/useCommentsContext.js";

import styles from "./CommentBox.module.css"

export default function CommentBox({ comment }) {
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user: loggedIn } = useAuthContext();
  const { dispatch: setComment } = useCommentsContext();

  const timestamp = formatDistanceToNow(new Date(Number(comment.createdAt)), {
    addSuffix: true,
  })

  const requestBody = {
    query: `mutation RemoveComment{removeComment(_id: "${comment._id}"){_id}}`
  };

  const removeComment = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    setError(false);

    const res = await fetch("https://next-forum-server.onrender.com", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    const data = await res.json();

    if (data.errors) {
      setIsLoading(false);
      setError(data.errors[0].extensions.originalError ? data.errors[0].extensions.originalError.message : data.errors[0].message);
      return
    }

    setIsLoading(false);
    setError(false);

    setComment({ type: "DELETE_COMMENT", payload: data.data.removeComment });
  }

  return (
    <div className={styles.box}>
      <div className={styles.container}>
        <div className={styles["user-info"]}>
          <Link href={comment.user.path}>{comment.user.displayName}</Link>
          {/*<Link href={comment.user.path}>{comment.user.profilePicture}</Link>*/}
          {/*<p>{comment.user.role || "Admin"}</p>*/}
          {/*<Link href={`${comment.user.path}/content`}>{comment.user.commentsCount}</Link>*/}
        </div>
        <div className={styles["comment-info"]}>
          <p>
            {timestamp[0].toUpperCase()}{timestamp.substring(1)}
          </p>
          <h4 className={styles.content}>{comment.content}</h4>
        </div>
      </div>
      {loggedIn && <button onClick={removeComment} className={styles.delete}>Delete Comment</button>}
    </div>
  )
}
