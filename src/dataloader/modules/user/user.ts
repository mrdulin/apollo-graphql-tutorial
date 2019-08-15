import { db } from '../../db';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const User = {
  findByIds: async (ids: string[]) => {
    console.count('User.findByIds');
    await sleep(100);
    return await Promise.all(
      ids.map((id) => {
        return db.users.find((user) => user.id.toString() === id.toString());
      }),
    );
  },

  findById: (id: string) => {
    console.count('User.findById');
    return db.users.find((user) => user.id.toString() === id.toString());
  },
};

export { User };
