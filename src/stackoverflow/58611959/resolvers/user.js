const { users, tasks } = require('../constants');

module.exports = {
  Query: {
    users: () => users,
    user: (_, { id }) => users.find((user) => user.id === id),
  },
  Mutation: {
    signup: async (_, { input }) => {
      return '';
    },
  },
  User: {
    tasks: ({ id }) => tasks.filter((task) => task.userId === id),
  },
};
