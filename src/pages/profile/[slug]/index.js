import { BASE_URL } from "./../../../../global-variables.js"

import { useState, useEffect } from "react"

import Head from "next/head"
import Link from "next/link"
import { useRouter } from 'next/router'

import formatDistanceToNow from "date-fns/formatDistanceToNow"

import { useMutation, gql } from '@apollo/client';

import useAuthContext from "./../../../hooks/useAuthContext.js"

import styles from './../../../styles/Profile.module.css'

export async function getServerSideProps({ params }) {
	const { data } = await fetch(
    `${BASE_URL}/?query=query User {
	    user(slug: "${params.slug}") {
	    	_id
	      displayName
        roles
	      path
        picture
        followers {
          _id
          createdAt
          displayName
          path
          picture
          roles
        }
        commentsCount
        comments(hidden: ${false}, sort: "DESC") {
          _id
          content
          index
          createdAt
          topic {
            _id
            commentsCount
            title
            path
            user {
              displayName
              path
              roles
            }
          }
        }
        createdAt
	      topics(hidden: ${false}, sort: "DESC") {
	      	_id
	      	title
	        path
          commentsCount
	      	comments(commentsLimit: 1, hidden: ${false}) {
		        content
		        index
		        createdAt
		      }
	      }
	    }
	  }
	  `,
	  {
      headers: {
        "Content-Type": "application/json",
      },
    }
  ).then(res => res.json())

  return {
    props: {
      data
    }
  }
}

const TOGGLE_FOLLOW_USER = gql`
  mutation ToggleFollowUser($followerId: ID!, $followingId: ID!) {
    toggleFollowUser(followerId: $followerId, followingId: $followingId)
  }
`;

export default function Profile({ data }) {
  const { user } = useAuthContext()

  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState("")
  const [follow, setFollow] = useState("")
  const [followersList, setFollowersList] = useState([])

  const router = useRouter()

  const followersIds = data.user.followers.map(follower => follower._id)
  // .sort((a,b)=> (b.displayName - a.displayName))

  const [ toggleFollowUser, { error: errorToggleFollowUser, loading: loadingToggleFollowUser, data: dataToggleFollowUser } ] = useMutation(TOGGLE_FOLLOW_USER, {
    variables: { followerId: user && user._id, followingId: data.user._id }
  });

  const toggleFollow = async (e) => {
    e.preventDefault();

    const { data } = await toggleFollowUser();

    if (!!followersList.find(follower => follower._id === user._id)) {
      setFollow("+ Follow")
      return setFollowersList(followersList.filter(follower => follower._id !== user._id))
    }
    else if (!!!followersList.find(follower => follower._id === user._id)) {
      setFollow("- Unfollow")
      return setFollowersList([...followersList, user])
    }
  };

  const handleUploadAvatar = async (e) => {
    e.preventDefault();

    setIsError("")

    if(!e.target[0].files[0]) return setIsError("Please choose an image first")

    setIsLoading(true)

    try {
      if(!e.target[0].files[0].type.startsWith("image")) {
        setIsLoading(false)
        setIsError("File is not an image")
        return;
      }

      if(e.target[0].files[0].size > 5 * 1024 * 1024) {
        setIsLoading(false)
        setIsError("Image size is too large")
        return;
      }

      const formData = new FormData();

      formData.append("avatar", e.target[0].files[0]);
      formData.append("_id", user && user._id);

      const response = await fetch(`${BASE_URL}/upload`, {
        method: "POST",
        body: formData,
      })

      const data = await response.json();

      if (!response.ok) {
        setIsLoading(false);
        setIsError(data.error);
        return;
      }

      setIsLoading(false);
      setIsError("");
      router.reload(window.location.pathname);
    } catch (error) {
      setIsLoading(false);
      setIsError(error);
    }
  }

	useEffect(()=> {
    const fetchFollowersList = function () {
      return setFollowersList(data.user.followers)
    }
    fetchFollowersList()
  }, [data.user.followers]);

  useEffect(()=>{
    const fetchFollowingState = function () {
      if (!!followersIds.find(_id => _id === user._id)) return setFollow("- Unfollow")
      if (!!!followersIds.find(_id => _id === user._id)) return setFollow("+ Follow")
    }
    user && fetchFollowingState()
  }, [user]);

  const title = `NextForum | ${data.user.displayName}`

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Created by Mahmoud Kebbeh. Powered by NextJS." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles['user-card']}>
        <div>
          <p><Link href={data.user.path}>
            {data.user.picture ? <img className={styles['user-picture']} src={`${BASE_URL}/img/users/${data.user.picture}`} width={100} height={100} alt="profile picture" /> : <img className={styles['user-picture']} src={`${BASE_URL}/img/users/default_photo.jpg`} width={100} height={100} alt="profile picture" />}
          </Link></p>
          <p><Link href={data.user.path} className={`${data.user.roles.includes("Admin") ? "admin" : data.user.roles.includes("Supermod") || data.user.roles.includes("Mod") ? "staff" : ""}`}>{data.user.displayName}</Link></p>
          <p>Forum {data.user.roles[0].substring(0,1).toUpperCase()}{data.user.roles[0].substring(1,)}</p>
          {((user && user._id === data.user._id) || (user && user.roles.includes("Admin"))) && <form onSubmit={handleUploadAvatar} >
            <input type="file" id="avatar" name="avatar" className={styles["custom-file-input"]} accept="image/*" />
            <button className={styles.btn} type="submit" disabled={isLoading}>Change Profile Picture</button>
          </form>}
          {isError && <p className="error">{isError}</p>}
        </div>
        <div className={styles['user-info']}>
          <div>
            <p><strong>POSTS</strong></p>
            <p>{data.user.commentsCount}</p>
          </div>
          <div>
            <p><strong>JOINED</strong></p>
            <p>{new Date(Number(data.user.createdAt)).toDateString()}</p>
          </div>
        </div>
        {user && user._id !== data.user._id && <button type="submit" className={styles.btn} onClick={toggleFollow} disabled={loadingToggleFollowUser}>{follow}</button>}
      </div>
      {followersList.length > 0 && (
        <div className={styles['user-followers']}>
          <h4>{followersList.length} Followers</h4>
          <ul>
            {followersList
              .sort((a, b) => {
                if (a.displayName < b.displayName) {
                  return -1;
                } else if (a.displayName > b.displayName) {
                  return 1;
                } else {
                  return 0;
                }
              })
              .map(follower => {
                return (
                  <li key={follower._id}>
                    <Link href={follower.path}>{follower.picture ? <img className={styles['user-picture']} src={`${BASE_URL}/img/users/${follower.picture}`} width={75} height={75} alt="profile picture" ></img> : <img className={styles['user-picture']} src={`${BASE_URL}/img/users/default_photo.jpg`} width={75} height={75} alt="profile picture" />}</Link>
                    <Link className={`${follower.roles.includes("Admin") ? "admin" : follower.roles.includes("Supermod") || follower.roles.includes("Mod") ? "staff" : ""}`} href={follower.path}>{follower.displayName}</Link>
                  </li>
                )
              })
              // .reverse()
            }
          </ul>
        </div>
        )}
      <div className={styles['user-comments']}>
        <h4>Activity</h4>
        {data && data.user && data.user.comments && data.user.comments.length > 0 ? (
          <ul>
            {data.user.comments.map((comment) => {
              return (
                <li key={comment._id} className={styles.comment}>
                  <p><Link href={`${comment.topic.path}#${comment.index}`}>{comment.topic.title}</Link></p>
                  <p><Link className={`${data.user.roles.includes("Admin") ? "admin" : data.user.roles.includes("Supermod") || data.user.roles.includes("Mod") ? "staff" : ""}`} href={data.user.path}>{data.user.displayName}</Link> replied to <Link className={`${comment.topic.user.roles.includes("Admin") ? "admin" : comment.topic.user.roles.includes("Supermod") || comment.topic.user.roles.includes("Mod") ? "staff" : ""}`} href={comment.topic.user.path}>{comment.topic.user.displayName}</Link>'s topic in <Link href={comment.topic.path}>{comment.topic.title}</Link>:</p>
                  {comment.content.length > 150 ? (<p>{comment.content.substring(0, 150)}...</p>) : (<p>{comment.content}</p>)}
                  <div className={styles['comment-info']}>
                    <span>{comment.topic.commentsCount} replies</span>
                    <span>{formatDistanceToNow(new Date(Number(comment.createdAt)), {
                      addSuffix: true,
                    })
                    .replace(/about |over |almost |/i, '')[0].toUpperCase()}{formatDistanceToNow(new Date(Number(comment.createdAt)), {
                      addSuffix: true,
                    })
                    .replace(/about |over |almost |/i, '').substring(1)}</span>
                  </div>
                </li>
              )
            })}
          </ul>
        ) : <h2 className="center">User has no activity to show...</h2>}
        </div>
    </>
    )
}
