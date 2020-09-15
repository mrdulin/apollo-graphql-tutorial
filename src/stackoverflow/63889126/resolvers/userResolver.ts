const Resolvers = {
  Query: {
    whoami: (_, args, { models }) => ({ name: 'teresa teng' }),
  },
};

export default Resolvers;
