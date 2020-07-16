import { GraphQLSchemaModule } from 'apollo-server';
import { resolvers } from './resolvers';
import { typeDefs } from './typeDefs';

const tagModule: GraphQLSchemaModule = {
  typeDefs,
  resolvers,
};
export { tagModule as Tag };
