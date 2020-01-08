const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors');
const dotEnv = require('dotenv');
const { merge } = require('lodash');

const resolvers = require('./resolvers');
const typeDefs = require('./typeDefs');

dotEnv.config();

const app = express();
app.use(cors());
app.use(express.json());

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers: merge(resolvers.taskResolver, resolvers.userResolver),
});

apolloServer.applyMiddleware({ app, path: '/graphql' });

const PORT = process.env.PORT || 3000;

app.use('/', (req, res) => res.send('Hello world...'));

app.listen(PORT, () => console.log(`Server listen on port: ${PORT}`));
