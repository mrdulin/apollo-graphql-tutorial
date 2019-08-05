import { ID } from '../interfaces/common/types';
import { mapToBindings } from '../utils';
import { knex } from '../db/knex';
import Dataloader from 'dataloader';

const User = {
  async findByIds(ids: ID[]) {
    const sql = `
      select 
        *
      from users
      where user_id in (${mapToBindings(ids)})
    `;
    return knex.raw(sql, ids).then(({ rows }) => rows);
  },
};

interface IUserLoader {
  userFriends: Dataloader<ID, object[]>;
}

const UserLoader: IUserLoader = {
  userFriends: new Dataloader<ID, object[]>((keys) =>
    User.findByIds(keys).then((rs) => {
      return keys.map((key) => rs.find((r) => r.userId === key));
    }),
  ),
};

export { User, UserLoader, IUserLoader };
