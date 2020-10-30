import apolloServerPluginResponseCache from 'apollo-server-plugin-response-cache';
import { ApolloServer, gql } from 'apollo-server';
import { RedisCache } from 'apollo-server-cache-redis';

const typeDefs = gql`
  type Query {
    exapi(param1: String, param2: Boolean): String
  }
`;
const resolvers = {
  Query: {
    exapi: (_, { param1, param2 }) => 'teresa teng',
  },
};

const cache = new RedisCache({ host: 'localhost', port: 6379 });

const server = new ApolloServer({
  introspection: true,
  playground: true,
  subscriptions: false,
  typeDefs,
  resolvers,
  cacheControl: {
    defaultMaxAge: 60,
  },
  plugins: [
    apolloServerPluginResponseCache({
      cache,
      shouldWriteToCache: (requestContext) => {
        console.log(requestContext.document.definitions[0].selectionSet.selections[0].arguments);
        return true;
      },
    }),
  ],
});
server.listen().then(({ url }) => console.log(`🚀 Server ready at ${url}`));
