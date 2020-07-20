import { gql, makeExecutableSchema } from 'apollo-server';

const typeDefs = gql`
  type EpUserData {
    id: ID!
    user_presence: String
    user_presence_time_of_last_update: String
  }
  type Query {
    dummy: String
  }
  type Mutation {
    cronJobToFindUsersWhoHaveGoneOffline(timeStarted: String): EpUserData
  }
`;

const resolvers = {
  Mutation: {
    async cronJobToFindUsersWhoHaveGoneOffline(parent, args, context) {
      const usersWhoWentOffline = { id: 1, user_presence: 'test', user_presence_time_of_last_update: '2020' };
      return Promise.resolve()
        .then(() => {
          return usersWhoWentOffline;
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};

const schema = makeExecutableSchema({ typeDefs, resolvers });

export { schema };
