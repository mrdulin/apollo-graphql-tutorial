import { IResolvers } from 'apollo-server';
import fs, { ReadStream } from 'fs';
import path from 'path';
import { logger } from '../util';

interface ICommonResponse {
  code: number;
  message: string;
}

const resolvers: IResolvers = {
  Query: {
    uploads: (_, args) => {
      return '';
    },
  },
  Mutation: {
    singleUpload: async (_, { file }): Promise<ICommonResponse> => {
      // DeprecationWarning: File upload property ‘stream’ is deprecated. Use ‘createReadStream()’ instead
      const { stream, filename, mimetype, encoding, createReadStream } = await file;
      // console.log('createReadStream:', createReadStream);
      // logger.debug('file', { arguments: { filename, mimetype, encoding, createReadStream } });
      const w = fs.createWriteStream(path.resolve(__dirname, `./storage/${filename}`));

      const r: ReadStream = createReadStream();

      return new Promise((resolve, reject) => {
        const response: ICommonResponse = {
          code: 0,
          message: '',
        };
        r.pipe(w)
          .on('error', (error) => {
            logger.error(error);
            response.code = 1;
            response.message = error.message;
            resolve(response);
          })
          .on('finish', () => resolve(response));
      });
    },
  },
};

export { resolvers };
