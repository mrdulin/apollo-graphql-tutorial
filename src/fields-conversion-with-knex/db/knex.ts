import knex from 'knex';
import humps from 'humps';
import { logger } from '../utils';

import '../config/env';

const connection = {
  host: process.env.SQL_HOST || '127.0.0.1',
  port: Number.parseInt(process.env.SQL_PORT || '5432', 10),
  database: process.env.SQL_DATABASE || 'postgres',
  user: process.env.SQL_USER || 'postgres',
  password: process.env.SQL_PASSWORD || '',
  ssl: process.env.SQL_SSL === 'true' ? true : false,
};
console.log('db connection config: ', JSON.stringify(connection, null, 2));

const config: knex.Config = {
  client: 'pg',
  connection,
  pool: {
    min: 2,
    max: 10,
  },
  debug: process.env.NODE_ENV !== 'production',
  wrapIdentifier: (value, origImpl, queryContext) => {
    logger.debug(`[wrapIdentifier] value = ${value}`);
    const identifier = origImpl(humps.decamelize(value));
    logger.debug(`[wrapIdentifier] identifier = ${identifier}`);
    return identifier;
  },
  postProcessResponse: (result, queryContext) => {
    logger.debug(result, { context: 'postProcessResponse' });
    if (result.rows) {
      return humps.camelizeKeys(result);
    }
    return humps.camelizeKeys(result);
  },
};

const Knex = knex(config);

export { Knex as knex };
