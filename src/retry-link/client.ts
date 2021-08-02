import { RetryLink } from '@apollo/client/link/retry';
import { onError } from '@apollo/client/link/error';
import { ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client';
import { gql } from 'apollo-server';
import fetch from 'isomorphic-fetch';

// handle graphql errors, retry only once
// const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
//   if (graphQLErrors) {
//     graphQLErrors.forEach(({ message, locations, path }) =>
//       console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`),
//     );
//     for (let err of graphQLErrors) {
//       console.log(err);
//       if (err.message === 'something bad happened') {
//         return forward(operation);
//       }
//     }
//   }
// });

// handle network errors
const retryLink = new RetryLink({
  delay: {
    initial: 300,
    max: Infinity,
    jitter: true,
  },
  attempts: {
    max: 4,
    retryIf: (error, operation) => {
      console.log('error: ', error.message, 'retrying...');
      return !!error;
    },
  },
});

const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql',
  fetch,
});

const client = new ApolloClient({
  link: from([retryLink, httpLink]),
  cache: new InMemoryCache(),
});

const helloQuery = gql`
  query {
    hello
  }
`;

client
  .query({ query: helloQuery })
  .then(console.log)
  .catch((error) => {
    console.log('Error: ', error);
  });
