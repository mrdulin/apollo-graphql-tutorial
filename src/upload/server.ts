import { ApolloServer } from 'apollo-server';
import { typeDefs } from './typeDefs';
import { resolvers } from './resolvers';
import { ApolloServerBase, FileUploadOptions } from 'apollo-server-core';

async function createApolloServer(): Promise<ApolloServerBase> {
  const fileUploadOptions: FileUploadOptions = {
    // 50KB
    maxFileSize: 1024 * 50,
  };
  const server = new ApolloServer({
    uploads: fileUploadOptions,
    typeDefs,
    resolvers,
  });

  const { url } = await server.listen();
  console.log(`🚀 Server ready at ${url}`);
  return server;
}

export { createApolloServer };
