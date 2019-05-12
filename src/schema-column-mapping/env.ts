import dotenv, { DotenvConfigOutput, DotenvParseOutput } from 'dotenv';
import path from 'path';

interface ICredentials {
  SQL_HOST: string;
  SQL_PORT: string;
  SQL_DATABASE: string;
  SQL_USER: string;
  SQL_PASSWORD: string;
  APOLLO_ENGINE_API_KEY: string;
}

type EnvVars = DotenvParseOutput & ICredentials;

function loadEnv(): EnvVars {
  const dotenvConfigOutput: DotenvConfigOutput = dotenv.config({ path: path.resolve(__dirname, './.env') });
  if (dotenvConfigOutput.error) {
    throw dotenvConfigOutput.error;
  }
  const envVars: EnvVars = {
    SQL_HOST: '',
    SQL_PORT: '',
    SQL_DATABASE: '',
    SQL_USER: '',
    SQL_PASSWORD: '',
    APOLLO_ENGINE_API_KEY: '',
    ...dotenvConfigOutput.parsed,
  };
  return envVars;
}

export { loadEnv, ICredentials, EnvVars };
