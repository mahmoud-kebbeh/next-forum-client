import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"

import styles from "./../styles/Layout.module.css"

import useAuthContext from "./../hooks/useAuthContext.js"
import useLogout from "./../hooks/useLogout.js"

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
          {user && (
            <>
              <span>Logged in as: <Link href={user.path} className={`${user.roles.includes("Admin") ? "admin" : user.roles.includes("Supermod") || user.roles.includes("Mod") ? "staff" : ""}`}>{user.displayName}</Link></span>
              <form onSubmit={(e) => {
                  e.preventDefault();
                  logout();
                }}>
                <button type="submit">Logout</button>
              </form>
            </>
          )}
          {!user && (
            <>
              <li><Link href="/login">Login</Link></li>
              <li><Link href="/signup">Signup</Link></li>
            </>
          )}
        </ul>
      </header>
      {children}
      <footer className={styles.footer}>
        <p><Link href="/profile/1-mahmoud-kebbeh" className="admin">Mahmoud Kebbeh</Link></p>
        Copyright &copy; 2021-{now.getFullYear()}. All rights reserved.
      </footer>
    </div>
  )
}
