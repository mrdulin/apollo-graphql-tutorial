import { mapToBindings } from '../utils';
import { knex } from '../db/knex';
import Dataloader from 'dataloader';
import { ID } from '../interfaces/common/types';
import _ from 'lodash';

const Post = {
  async findUserByIds(ids: ID[]) {
    const sql = `
      select 
        u.* 
      from posts as p
      inner join users as u using(user_id)
      where p.post_id in (${mapToBindings(ids)});
    `;
    return knex.raw(sql, ids).then(({ rows }) => rows);
  },

  async findByUserIds(ids: ID[]) {
    const sql = `
      select 
        p.*
      from posts as p
      inner join users as u using(user_id)
      where u.user_id in (${mapToBindings(ids)});
    `;
    return knex.raw(sql, ids).then(({ rows }) => rows);
  },
};

const PostLoader = {
  postAuthor: new Dataloader<ID, any>(Post.findUserByIds),
  userPosts: new Dataloader<ID, any>((keys) =>
    Post.findByUserIds(keys).then((rs) => {
      // console.log('rs: ', JSON.stringify(rs, null, 2));
      const rsGrouped = keys.map((key) => _.groupBy(rs, 'userId')[key]);
      // console.log('rsGrouped: ', JSON.stringify(rsGrouped, null, 2));
      return rsGrouped;
    }),
  ),
};

export { Post, PostLoader };
