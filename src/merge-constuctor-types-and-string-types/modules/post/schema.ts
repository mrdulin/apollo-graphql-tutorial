import { GraphQLObjectType, GraphQLID, GraphQLNonNull, GraphQLString, GraphQLSchema } from 'graphql';
import { IAppContext } from '../../context';

const postType = new GraphQLObjectType({
  name: 'Post',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    authorId: { type: new GraphQLNonNull(GraphQLID) },
  },
});

const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    post: {
      type: postType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: (_, { id }, { db }: IAppContext) => {
        return db.posts.find((post) => post.id.toString() === id);
      },
    },
  },
});

export const postSchema = new GraphQLSchema({ query: queryType });
