import { ApolloServer, gql, makeExecutableSchema } from 'apollo-server-express';
import express from 'express';
import http from 'http';

const corsConfig = {
  credentials: true,
  allowedHeaders: ['Authorization'],
  exposedHeaders: ['Authorization'],
};

const typeDefs = gql`
  type Query {
    hello: String
  }
`;
const resolvers = {
  Query: {
    hello: (_, __, { req }) => {
      console.log(req.headers);
      return 'world';
    },
  },
};
const schema = makeExecutableSchema({ typeDefs, resolvers });

const app = express();
const path = '/graphql';
const port = 3000;
const server = new ApolloServer({
  schema,
  context: ({ req }) => {
    return {
      req,
    };
  },
});
server.applyMiddleware({ app, path, cors: corsConfig });

http.createServer(app).listen(port, () => console.info(`Service started on port ${port}`));

// test
// curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer abc123" --data '{ "query": "{ hello }" }' http://localhost:3000/graphql
