export const skip = undefined;
export const combineResolvers = (...funcs) => (...args) =>
  funcs.reduce(
    (prevPromise, resolver) => prevPromise.then((prev) => (prev === skip ? resolver(...args) : prev)),
    Promise.resolve(),
  );
