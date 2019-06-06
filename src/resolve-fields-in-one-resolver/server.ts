import { ApolloServer } from 'apollo-server';
import { typeDefs } from './typeDefs';
import { memoryDB } from './db/memoryDB';
import { resolvers } from './resolvers';
import { resolversBetter } from './resolvers-better';

const server = new ApolloServer({ typeDefs, resolvers: resolversBetter, context: { memoryDB } });

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
