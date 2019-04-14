import { UserType, IMemoryDB } from '../datasources/memoryDB';
import { BaseConnector } from './Base';

class UserConnector<Datasource extends IMemoryDB> extends BaseConnector<Datasource> {
  constructor(datasource: Datasource) {
    super(datasource);
  }

  public findUserByUserType(type: UserType) {
    return this.datasource.users.find(user => user.userType === type);
  }
}

export { UserConnector };
