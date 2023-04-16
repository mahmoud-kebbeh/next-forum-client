import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router";

import useAuthContext from "./../../hooks/useAuthContext.js"
import useLogout from "./../../hooks/useLogout.js"

import styles from "./Layout.module.css"

export default function Layout({ children }) {
  const { user } = useAuthContext()
  const { logout } = useLogout()
  const router = useRouter()

  const now = new Date()

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/">NextForum</Link>
        <ul>
          {user ? (<>
          {false && <><li><Link href="/submit">create</Link></li>
          <li><Link href="/notifications">notifications</Link></li>
          <li><Link href="/messenger">messages</Link></li>
          </>}
          <li>
            <ul>
              <li><Link href={user.path}>{user.displayName}</Link></li>
              <li>
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    logout()
                    router.push("/");
                  }}
                >
                  <button type="submit" className={styles.button}>Logout</button>
                </form>
              </li>
            </ul>
          </li></>)
          :
          (
            <>
              <li><Link href="/login">Login</Link></li>
              <li><Link href="/signup">Signup</Link></li>
            </>
          )
          }
        </ul>
      </header>
      <main>
        {children}
      </main>
      <footer className={styles.footer}>
        <p><Link href="/profile/1-mahmoud-kebbeh">Mahmoud Kebbeh</Link></p>
        Copyright &copy; 2020-{now.getFullYear()}. All rights reserved.
      </footer>
    </div>
  )
}
