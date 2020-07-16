const resolvers = {
  Query: {
    tags: () => {
      return [{ id: 1, text: 'programming' }];
    },
  },
};

export { resolvers };
