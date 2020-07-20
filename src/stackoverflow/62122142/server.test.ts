import { graphql } from 'graphql';
import { schema } from './schema';
import { server } from './server';

const CRON_JOB_TO_FIND_USERS_WHO_HAVE_GONE_OFFLINE_MUTATION = `
    mutation ($timeStarted: String){
        cronJobToFindUsersWhoHaveGoneOffline(timeStarted: $timeStarted){
                id,
                user_presence,
                user_presence_time_of_last_update
        },
    }
`;

describe('62122142', () => {
  beforeAll(async () => {
    const { url } = await server.listen();
    console.log(`server is listening on ${url}`);
  });
  afterAll(async () => {
    await server.stop();
  });
  it('should pass', async () => {
    const { data, errors } = await graphql(
      schema,
      CRON_JOB_TO_FIND_USERS_WHO_HAVE_GONE_OFFLINE_MUTATION,
      {},
      { caller: 'synced-cron' },
      {
        timeStarted: new Date()
          .toISOString()
          .slice(0, 19)
          .replace('T', ' '),
      },
    );
    console.log('data', data);
    console.log('errors', errors);

    return true;
  });
});
