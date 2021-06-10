import express from 'express';
import faker from 'faker';

const app = express();
const port = 3000;

app.use(express.json());
app.post('/api/transaction/getbyhash', (req, res) => {
  console.log(req.body);
  res.json({
    email: faker.internet.email(),
    name: faker.name.findName(),
  });
});

app.listen(port, () => console.log(`HTTP server is listening on http://localhost:${port}`));
