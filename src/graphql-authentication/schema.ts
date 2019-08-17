import { applyMiddleware } from 'graphql-middleware';
import { typeDefs } from './typeDefs';
import { resolvers } from './resolvers';
import { makeExecutableSchema } from 'graphql-tools';
import { authMiddleware } from './middleware';

const schema = makeExecutableSchema({ typeDefs, resolvers });
const schemaWithMiddleware = applyMiddleware(schema, authMiddleware);

export { schemaWithMiddleware as schema };
