import { mapToBindings } from '../utils';
import { knex } from '../db/knex';
import Dataloader from 'dataloader';
import { ID } from '../interfaces/common/types';
import _ from 'lodash';
import { ITagEntity } from '../interfaces/modules/tag/tag';

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

  async findTagsByIds(ids: ID[]) {
    const sql = `
      select 
        t.*
      from posts as p
      right join tags as t using(post_id)
      where p.post_id in (${mapToBindings(ids)});
    `;
    return knex.raw(sql, ids).then(({ rows }) => rows);
  },
};

const PostLoader = {
  postAuthor: new Dataloader<ID, any>(Post.findUserByIds),
  userPosts: new Dataloader<ID, any[]>((keys) =>
    Post.findByUserIds(keys).then((rs) => {
      const dataSet = keys.map((key) => _.groupBy(rs, 'userId')[key]);
      return dataSet;
    }),
  ),
  postTags: new Dataloader<ID, ITagEntity[]>((keys) =>
    Post.findTagsByIds(keys).then((rs) => groupMap(rs, keys, 'postId', /** defaultValue = */ [])),
  ),
};

/**
 *
 * @author dulin
 * @param {any[]} collection
 * @param {ID[]} keys bindings for knex raw query, use them as dataloader keys. `[ 1, 2, 3, 9 ]`
 * @param {(string | number)} iteratee
 * @param {*} [defaultValue=null] set default value for GraphQL SDL like `postTags: [Tag]!`. An empty array must be returned
 * @returns
 * ```js
 * const dataSet = [
 *  [{"tagId":1,"tagNme":"repudiandae","postId":1},{"tagId":2,"tagNme":"voluptas","postId":1}], // postId = 1
 *  [{"tagId":3,"tagNme":"cumque","postId":2}], // postId = 2
 *  [], // postId = 3
 *  [{"tagId":14,"tagNme":"MG","postId":9},{"tagId":15,"tagNme":"game","postId":9}] // postId = 9
 * ]
 * ```
 *
 */
function groupMap(collection: any[], keys: ID[], iteratee: string | number, defaultValue: any = null) {
  const dataSet = keys.map((key) => {
    const data = _.groupBy(collection, iteratee)[key];
    return data || defaultValue;
  });
  return dataSet;
}

export { Post, PostLoader };
