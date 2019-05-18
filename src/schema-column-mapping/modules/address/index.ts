import path from 'path';
import { importSchema } from 'graphql-import';
import { makeExecutableSchema } from 'apollo-server';
import { resolvers } from './resolvers';
import { GraphQLSchema } from 'graphql';
import { typeDefs } from './typeDefs';

// const schema: GraphQLSchema = makeExecutableSchema({ typeDefs, resolvers });

// export { schema };

export * from './typeDefs';
export * from './resolvers';
export * from './AddressDataSourceImpl';
export * from './AddressDataSource';
