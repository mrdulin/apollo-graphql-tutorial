import { PostgresSQLDataCource } from '../../datasources';
import { IUserDataSource } from './userDataSource';
import { User } from '../../db/models';
import _ from 'lodash';

class UserDataSourceImpl extends PostgresSQLDataCource implements IUserDataSource {
  constructor() {
    super();
  }
  public async findById(id: string) {
    const selectFields = this.getSelectFields();
    return this.db('users')
      .where({ user_id: id })
      .select(selectFields)
      .get(0);
  }

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
