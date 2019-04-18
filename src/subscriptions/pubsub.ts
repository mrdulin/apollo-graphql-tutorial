import { PubSub, withFilter } from 'apollo-server';

const pubsub = new PubSub();

enum TriggerNameType {
  TEMPLATE_ADDED = 'TEMPLATE_ADDED',
}

export { pubsub, PubSub, TriggerNameType, withFilter };
