import { ApolloServer, gql } from 'apollo-server';

const typeDefs = gql`
  type User {
    a: String
  }
  type Query {
    user: User
  }
`;
const resolvers = {
  Query: {
    user: () => ({ a: 'a' }),
  },
};

const server = new ApolloServer({ typeDefs, resolvers });
const port = 3001;
server.listen(port).then(({ url }) => console.log(`Service A is ready at ${url}`));
