import path from 'path';

if (process.env.NODE_ENV !== 'production') {
  // tslint:disable-next-line: no-var-requires
  const dotenvConfigOutput = require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
  if (dotenvConfigOutput.error) {
    console.error(dotenvConfigOutput.error);
    process.exit(1);
  }
  console.log(`dotenvConfigOutput: `, JSON.stringify(dotenvConfigOutput.parsed, null, 2));
}

module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      host: process.env.SQL_HOST || '127.0.0.1',
      port: Number.parseInt(process.env.SQL_PORT || '5432', 10),
      database: process.env.SQL_DATABASE || 'postgres',
      user: process.env.SQL_USER || 'postgres',
      password: process.env.SQL_PASSWORD || '',
      ssl: process.env.SQL_SSL === 'true' ? true : false,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
      extension: 'ts',
      directory: './migrations',
    },
  },
};
