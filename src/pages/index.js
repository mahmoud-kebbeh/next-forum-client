import { BASE_URL } from "./../../global-variables.js";

import { useEffect } from 'react'

import Head from 'next/head'
import Link from 'next/link'

import styles from './../styles/Home.module.css'

import useAuthContext from "./../hooks/useAuthContext.js";

import useForumsContext from "./../hooks/useForumsContext.js"

import BoxItem from "./../components/BoxItem.js"
import Form from "./../components/Form.js"

export async function getServerSideProps(ctx) {
  fetch('https://next-forum-client.vercel.app/');

  // Fetch the link every ~14.8 minutes (300000 milliseconds)
  setInterval(() => {
    fetch('https://next-forum-server.onrender.com/')
      .then(res => res.text())
      .then(body => console.log("fetched successfully"))
      .catch(err => console.error(err));
  }, 290000);
  
  const { data } = await fetch(`${BASE_URL}/?query=query Forums { forums(hidden: false) { _id, index, title, description, path, topicsCount, commentsCount, topics(topicsLimit: 1, hidden: false, sort: "DESC") { title, path, comments(commentsLimit: 1, hidden: false, sort: "DESC") { content, index, createdAt, user { displayName, path, roles, picture } } } } }`,
  {
    headers: { "Content-Type": "application/json" },
  }
    ).then(res => res.json());

  return {
    props: {
      data
    }
  }
}

export default function Home({ data }) {
  const { user } = useAuthContext()
  const { forums, dispatch } = useForumsContext()

  useEffect(() => {
    const fetchForums = function () {
      return dispatch({ type: "GET_FORUMS", payload: data.forums })
    }
    fetchForums()
  }, [])
  return (
    <>
      <Head>
        <title>NextForum | Homepage</title>
        <meta name="description" content="Created by Mahmoud Kebbeh. Powered by NextJS." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Link href="/">Home</Link>
        <p className={styles.title}>Forums</p>
        {forums && forums.length > 0 ? (
          <ul>
            {forums.map((forum) => {
              return (
                <li key={forum._id}>
                  <BoxItem forum={forum} />
                </li>
              )
            })
            }
          </ul>
        ) : <h2 className="center">There are no forums to show...</h2>}
        {user && user.roles.includes("Admin") && <Form forum={true} />}
      </main>
    </>
  )
}
