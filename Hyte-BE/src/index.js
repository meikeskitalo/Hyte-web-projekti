import express from 'express';
import cors from 'cors';
import userRouter from './routes/user-router.js';
import authRouter from './routes/auth-router.js';
import entryRouter from './routes/entry-router.js';
import { errorHandler, notFoundHandler } from './middlewares/error-handler.js';
const hostname = '127.0.0.1';
const app = express();
const port = 3000;

// middleware, mitä tarvitaan, jotta Ullan fronttiharjoitukset toimivat (Vite)
// lisää myös: import cors from 'cors'; tiedoston yläosaan
// ja asenna paketti: npm install cors
app.use(cors());

// Staattinen html-sivusto tarjoillaan palvelimen juuressa
app.use('/', express.static('public'));
// middleware, joka lukee json data POST-pyyntöjen rungosta (body)
app.use(express.json());

// rest-apin dokumentaatio tarjoillaan /api-juuripolun alla
app.use('/api', express.static('docs'));
app.use('/docs', express.static('docs'));


// Users resurssin päätepisteet (endpoints)
app.use('/api/users', userRouter);
// käyttäjäautentikaatio (kirjautuminen)
app.use('/api/auth', authRouter);
// Päiväkirjamerkinnät
app.use('/api/entries', entryRouter);

// 404 virheitä varten
app.use(notFoundHandler);
// yleinen virhevastausten lähettäjä kaikkia virhetilanteita varten
app.use(errorHandler);

// palvelimen käynnistys lopuksi kaikkien määritysten jälkeen
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

