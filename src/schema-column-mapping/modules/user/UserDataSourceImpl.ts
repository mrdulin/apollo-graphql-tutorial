import { PostgresSQLDataCource } from '../../datasources';
import { IUserDataSource } from './userDataSource';

class UserDataSourceImpl extends PostgresSQLDataCource implements IUserDataSource {
  constructor() {
    super();
  }
  public async findById(id: string) {
    return this.db('users')
      .where({ user_id: id })
      .get(0);
  }
}

export { UserDataSourceImpl };
