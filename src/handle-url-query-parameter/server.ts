import { ApolloServer, gql, ApolloError } from 'apollo-server';

const typeDefs = gql`
  type Query {
    hello: String
  }
`;
const resolvers = {
  Query: {
    hello: () => 'world',
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    console.log(req.query);
    if (!req.query.apikey) {
      throw new ApolloError('apikey invalid');
    }
    return {
      req,
    };
  },
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
