import { makeExecutableSchema, gql } from 'apollo-server';
import { mergeDeep } from 'apollo-utilities';
import { applyMiddleware } from 'graphql-middleware';
import { GraphQLSchemaWithFragmentReplacements } from 'graphql-middleware/dist/types';

import { selectFieldsMiddleware } from './middleware';
import { CamelizeKeysDirective, typeDefs as CamelizeKeysDirectiveTypeDefs } from './directives/camelizeKeys';

import {
  typeDefs as AddressTypeDefs,
  resolvers as AddressResolvers,
  addressMiddlewareTypeMap,
} from './modules/address';
import { typeDefs as UserTypeDefs, resolvers as UserResolvers, userMiddlewareTypeMap } from './modules/user';
import { typeDefs as PostTypeDefs, resolvers as postResolvers } from './modules/post';
import { logger } from '../util';

const rootTypeDefs = gql`
  type Query {
    root: String
  }
  type Mutation {
    root: String
  }
`;
const schema = makeExecutableSchema({
  typeDefs: [rootTypeDefs, UserTypeDefs, AddressTypeDefs, PostTypeDefs, CamelizeKeysDirectiveTypeDefs],
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

const inputDebug = async (resolve, root, args, context, info) => {
  logger.debug(`INPUT ARGUMENTS: ${JSON.stringify(args)}`);
  const result = await resolve(root, args, context, info);
  logger.debug(`RESULT: ${JSON.stringify(result)}`);
  return result;
};
const loggingMiddleware = {
  Query: inputDebug,
  Mutation: inputDebug,
};
const middlewares = mergeDeep(userMiddlewareTypeMap, addressMiddlewareTypeMap, loggingMiddleware);

const schemaWithMiddleware: GraphQLSchemaWithFragmentReplacements = applyMiddleware(
  schema,
  selectFieldsMiddleware,
  middlewares,
);

export { schema, schemaWithMiddleware };
export { IAddressDataSource, AddressDataSourceImpl } from './modules/address';
export { IUserDataSource, UserDataSourceImpl } from './modules/user';
