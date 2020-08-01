import { gql, makeExecutableSchema } from 'apollo-server';
import { applyMiddleware } from 'graphql-middleware';
import { logCount } from '../middleware';

const typeDefs = gql`
  type Query {
    miss: String
  }
`;
const resolvers = {
  Query: {
    miss() {
      return 'I miss her';
    },
  },
};
let schema2 = makeExecutableSchema({ typeDefs, resolvers });
schema2 = applyMiddleware(schema2, logCount);

export { schema2 };
