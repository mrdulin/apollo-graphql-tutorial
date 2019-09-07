import { camelCase, snakeCase } from 'lodash';

const camelizeKeys = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map((v) => camelizeKeys(v));
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce(
      (result, key) => ({
        ...result,
        [camelCase(key)]: camelizeKeys(obj[key]),
      }),
      {},
    );
  }
  return obj;
};

const snakeCaseKeys = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map((v) => snakeCaseKeys(v));
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce(
      (result, key) => ({
        ...result,
        [snakeCase(key)]: snakeCaseKeys(obj[key]),
      }),
      {},
    );
  }
  return obj;
};

export { camelizeKeys, snakeCaseKeys };
