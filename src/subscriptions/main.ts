import { createServer, IServerOptions } from './server';
import { config } from './config';

async function main() {
  const options: IServerOptions = {
    PORT: config.HTTP_SERVER.PORT
  };
  await createServer(options);
}

if (require.main === module) {
  main();
}
