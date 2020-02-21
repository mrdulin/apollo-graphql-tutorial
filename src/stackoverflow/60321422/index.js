const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

app.get('/api/genres', (req, res) => {
  console.log('api genres');
  res.sendStatus(200);
});

const server = app.listen(port, () => console.log(`Listening on port ${port}`));

module.exports = server;
