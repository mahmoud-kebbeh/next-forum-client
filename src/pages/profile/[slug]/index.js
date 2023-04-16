import Head from "next/head";

import CommentPreview from "./../../../components/comment-preview/CommentPreview.js";

const host = process.env.HOST;

export async function getServerSideProps({ params }) {
  const { data } = await fetch(
    `${host}?query=query Profile{users{displayName, slug, comments(commentsLimit: 20){_id, createdAt, index, content, topic{title, path}}}}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  ).then((res) => res.json());

  const user = data.users.find((user) => user.slug === params.slug);

  return {
    props: {
      params,
      user,
    },
  };
}

export default function Profile({ params, user }) {
  const title = `NextForum | ${user.displayName}`;
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="forum" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {user.comments && (
        <ul>
          {user.comments.map((comment) => {
            return (
              <li key={comment._id}>
                <CommentPreview comment={comment} topic={comment.topic} />
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
