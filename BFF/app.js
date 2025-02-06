import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';


const app = express();

app.use(cors());
app.options('*', cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('BFF Server is running...');
});

app.listen(3000, () => {
  console.log('BFF Server is running ');
});