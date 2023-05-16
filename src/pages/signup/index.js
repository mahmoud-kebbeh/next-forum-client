import { useState } from "react";

import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import useAuthContext from "./../../hooks/useAuthContext.js";
import useSignup from "./../../hooks/useSignup.js";

import styles from "./../../styles/Auth.module.css";

export default function Signup() {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signup, isLoading, error } = useSignup();
  const { dispatch } = useAuthContext();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await signup(displayName, email, password);
    if (result) {
      dispatch({ type: "LOGIN", payload: result });

      router.push("/")
    };
  };

  return (
    <>
      <Head>
        <title>NextForum | Signup</title>
        <meta
          name="description"
          content="Created by Mahmoud Kebbeh. Powered by NextJS."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h2>Sign up for an account</h2>
        <form onSubmit={handleSubmit}>
          <input
            className={styles.input}
            type="text"
            placeholder="Display Name"
            name="displayName"
            id="displayName"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
          />
          <input
            className={styles.input}
            type="email"
            placeholder="Email"
            name="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            Sign Up
          </button>
        </form>
        {error && <div className="error">{error}</div>}
        <div>
          Already have an account? <Link href="/login">Log In</Link>
        </div>
      </main>
    </>
  );
}
