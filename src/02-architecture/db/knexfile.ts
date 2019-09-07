import path from 'path';
import { credentials } from '../credentials';

const settings = {
  development: {
    client: 'postgresql',
    connection: {
      host: credentials.SQL_HOST,
      port: credentials.SQL_PORT,
      database: credentials.SQL_DATABASE,
      user: credentials.SQL_USER,
      password: credentials.SQL_PASSWORD,
    },
    debug: true,
    pool: {
      min: 2,
      max: 20,
    },
    migrations: {
      directory: path.resolve(__dirname, './migrations'),
    },
    seeds: {
      directory: path.resolve(__dirname, './seeds'),
    },
  },
};

module.exports = settings;
