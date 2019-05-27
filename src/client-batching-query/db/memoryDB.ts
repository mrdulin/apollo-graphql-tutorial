import faker from 'faker';
const users = [
  {
    userId: 1,
    userNme: faker.name.findName(),
    userEmail: faker.internet.email(),
  },
  {
    userId: 2,
    userNme: faker.name.findName(),
    userEmail: faker.internet.email(),
  },
  {
    userId: 3,
    userNme: faker.name.findName(),
    userEmail: faker.internet.email(),
  },
];

const posts = [
  {
    postId: faker.random.uuid(),
    postTitle: faker.lorem.sentence(),
    postContent: faker.lorem.paragraphs(),
    postAuthorId: 1,
  },
  {
    postId: faker.random.uuid(),
    postTitle: faker.lorem.sentence(),
    postContent: faker.lorem.paragraphs(),
    postAuthorId: 2,
  },
  {
    postId: faker.random.uuid(),
    postTitle: faker.lorem.sentence(),
    postContent: faker.lorem.paragraphs(),
    postAuthorId: 1,
  },
];

const memoryDB = {
  users,
  posts,
};

export { memoryDB };
