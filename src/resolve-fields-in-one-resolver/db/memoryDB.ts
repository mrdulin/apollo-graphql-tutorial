import faker from 'faker';

const userPK1 = '1';
const userPK2 = '2';

const memoryDB = {
  users: [
    { userId: userPK1, userNme: faker.name.findName(), userEmail: faker.internet.email() },
    { userId: userPK2, userNme: faker.name.findName(), userEmail: faker.internet.email() },
  ],
  posts: [
    {
      postId: '1',
      postTitle: faker.lorem.sentence(),
      postCreatedAt: new Date().toUTCString(),
      postAuthorId: userPK1,
    },
    {
      postId: '2',
      postTitle: faker.lorem.sentence(),
      postCreatedAt: new Date().toUTCString(),
      postAuthorId: userPK1,
    },
  ],
};

export { memoryDB };
