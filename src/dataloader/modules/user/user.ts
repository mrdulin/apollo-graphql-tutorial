import { db, IUser } from '../../db';
import _ from 'lodash';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const User = {
  findByIds: async (ids: number[]): Promise<Array<IUser | undefined>> => {
    const dataSet = ids
      .map((id) => {
        const userFound = db.users.find((user) => user.id.toString() === id.toString());
        if (userFound) {
          return { ...userFound };
        }
      })
      // make recordSet order random for simulating real database
      .sort((a, b) => {
        if (a && b) {
          return b.id - a.id;
        }
        return 0;
      });

    const uniqDataSet = _.uniqBy(dataSet, 'id');

    return Promise.all(uniqDataSet);
  },

  findById: (id: number) => {
    console.count('User.findById');
    return db.users.find((user) => user.id.toString() === id.toString());
  },
};

export { User };
