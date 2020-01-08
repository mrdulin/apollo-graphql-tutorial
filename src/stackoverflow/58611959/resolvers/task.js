const uuid = require('uuid');
const { tasks, users } = require('../constants');

module.exports = {
  Query: {
    tasks: () => {
      return tasks;
    },
    task: (_, { id }) => {
      return tasks.find((task) => task.id === id);
    },
  },
  Mutation: {
    createTask: (_, { input }) => {
      const task = { ...input, id: uuid.v4() };
      tasks.push(task);
      return task;
    },
  },
  Task: {
    user: ({ userId }) => users.find((user) => user.id === userId),
  },
};
