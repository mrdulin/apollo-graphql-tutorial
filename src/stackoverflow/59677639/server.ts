import { ApolloServer, gql } from 'apollo-server';
import graphql from 'graphql.js';

const typeDefs = gql`
  type Query {
    _: String
  }
`;
const resolvers = {
  Query: {
    _: () => 'Hello',
  },
};
const server = new ApolloServer({
  typeDefs,
  resolvers,
});
server.listen().then(async ({ url }) => {
  console.log(`Apollo server is listening on ${url}graphql`);
  const graph = graphql(`${url}graphql`, { asJSON: true });
  const helloQuery = graph(`
    query {
      _
    }
  `);
  const actual = await helloQuery();
  console.log('actual: ', actual);
  server.stop();
});
