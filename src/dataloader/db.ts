import faker from 'faker';

interface IUser {
  id: number;
  name: string;
  email: string;
}

interface IPost {
  id: number;
  title: string;
  content: string;
  userId: number;
}

const users: IUser[] = [
  { id: 1, name: 'a', email: 'a@gmail.com' },
  { id: 2, name: 'b', email: 'b@gmail.com' },
  { id: 3, name: 'c', email: 'c@gmail.com' },
];

const posts: IPost[] = [
  { id: 1, title: faker.lorem.sentence(), content: faker.lorem.paragraph(), userId: 1 },
  { id: 2, title: faker.lorem.sentence(), content: faker.lorem.paragraph(), userId: 1 },
  { id: 3, title: faker.lorem.sentence(), content: faker.lorem.paragraph(), userId: 1 },
];

const db = { users, posts };
export { db, IUser, IPost };
