import { BASE_URL } from "./../../../../global-variables.js"

import { useEffect } from "react"

import Head from "next/head"
import Link from "next/link"

import styles from './../../../styles/Forum.module.css'

// import useAuthContext from "./../../../hooks/useAuthContext.js";

import useTopicsContext from "./../../../hooks/useTopicsContext.js"

import BoxItem from "./../../../components/BoxItem.js"
import Form from "./../../../components/Form.js"

export async function getServerSideProps({ params }) {
	const { data } = await fetch(
    `${BASE_URL}/?query=query Forum {
	    forum(slug: "${params.slug}") {
	    	_id
	      title
	      description
	      slug
	      topics(hidden: ${false}, sort: "DESC") {
	      	_id
          commentsCount
	      	title
	        path
          userId
          user {
            _id
            displayName
            path
            roles
            picture
          }
	      	comments(commentsLimit: 1, hidden: ${false}, sort: "DESC") {
		        content
		        index
		        createdAt
		        user {
              _id
		          displayName
		          path
              roles
              picture
		        }
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

export default function Forum({ data }) {
  const { topics, dispatch } = useTopicsContext()
  // const { user } = useAuthContext();

  useEffect(()=> {
    const fetchTopics = function () {
      return dispatch( { type: "GET_TOPICS", payload: data.forum.topics } )
    }
    fetchTopics()
  }, [])

  const title = `NextForum | ${data.forum.title}`
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Created by Mahmoud Kebbeh. Powered by NextJS." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <span>Back to <Link href="/">Home</Link></span>
        <p className={styles.title}>Forum &gt; {data.forum.title}</p>
        {topics && topics.length > 0 ? (
          <ul>
            {topics.map((topic) => {
              return (
                <li key={topic._id}>
                  <BoxItem topic={topic} />
                </li>
              )
            })}
          </ul>
        ) : <h2 className="center">There are no topics to show...</h2>}
        <Form topic={true} forumId={data.forum._id} />
      </main>
    </>
  )
}