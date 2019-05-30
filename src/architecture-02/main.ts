// tslint:disable-next-line:no-var-requires
const pkg = require('../../package.json');
// tslint:disable-next-line:no-var-requires
require('@google-cloud/trace-agent').start({
  projectId: process.env.PROJECT_ID,
  keyFilename: process.env.TRACE_AGENT_CREDENTIAL,
  ignoreUrls: [/^\/\.well-known/, '^/$', '/favicon.ico'],
  ignoreMethods: ['options'],
  enabled: !process.env.DISABLE_GCP_TRACING,
  serviceContext: {
    service: pkg.name,
    version: pkg.version,
  },
});

import { createServer } from './server';
import { config } from './config';
async function bootstrap() {
  await createServer({ PORT: config.PORT, GRAPHQL_ENDPOINT: config.GRAPHQL_ENDPOINT });
}

bootstrap();
