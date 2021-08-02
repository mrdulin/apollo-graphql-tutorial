import { ApolloServer, gql } from 'apollo-server';

let retryCount = 0;
const typeDefs = gql`
  type Query {
    hello: String
  }
`;
const resolvers = {
  Query: {
    hello: () => {
      console.log('Retry count: ', ++retryCount);
      throw new Error('something bad happened');
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Apollo server is listening on ${url}`);
});
