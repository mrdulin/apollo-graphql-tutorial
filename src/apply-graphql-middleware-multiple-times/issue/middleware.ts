const logCount = async (resolve, root, args, context, info) => {
  console.count('log middleware execute count');
  const result = await resolve(root, args, context, info);
  return result;
};

export { logCount };
