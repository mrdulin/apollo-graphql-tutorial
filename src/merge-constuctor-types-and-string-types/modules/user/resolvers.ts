import { IResolvers } from 'graphql-tools';
import { IAppContext } from '../../context';

export const resolvers: IResolvers = {
  User: {
    posts: (user, _, { db }: IAppContext) => {
      return db.posts.find((post) => post.authorId === user.id);
    },
  },
  Query: {
    user: (_, { id }, { db }: IAppContext) => {
      return db.users.find((user) => user.id.toString() === id);
    },
  },
};
