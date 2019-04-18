import { AuthenticationError } from 'apollo-server';
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
      console.log(`Found user: `, user);
      return user;
    } catch (error) {
      console.error(error);
      throw new Error(`Find user by user type failed. userType: ${type}`);
    }
  }

  public isAuthrized(user: IUser | undefined, roles?: string[]): boolean {
    if (!user) {
      throw new AuthenticationError('No authorized. user not found.');
    }

    if (roles) {
      if (!roles.includes(user.userType)) {
        throw new AuthenticationError(
          `No permission. userType: ${user.userType}. User roles should be one of: ${JSON.stringify(roles)}`,
        );
      }
    }

    return true;
  }

  public async findByEmail(email: string): Promise<IUser> {
    return new Promise((resolve, reject) => {
      process.nextTick(() => {
        const user = this.datasource.users.find((u: IUser): boolean => u.email === email);
        if (!user) {
          reject(new Error('No user found.'));
        }
        resolve(user);
      });
    });
  }
}

export { UserConnector };
