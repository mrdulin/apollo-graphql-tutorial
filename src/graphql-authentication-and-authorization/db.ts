import faker from 'faker';

enum Role {
  admin = 'admin',
  viewer = 'viewer',
  editor = 'editor',
}

const db = {
  users: [
    {
      id: 1,
      name: faker.name.findName(),
      email: faker.internet.email(),
      role: Role.admin,
      bitcoinAddress: faker.finance.bitcoinAddress(),
    },
    {
      id: 2,
      name: faker.name.findName(),
      email: faker.internet.email(),
      role: Role.viewer,
      bitcoinAddress: faker.finance.bitcoinAddress(),
    },
  ],

  posts: [
    { id: 1, title: faker.lorem.sentence(), content: faker.lorem.paragraph(), authorId: 1 },
    { id: 2, title: faker.lorem.sentence(), content: faker.lorem.paragraph(), authorId: 1 },
    { id: 3, title: faker.lorem.sentence(), content: faker.lorem.paragraph(), authorId: 2 },
  ],
};

export { db, Role };
