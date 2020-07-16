const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { importSchema } = require('graphql-import');
const path = require('path');

const apolloServer = new ApolloServer({
  typeDefs: importSchema(path.resolve(__dirname, './greet.graphql')),
  resolvers: require('./resolver'),
});

const app = express();
const graphqlEndpoint = '/graphql';
apolloServer.applyMiddleware({ app, path: graphqlEndpoint });

app.listen(8080, () => {
  console.log('Server Hosted');
});
