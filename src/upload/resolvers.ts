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
      const { filename, mimetype, encoding, createReadStream } = await file;
      const uploadPath = path.resolve(__dirname, `./storage/${filename}`);
      const w = fs.createWriteStream(uploadPath);
      const stream: ReadStream = createReadStream();
      const response: ICommonResponse = { code: 0, message: '' };
      return new Promise((resolve, reject) => {
        stream
          .on('error', (error) => {
            console.error(error);
            fs.unlinkSync(uploadPath);
            reject(error);
          })
          .pipe(w)
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
