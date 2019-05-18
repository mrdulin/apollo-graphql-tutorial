import { IUserRepsitory } from './UserRepsitory';
import { ID } from '../../@types';
import { IDataSource } from '../../datasources/datasource';
import { UserEntityData } from '../../models/User/UserEntity';
import { ILowDbConnector } from '../../connectors/LowDBConnectorImpl';

class UserRepositoryImpl implements IUserRepsitory<UserEntityData> {
  private connector: ILowDbConnector<UserEntityData>;
  constructor(dataSource: IDataSource) {
    this.connector = dataSource.getConnector() as ILowDbConnector<UserEntityData>;
  }
  public async findById(id: ID): Promise<UserEntityData> {
    return this.connector.findById('users', id);
  }
}

export { UserRepositoryImpl };
