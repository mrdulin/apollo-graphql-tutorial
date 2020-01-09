import { ApolloServer, gql } from 'apollo-server';
import { GraphQLError } from 'graphql';

const typeDefs = gql`
  type Query {
    _: Boolean
  }
`;
const resolvers = {
  Query: {
    _: () => {
      throw new Error('error');
    },
  },
};
const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError(error: GraphQLError) {
    return error.message as any;
  },
});

server.listen().then(({ url }) => {
  console.log(`Apollo server is listening on ${url}`);
});
