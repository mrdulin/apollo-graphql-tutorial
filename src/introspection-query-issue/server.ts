import { ApolloServer, gql, IResolvers } from 'apollo-server-express';
import express from 'express';
import morgan = require('morgan');
import { ContextFunction } from 'apollo-server-express/node_modules/apollo-server-core';

const app = express();
const port = 3000;
const GRAPHQL_PATH = '/graphql';

const typeDefs = gql`
  type Query {
    _: Boolean
  }
`;

const resolvers: IResolvers = {
  Query: {},
};

app.use(morgan('combined'));

const contextFunction: ContextFunction = ({ req }) => {
  console.log(req);
  return { req };
};

const apolloServer = new ApolloServer({ typeDefs, resolvers, context: contextFunction });
apolloServer.applyMiddleware({
  app,
  path: GRAPHQL_PATH,
});

app.listen(port, () => {
  console.log(`GraphQL Web Server is listening on http://localhost:${port}${GRAPHQL_PATH}`);
});
