import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import responseCachePlugin from 'apollo-server-plugin-response-cache';
import faker from 'faker';

const typeDefs = gql`
  type User {
    name: String
    email: String
  }
  type Query {
    user: User
  }
`;

const resolvers = {
  Query: {
    user: async (_, __, context, { cacheControl }) => {
      console.count('resolve user');
      cacheControl.setCacheHint({ maxAge: 40 });
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
  // set cache-control HTTP response header as expected
  // cacheControl: {
  //   defaultMaxAge: 5,
  // },
  // bug? DOES NOT set cache-control HTTP response header
  cacheControl: true,
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
