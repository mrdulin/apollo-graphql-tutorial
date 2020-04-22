import { ApolloServer, gql } from 'apollo-server-express';
import express from 'express';

const typeDefs = gql`
  type Query {
    dummy: String!
  }
`;
const resolvers = {
  Query: {
    dummy: () => 'hello world',
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => {
    return {
      response: {
        headers: {
          'set-cookie': ['key1=value1', 'key2=value2'],
        },
      },
      res,
    };
  },
  formatResponse: (response, requestContext: any) => {
    // not working
    // requestContext.response!.http!.headers.set('set-cookie', 'key1=value1');
    // requestContext.response!.http!.headers.set('set-cookie', 'key2=value2');
    // works fine
    requestContext.context.res.set('set-cookie', ['key1=value1', 'key2=value2']);
    return response!;
  },
});
const app = express();
server.applyMiddleware({ app });

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: __dirname });
});

app.listen({ port: 4000 }, () => console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`));
