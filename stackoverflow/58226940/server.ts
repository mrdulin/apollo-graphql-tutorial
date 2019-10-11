import { ApolloServer, gql } from 'apollo-server-express';

const typeDefs = gql`
  type Query {
    _: Boolean
  }
`;

function contextFunction({ req, res }) {
  return { req, res };
}

const server = new ApolloServer({
  typeDefs,
  context: contextFunction,
});

export { server, contextFunction };
