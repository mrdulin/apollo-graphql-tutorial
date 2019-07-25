import path from 'path';

if (process.env.NODE_ENV !== 'production') {
  // tslint:disable-next-line: no-var-requires
  const dotenv = require('dotenv');
  const dotenvConfigOutput = dotenv.config({ path: path.resolve(__dirname, './.env') });
  if (dotenvConfigOutput.error) {
    console.error(dotenvConfigOutput.error);
    process.exit(1);
  }
}
// tslint:disable-next-line:no-var-requires
require('./traceAgent');

import { createServer } from './server';
import { config } from './config';
import { credentials } from './credentials';

async function bootstrap() {
  console.log(`config: ${JSON.stringify(config, null, 2)}`);
  console.log(`credentials: ${JSON.stringify(credentials, null, 2)}`);

  await createServer({ PORT: config.PORT, GRAPHQL_ENDPOINT: config.GRAPHQL_ENDPOINT });
}

bootstrap();
