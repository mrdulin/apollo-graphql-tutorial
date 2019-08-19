import { db, IUser } from '../../db';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const User = {
  findByIds: async (ids: number[]): Promise<Array<IUser | undefined>> => {
    return Promise.all(
      ids.map((id) => {
        const userFound = db.users.find((user) => user.id.toString() === id.toString());
        if (userFound) {
          return { ...userFound };
        }
      }),
    );
  },

  findById: (id: number) => {
    console.count('User.findById');
    return db.users.find((user) => user.id.toString() === id.toString());
  },
};

export { User };
