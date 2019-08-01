import { createLogger } from 'dl-toolkits';

const logger = createLogger();

function mapToBindings(parameters: any[]) {
  return parameters.map(() => '?').join(',');
}

export { logger, mapToBindings };
