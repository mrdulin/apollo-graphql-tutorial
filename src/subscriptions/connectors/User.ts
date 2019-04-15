import { UserType, IMemoryDB, IUser } from '../datasources/memoryDB';
import { BaseConnector } from './Base';

class UserConnector<Datasource extends IMemoryDB> extends BaseConnector<Datasource> {
  constructor(datasource: Datasource) {
    super(datasource);
  }

  public findUserByUserType(type: UserType): IUser | undefined {
    try {
      const user = this.datasource.users.find((u: IUser): boolean => u.userType === type);
      if (!user) {
        throw new Error('No user found.');
      }
      return user;
    } catch (error) {
      console.error(error);
      throw new Error(`Find user by user type failed. userType: ${type}`);
    }
  }
}

export { UserConnector };
