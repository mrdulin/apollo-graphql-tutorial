import * as _ from 'lodash';
import { IResolvers } from 'graphql-tools';

import { ILocation, ITemplate, UserType, IUser } from './datasources/memoryDB';
import { ICommonResponse } from './models/CommonResponse';
import { pubsub, TriggerNameType, withFilter } from './pubsub';
import { IAppContext, ISubscriptionContext } from './server';
import { Omit } from './models/Base';
import { intersection } from './util';

interface ISubscriptionPayload<Data, Context> {
  data: Data;
  context: Context;
}

const resolvers: IResolvers = {
  Query: {
    templates: (__, ___, { templateConnector }: IAppContext): ITemplate[] => {
      return templateConnector.findAll();
    },

    templateById: (__, { id }, { templateConnector }: IAppContext): ITemplate | undefined => {
      return templateConnector.findById(id);
    },

    locations: (__, ___, { locationConnector }: IAppContext): ILocation[] => {
      return locationConnector.findAll();
    },

    locationsByOrgId: (__, { id }, { locationConnector }: IAppContext): ILocation[] => {
      return locationConnector.findLocationsByOrgId(id);
    }
  },

  Mutation: {
    editTemplate: (__, { templateInput }, { templateConnector }: IAppContext): ICommonResponse => {
      return templateConnector.edit(templateInput);
    },

    addTemplate: (
      __,
      { templateInput },
      { templateConnector, userConnector, requestingUser }: IAppContext
    ): Omit<ICommonResponse, 'payload'> | undefined => {
      if (userConnector.isAuthrized(requestingUser)) {
        const commonResponse: ICommonResponse = templateConnector.add(templateInput);
        if (commonResponse.payload) {
          const payload = {
            data: commonResponse.payload,
            context: {
              requestingUser
            }
          };
          templateConnector.publish(payload);
        }

        return _.omit(commonResponse, 'payload');
      }
    }
  },

  Subscription: {
    templateAdded: {
      resolve: (
        payload: ISubscriptionPayload<ITemplate, Pick<IAppContext, 'requestingUser'>>,
        args: any,
        subscriptionContext: ISubscriptionContext,
        info: any
      ): ITemplate => {
        return payload.data;
      },
      subscribe: withFilter(templateIterator, templateFilter)
    }
  }
};

function templateIterator() {
  return pubsub.asyncIterator([TriggerNameType.TEMPLATE_ADDED]);
}

async function templateFilter(
  payload?: ISubscriptionPayload<ITemplate, Pick<IAppContext, 'requestingUser'>>,
  args?: any,
  subscriptionContext?: ISubscriptionContext,
  info?: any
): Promise<boolean> {
  const NOTIFY: boolean = true;
  const DONT_NOTIFY: boolean = false;
  if (!payload || !subscriptionContext) {
    return DONT_NOTIFY;
  }

  const { userConnector, locationConnector } = subscriptionContext;
  const { data: template, context } = payload;

  if (!subscriptionContext.subscribeUser || !context.requestingUser) {
    return DONT_NOTIFY;
  }

  let results: IUser[];
  try {
    results = await Promise.all([
      userConnector.findByEmail(subscriptionContext.subscribeUser.email),
      userConnector.findByEmail(context.requestingUser.email)
    ]);
  } catch (error) {
    console.error(error);
    return DONT_NOTIFY;
  }

  const [subscribeUser, requestingUser] = results;

  // user himself/herself
  if (subscribeUser.id === requestingUser.id) {
    return DONT_NOTIFY;
  }

  const notificationIds = template.shareLocationIds;
  let subscribeLocationIds: string[] = [];
  switch (subscribeUser.userType) {
    case UserType.ZOLO:
    case UserType.ZELO:
      if (subscribeUser.locationId) {
        subscribeLocationIds = [subscribeUser.locationId];
      }
      break;
    case UserType.ZEWI:
    case UserType.ZOWI:
      if (subscribeUser.orgId) {
        subscribeLocationIds = locationConnector.findLocationIdsByOrgId(subscribeUser.orgId);
      }
      break;
  }

  const shouldNotify: boolean = intersection(notificationIds, subscribeLocationIds).length > 0;

  return shouldNotify;
}

export { resolvers };
