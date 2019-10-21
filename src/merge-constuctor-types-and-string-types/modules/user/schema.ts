import { resolvers } from './resolvers';
import { typeDefs } from './typeDefs';
import { makeExecutableSchema } from 'apollo-server';

export const userSchema = makeExecutableSchema({ typeDefs, resolvers });
