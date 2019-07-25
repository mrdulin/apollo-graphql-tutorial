import { ApolloServer, ServerInfo } from 'apollo-server';
import { typeDefs } from './typeDefs';
import { resolvers } from './resolver';

const PORT = process.env.PORT || 3000;
const server = new ApolloServer({ typeDefs, resolvers });

server
  .listen(PORT)
  .then(({ url }: ServerInfo) => {
    console.log(`🚀 Server ready at ${url}`);
  })
  .catch((error) => {
    console.error('Create server failed.');
    console.error(error);
  });
