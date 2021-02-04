import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
const app = express();

const typeDefs = gql`
  type Query {
    hi: String
  }
`;

const resolvers = {
  Query: {
    hi: () => 'hi',
  },
};

const server = new ApolloServer({ typeDefs, resolvers });
server.applyMiddleware({ app, path: '/graphql' });
app.listen(8080, () => console.log('Apollo server started at http://localhost:8080'));

// For testing
// curl -i -H 'Content-Type: application/json' -X POST -d '{"query": "query {hi}"}' http://localhost:8080/graphql
