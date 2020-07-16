import { ApolloServer } from 'apollo-server';
import { Post, Tag } from './modules';

const server = new ApolloServer({
  modules: [Post, Tag],
  playground: true,
  introspection: true,
});

server.listen().then(({ url }) => {
  console.log(`apollo server is listening on ${url}`);
});
