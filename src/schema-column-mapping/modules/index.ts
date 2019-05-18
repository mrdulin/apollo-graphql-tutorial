import { makeExecutableSchema, gql } from 'apollo-server';
import { mergeDeep } from 'apollo-utilities';

import { typeDefs as AddressTypeDefs, resolvers as AddressResolvers } from './address';
import { typeDefs as UserTypeDefs, resolvers as UserResolvers } from './user';

const rootTypeDefs = gql`
  type Query {
    root: String
  }
  type Mutation {
    root: String
  }
`;
const resolvers = mergeDeep([AddressResolvers, UserResolvers]);
const schema = makeExecutableSchema({
  typeDefs: [rootTypeDefs, UserTypeDefs, AddressTypeDefs],
  resolvers,
});

export { schema };
export { IAddressDataSource, AddressDataSourceImpl } from './address';
export { IUserDataSource, UserDataSourceImpl } from './user';
