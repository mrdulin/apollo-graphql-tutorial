// tslint:disable-next-line:no-var-requires
const pkg = require('../../package.json');
// tslint:disable-next-line:no-var-requires
const traceAgent = require('@google-cloud/trace-agent');
const tracer = traceAgent.start({
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

module.exports = { tracer, traceAgent };
