import { IResolvers } from 'apollo-server';
import { IAppContext } from '../../server';

const resolvers: IResolvers = {
  Query: {
    postById: (_, { id }, { dataSources }: IAppContext) => {
      return dataSources.post.findById(id);
    },
    posts: (_, __, { dataSources }: IAppContext) => {
      return dataSources.post.find();
    },
  },
  Post: {
    postAuthor: (source, _, { dataSources }: IAppContext) => {
      return dataSources.user.findById(source.postAuthorId);
    },
  },
  Mutation: {
    addPost: (_, { post }, { dataSources }: IAppContext) => {
      return dataSources.post.insert(post);
    },
  },
};

export { resolvers };
