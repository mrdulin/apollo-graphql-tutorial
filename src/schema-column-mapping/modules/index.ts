import { makeExecutableSchema, gql } from 'apollo-server';
import { mergeDeep } from 'apollo-utilities';

import { typeDefs as AddressTypeDefs, resolvers as AddressResolvers, addressMiddlewareTypeMap } from './address';
import { typeDefs as UserTypeDefs, resolvers as UserResolvers, userMiddlewareTypeMap } from './user';
import { GraphQLSchemaWithFragmentReplacements } from 'graphql-middleware/dist/types';
import { applyMiddleware } from 'graphql-middleware';

const rootTypeDefs = gql`
  type Query {
    root: String
  }
  type Mutation {
    root: String
  }
`;
const resolvers = mergeDeep([AddressResolvers, UserResolvers]);
const middlewares = mergeDeep(userMiddlewareTypeMap, addressMiddlewareTypeMap);
const schema = makeExecutableSchema({
  typeDefs: [rootTypeDefs, UserTypeDefs, AddressTypeDefs],
  resolvers,
});

const schemaWithMiddleware: GraphQLSchemaWithFragmentReplacements = applyMiddleware(schema, middlewares);

export { schema, schemaWithMiddleware };
export { IAddressDataSource, AddressDataSourceImpl } from './address';
export { IUserDataSource, UserDataSourceImpl } from './user';
