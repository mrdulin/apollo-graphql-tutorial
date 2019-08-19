import { applyMiddleware } from 'graphql-middleware';
import { makeExecutableSchema } from 'graphql-tools';

import { authMiddleware } from './middleware';
import { resolvers } from './resolvers';
import { typeDefs } from './typeDefs';

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const schemaWithMiddleware = applyMiddleware(schema, authMiddleware);
export { schemaWithMiddleware as schema };
