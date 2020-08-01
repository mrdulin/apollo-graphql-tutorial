import { gql, makeExecutableSchema } from 'apollo-server';

const typeDefs = gql`
  type Query {
    hello: String
  }
`;
const resolvers = {
  Query: {
    hello() {
      return 'Hello World';
    },
  },
};
const schema1 = makeExecutableSchema({ typeDefs, resolvers });

export { schema1 };
