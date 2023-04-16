import { useState } from "react";

import useAuthContext from "./../../hooks/useAuthContext.js";
import useForumsContext from "./../../hooks/useForumsContext.js";
import useTopicsContext from "./../../hooks/useTopicsContext.js";
import useCommentsContext from "./../../hooks/useCommentsContext.js";

import styles from "./Form.module.css";

export default function Form({
  forumTitle,
  topicTitle,
  forumDescription,
  topicContent,
  commentContent,
  topicId,
  forumId,
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const { user } = useAuthContext();

  const userId = user._id;

  const pattern = /^\s*$/;

  const { dispatch: setForum } = useForumsContext();
  const { dispatch: setTopic } = useTopicsContext();
  const { dispatch: setComment } = useCommentsContext();

  let requestBody;
  if (forumDescription) {
    requestBody = {
      query: `mutation CreateForum{createForum(title: "${title}", description: """${description}"""){_id, title, description, path, topics{path}, comments{createdAt, index, user{displayName, path}}}}`,
    };
  }
  if (topicContent) {
    requestBody = {
      query: `mutation CreateTopicWithComment{createTopicWithComment(title: "${title}", forumId: "${forumId}", topicType: THREAD, commentType: POST, content: """${content}""", userId: "${userId}"){_id, createdAt, title, path, user{displayName, path}, comments(commentsLimit: 1){createdAt, index, user{displayName, path}}}}`,
    };
  }
  if (commentContent) {
    requestBody = {
      query: `mutation CreateComment{createComment(content: """${content}""", forumId: "${forumId}", topicId: "${topicId}", userId: "${userId}" type: POST){_id, content, createdAt user{_id, displayName, path, commentsCount}}}`,
    };
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    setError(false);
    if (title && pattern.test(title)) {
      setIsLoading(false);
      setError("Title cannot be empty!");
      return;
    }
    if (content && pattern.test(content)) {
      setIsLoading(false);
      setError("You cannot post an empty comment!");
      return;
    }
    if (description && pattern.test(description)) {
      setIsLoading(false);
      setError("Description cannot be empty!");
      return;
    }

    const res = await fetch("https://next-forum-server.onrender.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // "authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDJlZDdhZDYzYWU1NGViMWU2OWI0N2UiLCJpYXQiOjE2ODEwNzAzMTl9.-UkM4p37IFmckYDjGEP6Aax1FJivDQX9ZOtNbko3x4Y"
      },
      body: JSON.stringify(requestBody),
    });
    const data = await res.json();

    if (data.errors) {
      setIsLoading(false);
      setError(data.errors[0].extensions.originalError ? data.errors[0].extensions.originalError.message : data.errors[0].message);
      return;
    }

    setIsLoading(false);
    setError(false);
    setTitle("");

    if (forumDescription) {
      setDescription("");
      setForum({ type: "CREATE_FORUM", payload: data.data.createForum });
    }
    if (topicContent) {
      setContent("");
      setTopic({ type: "CREATE_TOPIC", payload: data.data.createTopicWithComment });
    }
    if (commentContent) {
      setContent("");
      setComment({ type: "CREATE_COMMENT", payload: data.data.createComment });
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        {forumTitle || topicTitle ? (
          <label>
            <span>Title:</span>
            <input
              className={styles.input}
              type="text"
              id="title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>
        ) : null}
        {forumDescription && (
          <label>
            <span>Description:</span>
            <textarea
              className={styles.input}
              type="text"
              id="description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="5"
            />
          </label>
        )}
        {topicContent || commentContent ? (
          <label>
            {commentContent ? (
              <span>Leave a comment:</span>
            ) : (
              <span>Content:</span>
            )}
            <textarea
              className={styles.input}
              type="text"
              id="content"
              name="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="5"
              required
            />
          </label>
        ) : null}
        <button type="submit" disabled={isLoading} className={styles.button}>
          {forumDescription === true
            ? `Add Forum`
            : topicContent === true
            ? `Add Topic`
            : `Add Comment`}
        </button>
        {error && <h4 className={styles.error}>{error}</h4>}
      </form>
    </div>
  );
}
