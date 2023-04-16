import "./../styles/globals.css";

import { AuthContextProvider } from "./../context/AuthContext.js"
import { ForumsContextProvider } from "./../context/ForumsContext.js"
import { TopicsContextProvider } from "./../context/TopicsContext.js"
import { CommentsContextProvider } from "./../context/CommentsContext.js"

import Layout from "./../components/layout/Layout.js"

export default function App({ Component, pageProps }) {
  return (
      <AuthContextProvider initialData={pageProps?.initialData}>
        <ForumsContextProvider>
          <TopicsContextProvider>
            <CommentsContextProvider>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </CommentsContextProvider>
          </TopicsContextProvider>
        </ForumsContextProvider>
      </AuthContextProvider>
  )
}
