import { useState } from "react";

import Link from "next/link"

import formatDistanceToNow from "date-fns/formatDistanceToNow"

import useAuthContext from "./../../hooks/useAuthContext.js";
import useForumsContext from "./../../hooks/useForumsContext.js";
import useTopicsContext from "./../../hooks/useTopicsContext.js";

import styles from "./BoxItem.module.css"

export default function BoxItem({
	forum,
	topic,
	// viewsCount,
	user,
	comment,
	commentLink
}) {
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user: loggedIn } = useAuthContext();
  const { dispatch: setForum } = useForumsContext();
  const { dispatch: setTopic } = useTopicsContext();

	let createdAt;
	if (comment) {
		createdAt = formatDistanceToNow(new Date(Number(comment.createdAt)), {
			addSuffix: true,
		})
		.replace(/about |over |almost |/i, '')
	}

	let requestBody
	if (forum) requestBody = {
		query: `mutation RemoveForum{removeForum(_id: "${forum._id}"){_id}}`
	};
	if (topic) requestBody = {
		query: `mutation RemoveTopic{removeTopic(_id: "${topic._id}"){_id}}`
	};

	const removeBoxItem = async (e) => {
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

    if (forum) setForum({ type: "DELETE_FORUM", payload: data.data.removeForum });
    if (topic) setTopic({ type: "DELETE_TOPIC", payload: data.data.removeTopic });
	}

	return (
		<div className={styles.box}>
			<div className={styles.container}>
				{forum && <div className={styles['forum-info']}>
					<Link href={forum.path} className={styles['forum-title']}>{forum.title}</Link>
					{forum.description && <p className={styles['forum-description']}>{forum.description}</p>}
				</div>}
				{topic && <Link href={topic.path} className={styles['topic-title']}>{topic.title}</Link>}
				<div className={styles.info}>
					<div className={styles.counts}>
						{forum ? (forum.commentsCount > 1 && (<p> {forum.commentsCount - forum.topicsCount} posts</p>)) || (forum.commentsCount === 2 && (<p>1 post</p>)) || <p>0 posts</p> : null}
						{topic ? (topic.commentsCount > 1 && (<p> {topic.commentsCount - 1} posts</p>)) || (topic.commentsCount === 2 && (<p>1 post</p>)) || <p>0 posts</p> : null}
						{/*<p>{viewsCount} views</p>*/}
					</div>
					{user && <div className={styles['last-comment']}>
						{user && <Link href={user.path}>{user.displayName}</Link>}
						{commentLink && <Link href={`${commentLink}#${comment.index}`}>
							{createdAt && createdAt[0].toUpperCase()}
							{createdAt && createdAt.substring(1)}
						</Link>}
					</div>}
				</div>
			</div>
			{loggedIn && <button onClick={removeBoxItem} className={styles.delete}>Delete {forum ? "Forum" : "Topic"}</button>}
		</div>
	)
}
