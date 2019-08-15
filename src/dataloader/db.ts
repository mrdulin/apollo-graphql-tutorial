import faker from 'faker';

const db = {
  users: [
    { id: 1, name: faker.name.findName(), email: faker.internet.email() },
    { id: 2, name: faker.name.findName(), email: faker.internet.email() },
    { id: 3, name: faker.name.findName(), email: faker.internet.email() },
  ],
  posts: [
    { id: 1, title: faker.lorem.sentence(), content: faker.lorem.paragraph(), userId: 1 },
    { id: 2, title: faker.lorem.sentence(), content: faker.lorem.paragraph(), userId: 1 },
    { id: 3, title: faker.lorem.sentence(), content: faker.lorem.paragraph(), userId: 1 },
  ],
};
export { db };
