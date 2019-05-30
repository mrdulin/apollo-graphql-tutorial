import Knex from 'knex';
import { credentials } from '../credentials';
import { IConnector } from './connector';
import { camelizeKeys } from '../util';

type DB = Knex;

class PostgreSQLConnector implements IConnector<DB> {
  public connect(): DB {
    const config: Knex.Config = {
      client: 'pg',
      connection: {
        host: credentials.SQL_HOST,
        port: Number.parseInt(credentials.SQL_PORT, 10),
        database: credentials.SQL_DATABASE,
        user: credentials.SQL_USER,
        password: credentials.SQL_PASSWORD,
      },
      pool: {
        min: 1,
        max: 1,
      },
      debug: process.env.NODE_ENV !== 'production',
      postProcessResponse: this.postProcessResponse,
    };
    return Knex(config);
  }

  private postProcessResponse(result: any, queryContext: any) {
    if (result.rows && result.rows.length) {
      result.rows = result.rows.map((row: any) => {
        return camelizeKeys(row);
      });
      return result;
    }
    return camelizeKeys(result);
  }
}

export { PostgreSQLConnector, DB };
