import { PubSub, withFilter } from 'apollo-server';
import { PostgresPubSub } from 'graphql-postgres-subscriptions';
import { Client } from 'pg';
import { credentials } from './credentials';

const pubsub = new PubSub();

enum TriggerNameType {
  TEMPLATE_ADDED = 'TEMPLATE_ADDED',
}

async function createPostgresPubSub(): Promise<PubSub> {
  const client = new Client({
    host: credentials.SQL_HOST,
    port: Number.parseInt(credentials.SQL_PORT, 10),
    database: credentials.SQL_DATABASE,
    user: credentials.SQL_USER,
    password: credentials.SQL_PASSWORD,
  });
  await client.connect();
  const postgresPubSub = new PostgresPubSub({ client, commonMessageHandler });
  return postgresPubSub;
}

function commonMessageHandler(message) {
  // console.log('commonMessageHandler: ', JSON.stringify(message));
  return message;
}

export { pubsub, PubSub, TriggerNameType, withFilter, createPostgresPubSub };
