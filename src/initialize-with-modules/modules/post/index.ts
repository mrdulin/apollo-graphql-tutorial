import { GraphQLSchemaModule } from 'apollo-server';
import { resolvers } from './resolvers';
import { typeDefs } from './typeDefs';

const postModule: GraphQLSchemaModule = {
  typeDefs,
  resolvers,
};
export { postModule as Post };
