import { BASE_URL } from "./../../global-variables.js"

import { useState } from "react"

import Image from "next/image"
import Link from "next/link"

import formatDistanceToNow from "date-fns/formatDistanceToNow"

import { useMutation, gql } from '@apollo/client';

import useAuthContext from "./../hooks/useAuthContext.js";

import useForumsContext from "./../hooks/useForumsContext.js";
import useTopicsContext from "./../hooks/useTopicsContext.js";
import useCommentsContext from "./../hooks/useCommentsContext.js";

import Form from "./Form.js"

import styles from "./../styles/BoxItem.module.css"

const DELETE_FORUM = gql`
	mutation DeleteForum($id: ID!) {
		deleteForum(_id: $id)
	}
`;

const DELETE_TOPIC = gql`
	mutation DeleteTopic($id: ID!) {
		deleteTopic(_id: $id)
	}
`;

const DELETE_COMMENT = gql`
	mutation DeleteComment($id: ID!) {
		deleteComment(_id: $id)
	}
`;

const EDIT_COMMENT = gql`
	mutation UpdateComment($id: ID!, $content: String!) {
		updateComment(_id: $id, content: $content) {
			_id
      userId
      content
      index
      createdAt
      user {
        commentsCount
        displayName
        picture
        path
        roles
      }
    }
	}
`;

export default function BoxItem({
	forum,
	topic,
	comment,
}) {
  const [editedComment, setEditedComment] = useState("")
  const [showEditComment, setShowEditComment] = useState(false)

  const { user } = useAuthContext();

  const { dispatch: setForum } = useForumsContext();
  const { dispatch: setTopic } = useTopicsContext();
  const { dispatch: setComment } = useCommentsContext();

	const [ deleteForum, { error: errorForum, loading: loadingForum, data: dataForum } ] = useMutation(DELETE_FORUM, {
		variables: { id: forum && forum._id }
	});
	const [ deleteTopic, { error: errorTopic, loading: loadingTopic, data: dataTopic } ] = useMutation(DELETE_TOPIC, {
		variables: { id: topic && topic._id }
	});
	const [ deleteComment, { error: errorComment, loading: loadingComment, data: dataComment } ] = useMutation(DELETE_COMMENT, {
		variables: { id: comment && comment._id }
	});

	const [ updateComment, { error: errorUpdateComment, loading: loadingUpdateComment, data: dataUpdateComment } ] = useMutation(EDIT_COMMENT, {
		variables: { id: comment && comment._id, content: editedComment }
	});

  const lastTopic = forum && forum.topics[0] ? forum.topics[0] : undefined;
  const lastComment = forum && forum.topics[0] && forum.topics[0].comments[0] ? forum.topics[0].comments[0] : topic && topic.comments[0] ? topic.comments[0] : undefined;

	let createdAt;
	if (lastComment) {
		createdAt = formatDistanceToNow(new Date(Number(lastComment.createdAt)), {
			addSuffix: true,
		})
		.replace(/about |over |almost |/i, '')
	} else if (topic && topic.comments[0]) {
		createdAt = formatDistanceToNow(new Date(Number(topic.comments[0].createdAt)), {
			addSuffix: true,
		})
		.replace(/about |over |almost |/i, '')
	} else if (comment) {
		createdAt = formatDistanceToNow(new Date(Number(comment.createdAt)), {
			addSuffix: true,
		})
		.replace(/about |over |almost |/i, '')
	}

  const pattern = /^\s*$/;

	const removeBoxItem = async (e) => {
		e.preventDefault();

    try {
	    if (forum) {
	    	const { data } = await deleteForum();

		    setForum({ type: "DELETE_FORUM", payload: data.deleteForum === true ? forum : null })
	    }
			if (topic) {
	    	const { data } = await deleteTopic();

		    setTopic({ type: "DELETE_TOPIC", payload: data.deleteTopic === true ? topic : null })
		  }
		  if (comment) {
	    	const { data } = await deleteComment();

		    setComment({ type: "DELETE_COMMENT", payload: data.deleteComment === true ? comment : null })
		  }
    } catch (error) {
	    return new Error(error.message);
    }
	}

	const openEditComment = (e) => {
		e.preventDefault();

    try {
	    // setComment({ type: "DELETE_COMMENT", payload: comment })
    	
    	return setShowEditComment(true)
    } catch (error) {
	    return new Error(error.message);
    }
	}

	const closeEditComment = (e) => {
		e.preventDefault();

    try {
	    // setComment({ type: "DELETE_COMMENT", payload: comment })
    	
    	return setShowEditComment(false)
    } catch (error) {
	    return new Error(error.message);
    }
	}

	const handleUpdateComment = async (e) => {
		e.preventDefault();

    try {
	    if (pattern.test(editedComment)) {
	    	console.log("hi")
	      throw new Error("You cannot post an empty comment!");
	    }

		  if (editedComment) {
	    	const { data } = await updateComment();
		    setComment({ type: "EDIT_COMMENT", payload: data.updateComment })
	    	
	    	return setShowEditComment(false)
		  }
    } catch (error) {
	    return new Error(error.message);
    }
	}

	return (
		<>
		{forum || topic ? <div className={styles.container}>
			<div className={styles.box}>
				{forum && <div className={styles['forum-info']}>
					<div>
						<Link href={forum.path} className={styles['forum-title']}>{forum.title}</Link>
					</div>
					{forum.description && <div>
						<p className={styles['forum-description']}>{forum.description}</p>
					</div>}
				</div>}
				{topic && ( <div className={styles['topic-info']}>
					<div>
						<Link href={topic.path} className={styles['topic-title']}>{topic.title}</Link>
					</div>
					<div>
						<p>By: <Link href={topic.user.path} className={`${topic.user.roles.includes("Admin") ? "admin" : topic.user.roles.includes("Supermod") || topic.user.roles.includes("Mod")? "staff" : ""}`}>{topic.user.displayName}</Link></p>
					</div>
				</div>
				)}
				<div className={styles.info}>
					<div className={styles.counts}>
						{forum ? (forum.commentsCount > 1 && (<p> {forum.commentsCount - forum.topicsCount} posts</p>)) || (forum.commentsCount === 2 && (<p>1 post</p>)) || <p>0 posts</p> : null}
						{topic ? (topic.commentsCount > 1 && (<p> {topic.commentsCount - 1} posts</p>)) || (topic.commentsCount === 2 && (<p>1 post</p>)) || <p>0 posts</p> : null}
					</div>
					{lastComment && <div className={styles['last-comment']}>
						{lastComment && <div><Link href={lastComment.user.path} className={`${lastComment.user.roles.includes("Admin") ? "admin" : lastComment.user.roles.includes("Supermod") || lastComment.user.roles.includes("Mod")? "staff" : ""}`}>{lastComment.user.displayName}</Link></div>}
						{forum && <div><Link href={`${forum.topics[0].path}#${lastComment.index}`}>
							{createdAt && createdAt[0].toUpperCase()}
							{createdAt && createdAt.substring(1)}
						</Link></div>}
						{topic && <div><Link href={`${topic.path}#${lastComment.index}`}>
							{createdAt && createdAt[0].toUpperCase()}
							{createdAt && createdAt.substring(1)}
						</Link></div>}
					</div>}
				</div>
			</div>
			<div className={styles.buttons}>
			{forum && user && user.roles.includes("Admin") && <button onClick={removeBoxItem} className={styles.delete} disabled={ loadingForum }>Delete Forum</button>}
			{topic && user && (user.roles.includes("Admin") || ((user.roles.includes("Supermod") && !topic.user.roles.includes("Admin")) || (user.roles.includes("Mod") && !topic.user.roles.includes("Admin"))) || user._id === topic.user._id) && <button onClick={removeBoxItem} className={styles.delete} disabled={ loadingTopic }>Delete Topic</button>}
			</div>
		</div> : null}
		{comment ? (
			<div className={styles.container}>
				<div className={[styles.box, styles.comment].join(' ')}>
					<div className={styles['user-info']}>
						<div className={styles['user-box']}>
							<Link href={comment.user.path}>
		            {comment.user.picture ? <img className={styles['user-picture']} src={`${BASE_URL}/img/users/${comment.user.picture}`} width={75} height={75} alt="profile picture" /> : <img className={styles['user-picture']} src={`${BASE_URL}/img/users/default_photo.jpg`} width={75} height={75} alt="profile picture" />}
		          </Link>
		          <Link href={comment.user.path} className={`${comment.user.roles.includes("Admin") ? "admin" : comment.user.roles.includes("Supermod") || comment.user.roles.includes("Mod")? "staff" : ""}`}>
			          {comment.user.displayName}
		          </Link>
		          <p>{comment.user.commentsCount} posts</p>
						</div>
						
					</div>
					<div className={styles["comment-info"]}>
						<div>
							<p className={styles.timestamp}>
		            {createdAt[0].toUpperCase()}{createdAt.substring(1)}
		          </p>
						</div>
	          <p className={styles.content}>{comment.content}</p>
	        </div>
				</div>
				<div className={styles.buttons}>
					{comment && user && (user.roles.includes("Admin") || ((user.roles.includes("Supermod")  && !comment.user.roles.includes("Admin")) || (user.roles.includes("Mod") && !comment.user.roles.includes("Admin"))) || user._id === comment.userId) && <button onClick={openEditComment} className={styles.update} disabled={showEditComment}>Edit Comment</button>}
		      {comment && user && (user.roles.includes("Admin") || ((user.roles.includes("Supermod")  && !comment.user.roles.includes("Admin")) || (user.roles.includes("Mod") && !comment.user.roles.includes("Admin"))) || user._id === comment.userId) && <button type="submit" onClick={removeBoxItem} className={styles.delete} disabled={loadingComment}>Delete Comment</button>}
	      </div>
	      {showEditComment && (
			    <form onSubmit={handleUpdateComment}>
			    	<br />
			    	<div className={styles.edit}>
				      <textarea
		            className={[styles.input, loadingUpdateComment ? styles.saving : ""].join(' ')}
		            type="text"
		            id="content"
		            name="content"
		            defaultValue={comment.content}
                onChange={(e) => setEditedComment(e.target.value)}
		            rows="5"
		            required
		          />
	          </div>
	          <div className={styles.buttons}>
		          <button onClick={closeEditComment} className={styles.cancel}>Cancel Changes</button>
		          <button type="submit" className={styles.save} disabled={loadingUpdateComment}>Save Changes</button>
	          </div>
	          {errorUpdateComment ? <h4 className={styles.error}>{errorUpdateComment}</h4> : null}
          </form>
	      )}
			</div>
		)
		:
		null}
		</>
	)
}
