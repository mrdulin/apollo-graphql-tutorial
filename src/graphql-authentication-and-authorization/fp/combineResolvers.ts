import { IFieldResolver } from 'graphql-tools';

export const skip = undefined;

export const combineResolvers = (...funcs: Array<IFieldResolver<any, any>>): IFieldResolver<any, any> => (...args) =>
  funcs.reduce(
    (prevPromise, resolver) => prevPromise.then((prev) => (prev === skip ? resolver(...args) : prev)),
    Promise.resolve(),
  );
