import './../styles/globals.css'

import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

import { AuthContextProvider } from "./../context/AuthContext.js"

import { ForumsContextProvider } from "./../context/ForumsContext.js"
import { TopicsContextProvider } from "./../context/TopicsContext.js"
import { CommentsContextProvider } from "./../context/CommentsContext.js"

import Layout from "./../components/Layout.js"

const client = new ApolloClient({
  uri: 'https://tense-hare-crown.cyclic.app/',
  cache: new InMemoryCache(),
});

export default function App({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
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
    </ApolloProvider>
    )
}
