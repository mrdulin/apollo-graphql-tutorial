import { IResolvers } from 'apollo-server';

const resolvers: IResolvers = {
  Query: {
    users: (_, __, { db }) => {
      return db.users;
    },

    post: (_, { id }, { db }) => {
      return db.posts.find((post) => post.id.toString() === id);
    },

    posts: (_, __, { db }) => {
      return db.posts;
    },
  },

  Post: {
    author: (post, _, { db, UserLoader, User }) => {
      // return User.findById(post.userId);
      return UserLoader.findByIds.load(post.userId);
    },
    authorName1: (post, _, { UserLoader }) => {
      return UserLoader.findByIds
        .load(post.userId)
        .then(() => UserLoader.findByIds.load(post.userId))
        .then((user) => user.name);
    },
    authorName2: (post, _, { UserLoader }) => {
      return UserLoader.findByIds
        .load(post.userId)
        .then(() => UserLoader.findByIds.load(post.userId))
        .then((user) => user.name);
    },
    authorName3: (post, _, { UserLoader }) => {
      return UserLoader.findByIds
        .load(post.userId)
        .then(() => UserLoader.findByIds.load(post.userId))
        .then((user) => user.name);
    },
  },

  // For testing dataloader without caching
  // Post: {
  //   author: (post, _, { UserLoaderWithoutCaching }) => {
  //     // return User.findById(post.userId);
  //     return UserLoaderWithoutCaching.findByIds.load(post.userId);
  //   },
  //   authorName1: (post, _, { UserLoaderWithoutCaching }) => {
  //     return UserLoaderWithoutCaching.findByIds
  //       .load(post.userId)
  //       .then(() => UserLoaderWithoutCaching.findByIds.load(post.userId))
  //       .then((user) => user.name);
  //   },
  //   authorName2: (post, _, { UserLoaderWithoutCaching }) => {
  //     return UserLoaderWithoutCaching.findByIds
  //       .load(post.userId)
  //       .then(() => UserLoaderWithoutCaching.findByIds.load(post.userId))
  //       .then((user) => user.name);
  //   },
  //   authorName3: (post, _, { UserLoaderWithoutCaching }) => {
  //     return UserLoaderWithoutCaching.findByIds
  //       .load(post.userId)
  //       .then(() => UserLoaderWithoutCaching.findByIds.load(post.userId))
  //       .then((user) => user.name);
  //   },
  // },
};

export { resolvers };
