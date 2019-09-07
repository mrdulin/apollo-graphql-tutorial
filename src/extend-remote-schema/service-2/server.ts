import { ApolloServer, ServerInfo, introspectSchema, makeRemoteExecutableSchema, mergeSchemas } from 'apollo-server';
import { typeDefs } from './typeDefs';
import { ApolloServerBase } from 'apollo-server-core';
import { HttpLink } from 'apollo-link-http';
import fetch from 'node-fetch';
import { printSchema } from 'graphql';

// TODO: https://github.com/apollographql/apollo-link/issues/513
const link = new HttpLink({ uri: 'http://localhost:3000', fetch: fetch as any });

async function createApolloServer(): Promise<ApolloServerBase> {
  const PORT = process.env.PORT || 3001;

  const graphqlSchema = await introspectSchema(link);
  const remoteExecutableSchema = makeRemoteExecutableSchema({ schema: graphqlSchema, link });
  const schema = mergeSchemas({ schemas: [remoteExecutableSchema, typeDefs] });
  console.log(printSchema(schema));

  const server = new ApolloServer({ schema });
  await server
    .listen(PORT)
    .then(({ url }: ServerInfo) => {
      console.log(`🚀 Server ready at ${url}`);
    })
    .catch((error) => {
      console.error('Create server failed.');
      console.error(error);
    });
  return server;
}

export { createApolloServer };
