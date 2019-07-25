import { makeExecutableSchema, gql } from 'apollo-server';
import { mergeDeep } from 'apollo-utilities';
import { applyMiddleware } from 'graphql-middleware';
import { GraphQLSchemaWithFragmentReplacements } from 'graphql-middleware/dist/types';

import { selectFieldsMiddleware, logMiddleware, traceMiddleware } from './middleware';
import { CamelizeKeysDirective, typeDefs as CamelizeKeysDirectiveTypeDefs } from './directives/camelizeKeys';

import { typeDefs as CommonTypeDefs } from './modules/common';
import {
  typeDefs as AddressTypeDefs,
  resolvers as AddressResolvers,
  addressMiddlewareTypeMap,
} from './modules/address';
import { typeDefs as UserTypeDefs, resolvers as UserResolvers, userMiddlewareTypeMap } from './modules/user';
import { typeDefs as PostTypeDefs, resolvers as postResolvers } from './modules/post';

const rootTypeDefs = gql`
  type Query {
    root: String
  }
  type Mutation {
    root: String
  }
`;
const schema = makeExecutableSchema({
  typeDefs: [rootTypeDefs, CommonTypeDefs, UserTypeDefs, AddressTypeDefs, PostTypeDefs, CamelizeKeysDirectiveTypeDefs],
  resolvers: [AddressResolvers, UserResolvers, postResolvers],
  logger: {
    log: (message: string | Error) => {
      console.log(`[logger]: ${message}`);
    },
  },
  schemaDirectives: {
    camelizeKeys: CamelizeKeysDirective,
  },
});

const middlewares = mergeDeep(userMiddlewareTypeMap, addressMiddlewareTypeMap);

const schemaWithMiddleware: GraphQLSchemaWithFragmentReplacements = applyMiddleware(
  schema,
  traceMiddleware,
  selectFieldsMiddleware,
);

export { schema, schemaWithMiddleware };
export { IAddressDataSource, AddressDataSourceImpl } from './modules/address';
export { IUserDataSource, UserDataSourceImpl } from './modules/user';
