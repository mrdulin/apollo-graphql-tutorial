import Dataloader from 'dataloader';
import { User } from './user';

const UserLoader = {
  findByIds: new Dataloader<string, any>((keys) => {
    console.log(`UserLoader.findByIds keys = ${JSON.stringify(keys)}`);
    return User.findByIds(keys).then((datas) => {
      console.log(`UserLoader.findByIds datas = ${JSON.stringify(datas)}`);
      return datas;
    });
  }),
};

const UserLoaderWithoutCaching = {
  findByIds: new Dataloader<string, any>(
    (keys) => {
      console.log(`UserLoaderWithoutCaching.findByIds keys = ${JSON.stringify(keys)}`);
      return User.findByIds(keys).then((datas) => {
        console.log(`UserLoaderWithoutCaching.findByIds datas = ${JSON.stringify(datas)}`);
        return datas;
      });
    },
    {
      cache: false,
    },
  ),
};

export { UserLoader, UserLoaderWithoutCaching };
