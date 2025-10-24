// server/src/index.ts
import express from 'express';

const app = express();
const port = 3001; // フロントエンドと被らないように3001番にする

app.get('/api/health', (req, res) => {
  res.send({ message: 'サーバーは正常に起動しています！' });
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});