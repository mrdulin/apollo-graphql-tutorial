import Knex from 'knex';
import { credentials } from '../credentials';
import { IConnector } from './connector';
import { camelizeKeys } from '../util';

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
      postProcessResponse: this.postProcessResponse,
    };
    return Knex(config);
  }

  private postProcessResponse(result: any, queryContext: any) {
    return camelizeKeys(result);
  }
}

export { PostgreSQLConnector, DB };
