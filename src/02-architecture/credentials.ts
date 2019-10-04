interface ICredentials {
  SQL_HOST: string;
  SQL_PORT: string;
  SQL_DATABASE: string;
  SQL_USER: string;
  SQL_PASSWORD: string;
  APOLLO_ENGINE_API_KEY: string;
  TRACE_AGENT_CREDENTIAL: string;
}

export const credentials: ICredentials = {
  SQL_HOST: process.env.SQL_HOST || '127.0.0.1',
  SQL_PORT: process.env.SQL_PORT || '5432',
  SQL_DATABASE: process.env.SQL_DATABASE || 'postgres',
  SQL_USER: process.env.SQL_USER || 'postgres',
  SQL_PASSWORD: process.env.SQL_PASSWORD || '',
  APOLLO_ENGINE_API_KEY: process.env.APOLLO_ENGINE_API_KEY || '',
  TRACE_AGENT_CREDENTIAL: process.env.TRACE_AGENT_CREDENTIAL || '',
};

export { ICredentials };
