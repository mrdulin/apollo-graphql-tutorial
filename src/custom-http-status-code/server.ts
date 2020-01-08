import { graphqlExpress } from './expressApollo';
import express from 'express';
import { makeExecutableSchema } from 'graphql-tools';
import { gql } from 'apollo-server';

const app = express();
const port = 3000;
const graphqlEndpoint = '/graphql';

const typeDefs = gql`
  type Query {
    _: String
  }
`;
const resolvers = {
  Query: {
    _: () => {
      throw new Error('some error');
    },
  },
};
const schema = makeExecutableSchema({ typeDefs, resolvers });

app.use(express.json());
app.use(graphqlEndpoint, graphqlExpress({ schema }));

app.use((error, req, res, next) => {
  if (error === 'some error') {
    return res.status(400).send({ message: error.message ? error.message : error });
  }
  res.status(500);
  res.render('error', { error });
});

app.listen(port, () => {
  console.log(`Http server is listening on http://localhost:${port}${graphqlEndpoint}`);
});
