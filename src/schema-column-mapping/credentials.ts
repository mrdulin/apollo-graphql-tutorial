import { ICredentials, loadEnv } from './env';

loadEnv();

export const credentials: ICredentials = {
  SQL_HOST: process.env.SQL_HOST || '',
  SQL_PORT: process.env.SQL_PORT || '',
  SQL_DATABASE: process.env.SQL_DATABASE || '',
  SQL_USER: process.env.SQL_USER || '',
  SQL_PASSWORD: process.env.SQL_PASSWORD || '',
};

export { ICredentials };
