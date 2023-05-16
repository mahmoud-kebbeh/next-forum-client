import { BASE_URL } from "./../../global-variables.js"

import { useState } from "react";

import { useMutation, gql } from '@apollo/client';

import useAuthContext from "./../hooks/useAuthContext.js";

import useForumsContext from "./../hooks/useForumsContext.js";
import useTopicsContext from "./../hooks/useTopicsContext.js";
import useCommentsContext from "./../hooks/useCommentsContext.js";

import styles from "./../styles/Form.module.css";

const CREATE_FORUM = gql`
  mutation CreateForum($title: String!, $description: String) {
    createForum(title: $title, description: $description) {
      _id
      index
      title
      description
      path
      topicsCount
      commentsCount
      topics {
        title
        path
        userId
        user {
          displayName
          path
          roles
          picture
        }
        comments {
          content
          index
          createdAt
          user {
            displayName
            path
            roles
            picture
          }
        }
      }
    }
  }
`;

const CREATE_TOPIC_WITH_COMMENT = gql`
  mutation CreateTopicWithComment($title: String!, $content: String!, $userId: ID!, $forumId: ID!) {
    createTopicWithComment(title: $title, content: $content, userId: $userId, forumId: $forumId) {
      _id
      path
      title
      userId
      user {
        displayName
        path
        roles
        picture
      }
      comments {
        content
        index
        createdAt
        user {
          displayName
          path
          roles
          picture
        }
      }
    }
  }
`;

const CREATE_COMMENT = gql`
  mutation CreateComment($content: String!, $userId: ID!, $topicId: ID!) {
    createComment(content: $content, userId: $userId, topicId: $topicId) {
      _id
      userId
      content
      index
      createdAt
      user {
        commentsCount
        displayName
        path
        roles
        picture
      }
    }
  }
`;

export default function Form({
  forum,
  topic,
  comment,
  topicId,
  forumId,
}) {
  const { user } = useAuthContext();
  const userId = user && user._id;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");

  const [ createForum, { error: errorForum, loading: loadingForum, data: dataForum } ] = useMutation(CREATE_FORUM, {
    variables: { title, description }
  })
  const [ createTopicWithComment, { error: errorTopic, loading: loadingTopic, data: dataTopic } ] = useMutation(CREATE_TOPIC_WITH_COMMENT, {
    variables: { title, content, userId, forumId }
  })
  const [ createComment, { error: errorComment, loading: loadingComment, data: dataComment } ] = useMutation(CREATE_COMMENT, {
    variables: { content, userId, topicId }
  })

  // const { user } = useAuthContext();

  // const userId = user._id || "643a817399a3ec75f21d4919";

  const pattern = /^\s*$/;

  const { dispatch: setForum } = useForumsContext();
  const { dispatch: setTopic } = useTopicsContext();
  const { dispatch: setComment } = useCommentsContext();
  
  const handleSubmitForm = async (e) => {
    e.preventDefault();

    if (title && pattern.test(title)) {
      return new Error("Title cannot be empty!");
    }
    if (content && pattern.test(content)) {
      return new Error("You cannot post an empty comment!");
    }
    if (description && pattern.test(description)) {
      return new Error("Description cannot be empty!");
    }

    try {
      if (forum) {
        const { data } = await createForum()

        setTitle("");
        setDescription("");
        setForum({ type: "CREATE_FORUM", payload: data.createForum });
      }
      if (topic) {
        const { data } = await createTopicWithComment()

        setTitle("");
        setContent("");
        setTopic({ type: "CREATE_TOPIC", payload: data.createTopicWithComment });
      }
      if (comment) {
        const { data } = await createComment()

        setContent("");
        setComment({ type: "CREATE_COMMENT", payload: data.createComment });
      }
    } catch (error) {
      return new Error(error.message);
    }
  };

  if (user) {
    return (
      <div className={styles.container}>
        <hr />
        {forum ? (
            <h2>Add a new Forum</h2>
          )
          :
          topic ?
          (
            <h2>Add a new Topic</h2>
          )
          :
          null
        }
        <form onSubmit={handleSubmitForm} className={styles.form}>
          {forum || topic ? (
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
          {forum && (
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
          {topic || comment ? (
            <label>
              {comment ? (
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
          <button type="submit" disabled={ loadingForum || loadingTopic || loadingComment } className={styles.button}>Add
            {forum === true
              ? ` Forum`
              : topic === true
              ? ` Topic`
              : ` Comment`}
          </button>
          {errorForum || errorTopic || errorComment ? <h4 className={styles.error}>{errorForum || errorTopic || errorComment}</h4> : null}
        </form>
      </div>
    );
  }
}
