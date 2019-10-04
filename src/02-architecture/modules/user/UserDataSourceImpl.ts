import { PostgresSQLDataCource, DataLoader } from '../../datasources';
import { IUserDataSource } from './UserDataSource';
import { User } from '../../db/models';
import _ from 'lodash';
import { sleep } from '../../../util';

class UserDataSourceImpl extends PostgresSQLDataCource implements IUserDataSource {
  private userLoader: DataLoader<string, any>;
  private userLoaderLodash;

  private ids: string[] = [];
  constructor() {
    super();
    this.userLoader = this.createLoader(this.findByIds.bind(this));
    this.userLoaderLodash = _.memoize(this.findByIds.bind(this));
  }

  public async findByIds(ids: string[]) {
    return this.db('users').whereIn('user_id', ids);
  }

  /**
   * lodash.memoize batching and caching
   *
   * @author dulin
   * @param {string} id
   * @returns
   * @memberof UserDataSourceImpl
   */
  public async findById(id: string) {
    // this.ids.push(id);
    // return new Promise((resolve, reject) => {
    //   process.nextTick(() => {
    //     this.userLoaderLodash(this.ids).then((users: any[]) => {
    //       resolve(_.first(users));
    //     });
    //   });
    // }).then((user) => {
    //   this.ids = [];
    //   return user;
    // });

    return this.userLoader.load(id);
  }

  // public async findById(id: string) {
  //   const selectFields = this.getSelectFields();
  //   await sleep(1000);
  //   return await this.db('users')
  //     .where({ user_id: id })
  //     .select(selectFields)
  //     .get(0);
  // }

  /**
   * knex raw query for testing cloud trace
   *
   * @author dulin
   * @param {string} id
   * @returns
   * @memberof UserDataSourceImpl
   */
  // public async findById(id: string) {
  //   const query = `select * from users where user_id = ?`;
  //   return await this.db
  //     .raw(query, [id])
  //     .get('rows')
  //     .get(0);
  // }

  public async findAll() {
    return this.db('users');
  }
  private getSelectFields() {
    const user = new User();
    const userFields = Object.keys(user);
    const selectFields = _.intersection(userFields, this.context.selectFields);
    return selectFields;
  }
}

export { UserDataSourceImpl };
