const Resolvers = {
  Query: {
    books: (_, args) => [{ name: 'jestjs' }, { name: 'js' }],
  },
};

export default Resolvers;
