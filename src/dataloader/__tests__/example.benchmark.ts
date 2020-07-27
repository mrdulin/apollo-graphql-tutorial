import faker from 'faker';
import Benchmark, { Suite } from 'benchmark';
import DataLoader from 'dataloader';

interface IUser {
  id: number;
  email: string;
}
interface IDB {
  users: IUser[];
}
const DB: IDB = {
  users: [],
};

for (let i = 0; i < 10000; i++) {
  DB.users.push({ id: i + 1, email: faker.internet.email() });
}

async function findUserById(id: number) {
  return DB.users.find((u) => u.id === id);
}

async function findByUserIds(ids: number[]) {
  return DB.users.filter((v) => ids.includes(v.id));
}
const userLoader = new DataLoader(findByUserIds);

const suite: Suite = new Benchmark.Suite('dataloader');

suite
  .add('find user by id without dataloader', {
    defer: true,
    fn: async (deferred) => {
      const user = await findUserById(100);
      console.log(user);
      deferred.resolve();
    },
  })
  .add('find user by id with dataloader', {
    defer: true,
    fn: async (deferred) => {
      const user = await userLoader.load(101);
      console.log(user);
      deferred.resolve();
    },
  })
  .on('complete', function(this: any) {
    this.forEach((t) => {
      console.log(t.toString());
    });
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  .run({ async: true });
