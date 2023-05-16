import { useState } from "react";

import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import useAuthContext from "./../../hooks/useAuthContext.js";
import useLogin from "./../../hooks/useLogin.js";

import styles from "./../../styles/Auth.module.css";

export default function Login() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, error } = useLogin();
  const { dispatch } = useAuthContext();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(user, password);
    if (result) {
      dispatch({ type: "LOGIN", payload: result });

      router.push("/")
    };
  };

  return (
    <>
      <Head>
        <title>NextForum | Login</title>
        <meta
          name="description"
          content="Created by Mahmoud Kebbeh. Powered by NextJS."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h2>Log in to your account</h2>
        <form onSubmit={handleSubmit}>
          <input
            className={styles.input}
            type="text"
            placeholder="Username or Email"
            name="user"
            id="user"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            required
          />
          <input
            className={styles.input}
            type="password"
            placeholder="Password"
            name="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={isLoading}>
            Log In
          </button>
        </form>
        {error && <div className="error">{error}</div>}
        <div>
          Don't have an account? <Link href="/signup">Sign Up</Link>
        </div>
      </main>
    </>
  );
}
