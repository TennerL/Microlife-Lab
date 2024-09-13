import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(path.dirname(fileURLToPath(import.meta.url)), '../renderer/views'));
//app.use(express.static(path.join(path.dirname(fileURLToPath(import.meta.url)), '../assets')));
app.use(express.static('public'));
app.use(express.static('assets'));

app.get('/', (req, res) => {
  res.render('../views/pages/start/index.ejs', { title: 'Start' });
});

app.get('/main', (req, res) => {
  res.render('../views/pages/main/index.ejs', {title: 'Versuch'})
})

app.get('/simulation', (req, res) => {
  res.render('../views/pages/simulation/index.ejs', {title: 'Simulation'})
})

export default app;
