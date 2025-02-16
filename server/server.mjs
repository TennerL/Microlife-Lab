
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3000;


const __dirname = path.dirname(fileURLToPath(import.meta.url));  
const publicPath = path.join(__dirname, '../public');
const assetsPath = path.join(__dirname, '../assets');


app.use(express.static(publicPath));
app.use(express.static(assetsPath));


app.use('/assets/images', express.static(path.join(assetsPath, 'images')));
app.use('/assets/plugins', express.static(path.join(assetsPath, 'plugins')));
app.use('/public/js', express.static(path.join(publicPath, 'js')));


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../renderer/views'));


app.get('/', (req, res) => {
  res.render('pages/start/index.ejs', { title: 'Start' });
});

app.get('/main', (req, res) => {
  res.render('pages/main/index.ejs', { title: 'Versuch' });
});

app.get('/simulation', (req, res) => {
  res.render('pages/simulation/index.ejs', { title: 'Simulation' });
});

app.get('/chart', (req, res) => {
  res.render('pages/chart/index.ejs', { title: 'Chart' });
});

export default app;
