import { BASE_URL } from "./../../../../global-variables.js"

import { useEffect } from "react"

import Head from "next/head"
import Link from "next/link"

import styles from './../../../styles/Topic.module.css'

// import useAuthContext from "./../../../hooks/useAuthContext.js";

import useCommentsContext from "./../../../hooks/useCommentsContext.js"

import BoxItem from "./../../../components/BoxItem.js"
import Form from "./../../../components/Form.js"

export async function getServerSideProps({ params }) {
	const { data } = await fetch(
    `${BASE_URL}/?query=query Topic {
	    topic(slug: "${params.slug}") {
	    	_id
        userId
	      title
	      forum {
	      	title
	      	path
	      }
	      comments(hidden: ${false}, sort: "ASC") {
	      	_id
          topicId
          userId
	        content
	        index
	        createdAt
	        user {
            _id
            commentsCount
	          displayName
	          path
            roles
            picture
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

export default function Topic({ data }) {
  const { comments, dispatch } = useCommentsContext()
  // const { user } = useAuthContext();

  useEffect(()=> {
    const fetchTopics = function () {
      return dispatch( { type: "GET_COMMENTS", payload: data.topic.comments } )
    }
    fetchTopics()
  }, [])

  const title = `NextTopic | ${data.topic.title}`
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Created by Mahmoud Kebbeh. Powered by NextJS." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <span>Back to <Link href={data.topic.forum.path}>{data.topic.forum.title}</Link></span>
        <p className={styles.title}>Forum &gt; {data.topic.forum.title} &gt; {data.topic.title}</p>
        {comments && comments.length > 0 ? (
          <ul>
            {comments.map((comment) => {
              return (
                <li key={comment._id} id={comment.index}>
                  <BoxItem comment={comment} />
                </li>
              )
            })
          }
          </ul>
        ) : <h2 className="center">There are no comments to show...</h2>}
        <Form comment={true} topicId={data.topic._id} />
      </main>
    </>
  )
}