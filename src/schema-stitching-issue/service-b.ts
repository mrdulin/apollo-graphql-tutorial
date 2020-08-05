import { ApolloServer, gql } from 'apollo-server';

const typeDefs = gql`
  type User {
    b: String
  }
  type Query {
    user: User
  }
`;
const resolvers = {
  Query: {
    user: () => ({ b: 'b' }),
  },
};

const server = new ApolloServer({ typeDefs, resolvers });
const port = 3002;
server.listen(port).then(({ url }) => console.log(`Service B is ready at ${url}`));
