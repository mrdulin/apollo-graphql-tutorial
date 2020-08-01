import multer from 'multer';
import express from 'express';
import path from 'path';

const upload = multer({ dest: path.resolve(__dirname, 'uploads/') });
const app = express();
const port = 3000;

app.post('/upload', upload.single('file'), (req, res) => {
  console.log(req.file);
  console.log(req.body);
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`upload server is listening on http://localhost:${port}`);
});
