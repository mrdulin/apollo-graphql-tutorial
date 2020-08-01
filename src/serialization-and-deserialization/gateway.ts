import express from 'express';
import axios from 'axios';

const app = express();
const port = 3001;

app.get('/users', (req, res) => {
  axios
    .post(
      'http://localhost:3000/graphql',
      {
        query: `
      query {
        users {
          id
          email
          firstName
          lastName
        }
      }
    `,
      },
      { headers: { 'content-type': 'application/json' } },
    )
    .then((response) => res.json(response.data))
    .catch(console.log);
});

app.listen(port, () => console.log(`gateway is listening on http://localhost:${port}`));
