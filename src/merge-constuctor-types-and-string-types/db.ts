import faker from 'faker';

export const db = {
  users: [
    {
      id: 1,
      name: faker.name.findName(),
      email: faker.internet.email(),
    },
    {
      id: 2,
      name: faker.name.findName(),
      email: faker.internet.email(),
    },
  ],
  posts: [
    { id: 1, title: faker.lorem.word(), authorId: 1 },
    { id: 2, title: faker.lorem.word(), authorId: 1 },
    { id: 3, title: faker.lorem.word(), authorId: 2 },
  ],
};
