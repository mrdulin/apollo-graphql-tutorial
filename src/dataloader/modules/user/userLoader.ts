import Dataloader from 'dataloader';
import { User } from './user';
import { IUser } from '../../db';

const UserLoader = {
  findByIds: () => {
    const loadCalls: any[] = [];
    const cacheMap = new Map();
    const loader = new Dataloader<number, IUser | undefined>(
      (keys) => {
        loadCalls.push(keys);
        return User.findByIds(keys);
      },
      { cacheMap },
    );

    function getCache() {
      const cache = {};
      for (const [key, val] of cacheMap.entries()) {
        cache[key] = val;
      }
      return cache;
    }

    return { loader, loadCalls, getCache };
  },
};

const UserLoaderWithoutCaching = {
  findByIds: new Dataloader<number, IUser | undefined>(
    (keys) => {
      console.log(`UserLoaderWithoutCaching.findByIds keys = ${JSON.stringify(keys)}`);
      return User.findByIds(keys);
    },
    {
      cache: false,
    },
  ),
};

export { UserLoader, UserLoaderWithoutCaching };
