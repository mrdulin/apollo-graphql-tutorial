import path from 'path';
import { logger } from '../utils';

if (process.env.NODE_ENV !== 'production') {
  // tslint:disable-next-line: no-var-requires
  const dotenvConfigOutput = require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
  if (dotenvConfigOutput.error) {
    logger.error(dotenvConfigOutput.error);
    process.exit(1);
  }
  logger.debug(`dotenvConfigOutput: `, { arguments: { dotenvConfigOutput } });
}
