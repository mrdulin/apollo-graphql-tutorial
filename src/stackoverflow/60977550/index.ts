import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import faker from 'faker';
import responseCachePlugin from 'apollo-server-plugin-response-cache';
import MyCache from './MyCache';

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
  cache: new MyCache(),
});

server.applyMiddleware({ app, path: graphqlPath });

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Apollo server is listening on http://localhost:${port}${graphqlPath}`);
  });
}
