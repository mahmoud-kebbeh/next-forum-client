import { useEffect } from "react";

import Head from "next/head";

import { getAuthentication } from "./../utils/getAuthentication.js";

import styles from "./../styles/Home.module.css";

import useForumsContext from "./../hooks/useForumsContext.js";
import useAuthContext from "./../hooks/useAuthContext.js";

import BoxItem from "./../components/box-item/BoxItem.js";
import Form from "./../components/form/Form.js";

import Custom500 from "./500.js";

const host = process.env.HOST;

export async function getServerSideProps(ctx) {
  // console.log(Object.keys(ctx.req));

  const { authorization, user } = getAuthentication(ctx);
  // if (!user) {
  //     return {
  //     redirect: {
  //       destination: '/login',
  //       permanent: false,
  //     },
  //   }
  //   }

  if (user) {
    const { data } = await fetch(
      `${host}?query=query Forums{forums{_id, title, path, description, commentsCount, topicsCount, topics(topicsLimit: 1){path}, comments(commentsLimit: 1){createdAt, index, user{displayName, path}}}user(_id:"${user._id}"){_id, displayName, path}}`,
      {
        headers: {
          "Content-Type": "application/json",
          authorization,
        },
      }
    ).then((res) => res.json());

    const initialData = data.user;

    return {
      props: {
        data,
        initialData,
      },
    };
  }

  // query User{user(token:"${authorization}"){displayName}}
  // console.log(data.user);

  // if (true) {
  //   return {
  //     notFound: true,
  //   }
  // }

  if (!user) {
    const { data } = await fetch(
      `${host}?query=query Forums{forums{_id, title, path, description, commentsCount, topicsCount, topics(topicsLimit: 1){path}, comments(commentsLimit: 1){createdAt, index, user{displayName, path}}}}`,
      {
        headers: {
          "Content-Type": "application/json",
          authorization,
        },
      }
    ).then((res) => res.json());

    return {
      props: {
        data,
      },
    };
  }
}

export default function Home({ data }) {
  // if (!data) {
  //   // throw new Error("Oh shit")
  //   // return <Custom500 />
  // }
  const { forums, dispatch } = useForumsContext();
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchForums = function () {
      return dispatch({ type: "GET_FORUMS", payload: data.forums });
    };
    fetchForums();
  }, []);

  return (
    <>
      <Head>
        <title>NextForum | Homepage</title>
        <meta
          name="description"
          content="Created by Mahmoud Kebbeh. Powered by NextJS."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        {forums && (
          <ul>
            {forums.map((forum) => {
              return (
                <li key={forum._id}>
                  <BoxItem
                    forum={forum}
                    user={forum.comments[0] && forum.comments[0].user}
                    comment={forum.comments[0] && forum.comments[0]}
                    commentLink={forum.topics[0] && forum.topics[0].path}
                  />
                </li>
              );
            })}
          </ul>
        )}
        {user && (
          <>
            <hr />
            <h2>Add a new forum</h2>
            <Form forumTitle={true} forumDescription={true} />
          </>
        )}
      </main>
    </>
  );
}
