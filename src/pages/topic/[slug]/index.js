import { useEffect } from "react"

import Head from "next/head"
import Link from "next/link"

import useAuthContext from "./../../../hooks/useAuthContext.js"
import useCommentsContext from "./../../../hooks/useCommentsContext.js"

import CommentBox from "./../../../components/comment-box/CommentBox.js"
import Form from "./../../../components/form/Form.js"

const host = process.env.HOST;

export async function getServerSideProps({ params }) {
  const { data } = await fetch(
    `${host}?query=query Comments{topics{_id, createdAt, forumId, title, slug, comments{_id, createdAt, content, user{_id, displayName, path, commentsCount}} forum{title, path}}}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  ).then((res) => res.json())

  const topic = data.topics.find((topic) => topic.slug === params.slug)

  return {
    props: {
      params,
      topic
    },
  }
}

export default function Topic({ params, topic }) {
  const { comments, dispatch } = useCommentsContext()
  const { user } = useAuthContext();

  useEffect(()=> {
    const fetchComments = async function () {
      return dispatch({ type: "GET_COMMENTS", payload: topic.comments })
    }
    fetchComments()
  }, [])

  const title = `NextForum | ${topic.title}`
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Created by Mahmoud Kebbeh. Powered by NextJS." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {topic && (
        <>
          <div className="header">
            <h2>{topic.title}</h2>
            <p>Back to <Link href={topic.forum.path}>{topic.forum.title}</Link></p>
          </div>
          <ul>
          {comments && comments.map(comment => (
            <li key={comment._id}>
              <CommentBox comment={comment} />
            </li>
          ))
          }
          </ul>
          {user && <Form commentContent={true} topicId={topic._id} forumId={topic.forumId}/>}
        </>
      )}
    </>
  )
}