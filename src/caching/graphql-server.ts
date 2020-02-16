import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import { RedisCache } from 'apollo-server-cache-redis';
import faker from 'faker';
import responseCachePlugin from 'apollo-server-plugin-response-cache';

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
    user: async () => {
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
  plugins: [responseCachePlugin()],
  cache: new RedisCache({
    port: 6379,
    host: '127.0.0.1',
    family: 4,
    db: 0,
  }),
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
