import path from 'path';

if (process.env.NODE_ENV !== 'production') {
  // tslint:disable-next-line: no-var-requires
  const dotenvConfigOutput = require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
  if (dotenvConfigOutput.error) {
    console.error(dotenvConfigOutput.error);
    process.exit(1);
  }
  console.log(`dotenvConfigOutput: `, JSON.stringify(dotenvConfigOutput.parsed, null, 2));
}
