import { useEffect } from "react"

import Head from "next/head"
import Link from "next/link"

import useTopicsContext from "./../../../hooks/useTopicsContext.js"
import useAuthContext from "./../../../hooks/useAuthContext.js";

import BoxItem from "./../../../components/box-item/BoxItem.js"
import Form from "./../../../components/form/Form.js"

const host = process.env.HOST;

export async function getServerSideProps({ params }) {
  const { data } = await fetch(
    `${host}?query=query Topics{forums{_id, title, description, slug, topics{_id, createdAt, title, path, commentsCount, user{displayName, path} comments(commentsLimit: 1){createdAt, index, user{displayName, path}}}}}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  ).then((res) => res.json())

  const forum = data.forums.find((forum) => forum.slug === params.slug)

  return {
    props: {
      params,
      forum,
    },
  }
}

export default function Forum({ params, forum }) {
  const { topics, dispatch } = useTopicsContext()
  const { user } = useAuthContext();

  useEffect(()=> {
    const fetchTopics = function () {
      return dispatch( { type: "GET_TOPICS", payload: forum.topics } )
    }
    fetchTopics()
  }, [])

  const title = `NextForum | ${forum.title}`
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Created by Mahmoud Kebbeh. Powered by NextJS." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {topics && (
        <ul>
          {topics.map((topic) => {
            return (
              <li key={topic._id}>
                <BoxItem
                  topic={topic}
                  user={topic.comments[0] && topic.comments[0].user}
                  comment={topic.comments[0]}
                  commentLink={topic.path}
                />
              </li>
            )
          })}
        </ul>
      )}
      {user &&
      (<>
        <hr />
        <h2 id="test">Add a new topic</h2>
        <Form topicTitle={true} topicContent={true} forumId={forum._id} />
      </>)
      }
    </>
  )
}