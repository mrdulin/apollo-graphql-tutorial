import { ApolloServer, gql } from 'apollo-server';
import StackDriverExtension from './stackdiverExtension';

const typeDefs = gql`
  type Query {
    hello: String
  }
`;
const resolvers = {
  Query: {
    hello() {
      return 'Hello, World!';
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers, extensions: [() => new StackDriverExtension()] });
const port = 3000;
server.listen(port).then(({ url }) => console.log(`Server is ready at ${url}`));
