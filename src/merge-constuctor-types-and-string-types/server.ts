import { ApolloServer, ServerInfo } from 'apollo-server';
import { schema } from './schema';
import { db } from './db';

const PORT = process.env.PORT || 3000;
const server = new ApolloServer({ schema, context: { db } });

server
  .listen(PORT)
  .then(({ url }: ServerInfo) => {
    console.log(`🚀 Server ready at ${url}`);
  })
  .catch((error) => {
    console.error('Create server failed.');
    console.error(error);
  });
