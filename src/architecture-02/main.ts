// tslint:disable-next-line:no-var-requires
require('./traceAgent');

import { createServer } from './server';
import { config } from './config';
async function bootstrap() {
  await createServer({ PORT: config.PORT, GRAPHQL_ENDPOINT: config.GRAPHQL_ENDPOINT });
}

bootstrap();
