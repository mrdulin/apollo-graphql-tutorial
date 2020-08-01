const logCount = async (resolve, root, args, context, info) => {
  console.count('log middleware execute count');
  const result = await resolve(root, args, context, info);
  return result;
};

const logCountStandalone = {
  Query: {
    hello: async (resolve, parent, args, context, info) => {
      console.count('log middleware standalone execute count');
      const result = await resolve(parent, args, context, info);
      return result;
    },
  },
};

export { logCount, logCountStandalone };
