import { ApolloClient } from 'apollo-client';
import { RestLink } from 'apollo-link-rest';
import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';
import fetch from 'isomorphic-fetch';

const restLink = new RestLink({
  uri: 'http://localhost:3000/api/',
  customFetch: fetch,
  headers: {
    'Content-Type': 'application/json',
  },
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: restLink,
});

const getbyhashQuery = gql`
  fragment Payload on REST {
    hash: String
  }
  query Me($input: Payload!) {
    person(input: $input) @rest(type: "Person", method: "POST", path: "transaction/getbyhash") {
      email
      name
    }
  }
`;
const payload = { hash: '4e23f9e1d1729996de46fc94d28475b4614f101d72a98f221493f900dc33e0c2' };

client.query({ query: getbyhashQuery, variables: { input: payload } }).then((res) => {
  console.log(res.data);
});
