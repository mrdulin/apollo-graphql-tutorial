import { IResolvers } from 'apollo-server';
import { UserController, PostController, ConfigController } from './oop';

const resolversWithClass: IResolvers = {
  Query: {
    user: UserController.user,
    posts: PostController.posts,
    adminUsers: UserController.adminUsers,
    config: ConfigController.config,
  },
  Mutation: {
    createPost: PostController.createPost,
    createUser: UserController.createUser,
  },
  Post: {
    author: PostController.author,
  },
  User: {
    bitcoinAddress: UserController.bitcoinAddress,
  },
};

export { resolversWithClass };
