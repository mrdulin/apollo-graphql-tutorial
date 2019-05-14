import { UserRepositoryImpl } from './repositories/User/UserRepositoryImpl';
import { DataSourceImpl } from './datasources/DataSourceImpl';
import { createServer, IAppContext } from './server';
import { Context } from 'apollo-server-core';
import { IUserRepsitory } from './repositories/User/UserRepsitory';
import { UserEntityData } from './models/User/UserEntity';

async function main() {
  const lowDbDataSource = new DataSourceImpl({ name: 'lowdb', settings: {} });
  await lowDbDataSource.initialize();

  const contextFunction = (): Context<IAppContext> => {
    const userRepositoryImpl: IUserRepsitory<UserEntityData> = new UserRepositoryImpl(lowDbDataSource);
    return {
      userRepositoryImpl,
    };
  };

  await createServer({ PORT: process.env.PORT || '3000', contextFunction });
}

if (require.main === module) {
  main();
}
