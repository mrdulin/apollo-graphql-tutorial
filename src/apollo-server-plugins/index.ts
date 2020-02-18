import { ApolloServer, gql } from 'apollo-server-express';
import express from 'express';
import path from 'path';
import httpHeadersPlugin from './apollo-server-plugins-http-header';

const typeDefs = gql`
  type Query {
    hello: String
  }
`;
const resolvers = {
  Query: {
    hello: async (parent, args, context, info) => {
      context.setCookies.push({
        name: 'cookieName',
        value: 'cookieContent',
        options: {
          expires: new Date('2021-01-01T00:00:00'),
          httpOnly: true,
          maxAge: 3600,
          path: '/',
          sameSite: true,
          secure: true,
        },
      });
      return 'Hello world!';
    },
  },
};

const app = express();
const port = 4000;
const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [httpHeadersPlugin],
  context: {
    setHeaders: new Array(),
    setCookies: new Array(),
  },
});
server.applyMiddleware({ app, path: '/graphql', bodyParserConfig: true });
app.get('/', (req, res) => {
  const file = path.resolve(__dirname, './index.html');
  res.sendFile(file);
});
app.listen(port, () => {
  console.log(`🚀  Server ready at http://localhost:${port}/graphql`);
});
