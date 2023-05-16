import { BASE_URL } from "./global-variables.js";

import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  // ssrMode: true,
  link: createHttpLink({
    uri: BASE_URL,
    // credentials: 'same-origin',
    // headers: {
    //   cookie: req.header('Cookie'),
    // },
  }),
  cache: new InMemoryCache(),
  // onError: ({ networkError, graphQLErrors }) => {
  //   console.log('graphQLErrors', graphQLErrors)
  //   console.log('networkError', networkError)
  // }
});

export default client;
