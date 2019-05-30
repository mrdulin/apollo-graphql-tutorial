import { createLogger } from 'dl-toolkits';

const logger = createLogger({ serviceName: 'apollo-graphql-tutorial' });

function sleep(ms: number, verbose?: boolean): Promise<void> {
  if (verbose) {
    const unit = 1000;
    logger.info(`start the timer...${ms / unit}s`);
    const intervalId = setInterval(() => {
      ms -= unit;
      if (ms > 0) {
        logger.info(`${ms / unit}s`);
      } else {
        logger.info('timer end');
        clearInterval(intervalId);
      }
    }, unit);
  }
  return new Promise((resolve) => setTimeout(resolve, ms));
}
export { logger, sleep };
