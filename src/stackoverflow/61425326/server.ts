import { ApolloServer, gql } from 'apollo-server';
import { MoviesAPI } from './MoviesAPI';
import { SongsAPI } from './SongsAPI';

const typeDefs = gql`
  type Query {
    movies: String
  }
`;
const resolvers = {
  Query: {
    movies: (_, __, { dataSources }) => {
      return dataSources.moviesAPI.getMovies();
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => {
    return {
      moviesAPI: new MoviesAPI(),
      songsAPI: new SongsAPI(),
    };
  },
});

server.listen().then(({ url }) => {
  console.log(`Apollo server is listening on ${url}`);
});
