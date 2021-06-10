import { ApolloServer, gql } from 'apollo-server-express';
import express from 'express';
import path from 'path';
import { createWriteStream, unlink } from 'fs';
import { graphqlUploadExpress } from 'graphql-upload';

const app = express();
const PORT = 3000;
const UPLOAD_DIR = path.resolve(__dirname, './uploads');

const typeDefs = gql`
  scalar Upload
  type Query {
    dummy: String
  }
  type Mutation {
    upload(upload: Upload!): Boolean
  }
`;

const resolvers = {
  Query: {},
  Mutation: {
    async upload(_, { upload }) {
      const { file } = upload;
      const { filename, mimetype, createReadStream } = await file;
      const stream = createReadStream();
      const id = Date.now();
      const uploadPath = `${UPLOAD_DIR}/${id}-${filename}`;
      console.log(filename, mimetype, createReadStream, stream);

      await new Promise((resolve, reject) => {
        const writeStream = createWriteStream(uploadPath);
        writeStream.on('finish', resolve);
        writeStream.on('error', (error) => {
          unlink(uploadPath, () => {
            reject(error);
          });
        });
        stream.on('error', (error) => writeStream.destroy(error));
        stream.pipe(writeStream);
      });

      return true;
    },
  },
};

app.use(
  graphqlUploadExpress({
    maxFileSize: 30000000,
    maxFiles: 20,
  }),
);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  uploads: false,
});

server.applyMiddleware({ app });

app.listen(PORT, () => console.log(`GraphQL server is listening on http://localhost:${PORT}/graphql`));
