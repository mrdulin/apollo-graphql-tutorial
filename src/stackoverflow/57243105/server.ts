import { ApolloServer, gql } from 'apollo-server-express';
import express from 'express';
import responseCachePlugin from 'apollo-server-plugin-response-cache';

const typeDefs = gql`
  type Query {
    personDetails: String
  }
`;
const resolvers = {
  Query: {
    personDetails: async (root, args, ctx, info) => {
      console.log(`[${new Date().toLocaleTimeString()}] Query.personDetails`);
      info.cacheControl.setCacheHint({ maxAge: 10 });
      return 'This is person details';
    },
  },
};

const app = express();
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [responseCachePlugin()],
});

apolloServer.applyMiddleware({ app });

const server = app.listen({ port: 4000 }, () => {
  console.log(`The server is running in http://localhost:4000${apolloServer.graphqlPath}`);
});
