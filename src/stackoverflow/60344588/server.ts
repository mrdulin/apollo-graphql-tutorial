import { ApolloServer, gql } from 'apollo-server-express';
import express from 'express';
import { sleep } from '../../util';

const typeDefs = gql`
  type Query {
    hello: String
  }
`;
const resolvers = {
  Query: {
    hello: async () => {
      console.log('query hello');
      await sleep(1000);
      return 'world';
    },
  },
};

const app = express();
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true,
  introspection: true,
});

apolloServer.applyMiddleware({ app });

const server = app.listen({ port: 4000 }, () => {
  console.log(`The server is running in http://localhost:4000${apolloServer.graphqlPath}`);
});

server.setTimeout(10);
