import Dataloader from 'dataloader';
import { User } from './user';
import { IUser } from '../../db';
import _ from 'lodash';

const UserLoader = {
  findByIds: (options?: Dataloader.Options<number, IUser | undefined>) => {
    const loadCalls: any[] = [];
    const cacheMap = new Map();
    const loader = new Dataloader<number, IUser | undefined>((keys: number[]) => {
      loadCalls.push(keys);
      return User.findByIds(keys)
        .then((dataSet: Array<IUser | undefined>) => {
          console.log(`dataSet before sort and map result to key : ${JSON.stringify(dataSet)}`);
          return dataSet;
        })
        .then(
          (dataSet: Array<IUser | undefined>): Array<IUser | undefined> =>
            keys.map((key: number) => _.keyBy(dataSet, 'id')[key]),
        )
        .then((dataSet) => {
          console.log(`dataSet after sort and map result to key : ${JSON.stringify(dataSet)}`);
          return dataSet;
        });
    }, options);

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

export { UserLoader };
