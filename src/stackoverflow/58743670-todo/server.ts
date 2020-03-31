import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import responseCachePlugin from 'apollo-server-plugin-response-cache';
import faker from 'faker';

const typeDefs = gql`
  type User @cacheControl(maxAge: 30) {
    name: String
    email: String
  }
  type Query {
    user: User
  }
`;

const resolvers = {
  Query: {
    user: async (_, __, context, info) => {
      console.count('resolve user');
      const user = { name: faker.name.findName(), email: faker.internet.exampleEmail() };
      return user;
    },
  },
};

const app = express();
const port = 3001;
const graphqlPath = '/graphql';
const server = new ApolloServer({
  typeDefs,
  resolvers,
  tracing: true,
  // use LRU-memory cache by default
  plugins: [responseCachePlugin()],
  cacheControl: {
    defaultMaxAge: 0,
  },
});

server.applyMiddleware({ app, path: graphqlPath });

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: __dirname });
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Apollo server is listening on http://localhost:${port}${graphqlPath}`);
  });
}
