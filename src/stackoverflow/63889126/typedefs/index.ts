import userTypeDefs from './userSchema';
import bookTypeDefs from './bookSchema';
import { gql, makeExecutableSchema } from 'apollo-server-express';
import resolvers from '../resolvers';

const defaultTypeDefs = gql`
  type Query {
    _: Boolean
  }
  type Mutation {
    _: Boolean
  }
`;

const [UserResolvers, BookResolvers] = resolvers;
const userSchema = makeExecutableSchema({ typeDefs: userTypeDefs, resolvers: UserResolvers });
const bookSchema = makeExecutableSchema({ typeDefs: bookTypeDefs, resolvers: BookResolvers });
const defaultSchema = makeExecutableSchema({ typeDefs: defaultTypeDefs });

export default [userSchema, bookSchema, defaultSchema];
