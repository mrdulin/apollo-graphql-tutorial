import faker from 'faker';
const resolvers = {
  Query: {
    posts: () => {
      return [{ id: 1, title: faker.lorem.sentence() }];
    },
  },
};
export { resolvers };
