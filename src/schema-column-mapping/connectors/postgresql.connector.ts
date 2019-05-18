import Knex from 'knex';
import { credentials } from '../credentials';
import { IConnector } from './connector';

type DB = Knex;

class PostgreSQLConnector implements IConnector {
  public connect(): DB {
    const config: Knex.Config = {
      client: 'pg',
      connection: {
        host: credentials.SQL_HOST,
        port: credentials.SQL_PORT,
        database: credentials.SQL_DATABASE,
        user: credentials.SQL_USER,
        password: credentials.SQL_PASSWORD,
      },
      pool: {
        min: 1,
        max: 1,
      },
      debug: true,
    };
    return Knex(config);
  }
}

export { PostgreSQLConnector, DB };
