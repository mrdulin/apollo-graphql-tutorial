import { resolversWIthCombineResolvers } from './resolversWIthCombineResolvers';
import { typeDefs } from './typeDefs';
import { makeExecutableSchema } from 'graphql-tools';

const schema = makeExecutableSchema({
  typeDefs,
  resolvers: resolversWIthCombineResolvers,
});

export { schema };
